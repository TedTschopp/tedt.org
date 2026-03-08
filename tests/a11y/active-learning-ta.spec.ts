import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const PROMPT_PATH = process.env.LOCAL_PROMPT_PATH || '/prompts/business-case-and-requirements-assistant/';
const failOnViolations = process.env.A11Y_FAIL_ON_VIOLATIONS === '1';

test.describe('Prompt Details Accessibility', () => {
  test('reports serious or critical accessibility violations for a representative prompt page', async ({ page }) => {
    await page.goto(PROMPT_PATH, { waitUntil: 'domcontentloaded' });

    // Allow any dynamic fonts or theming scripts to run
    await page.waitForTimeout(1000);

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const violations = accessibilityScanResults.violations.filter(v =>
      ['serious', 'critical'].includes(v.impact || '')
    );

    if (violations.length) {
      console.log(`\nAccessibility Violations (serious/critical) for ${PROMPT_PATH}:`);
      for (const v of violations) {
        console.log(`- ${v.id}: ${v.help} (Impact: ${v.impact})`);
        console.log(`  Help: ${v.helpUrl}`);
        v.nodes.slice(0,5).forEach(n => {
          console.log('  Affected HTML:', n.html.substring(0,200));
          if (n.failureSummary) console.log('  Failure:', n.failureSummary);
        });
      }
    }

    if (failOnViolations) {
      expect(violations, 'Serious or critical accessibility violations detected').toHaveLength(0);
    }
  });
});
