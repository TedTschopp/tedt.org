import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Basic WCAG audit for the production URL using the prompt-details layout
const URL = 'https://tedt.org/Active-Learning-Teaching-Assistant/';

test.describe('Active Learning Teaching Assistant - Accessibility', () => {
  test('should have no serious or critical accessibility violations', async ({ page }) => {
    await page.goto(URL, { waitUntil: 'domcontentloaded' });

    // Allow any dynamic fonts or theming scripts to run
    await page.waitForTimeout(1000);

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const violations = accessibilityScanResults.violations.filter(v =>
      ['serious', 'critical'].includes(v.impact || '')
    );

    if (violations.length) {
      console.log('\nAccessibility Violations (serious/critical):');
      for (const v of violations) {
        console.log(`- ${v.id}: ${v.help} (Impact: ${v.impact})`);
        console.log(`  Help: ${v.helpUrl}`);
        v.nodes.slice(0,5).forEach(n => {
          console.log('  Affected HTML:', n.html.substring(0,200));
          if (n.failureSummary) console.log('  Failure:', n.failureSummary);
        });
      }
    }

    expect(violations, 'Serious or critical accessibility violations detected').toHaveLength(0);
  });
});
