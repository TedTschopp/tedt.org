# Accessibility Test Suite

This directory contains the site's accessibility-oriented Playwright coverage, including a representative axe baseline and focused regression checks for navigation and contrast.

## Test Files

### 1. `a11y/site-baseline.spec.ts`

Runs a repeatable axe audit across a representative page set:

- Homepage
- Prompt library
- Prompt detail page
- Profile page
- Category archive
- Long-form article

Outputs the latest report to:

- `reports/accessibility/site-baseline.json`
- `reports/accessibility/site-baseline.md`

### 2. `accessibility-tests.html`

Tests WCAG 2.1 AA compliance including:

- Keyboard navigation functionality
- ARIA labels and descriptions
- Color contrast validation
- Form accessibility features

### 3. `mobile-responsive-tests.html`

Tests responsive design across different viewports:

- Viewport breakpoint behavior
- Touch target size requirements (44px minimum)
- Content layout adaptation
- Button stacking and overflow prevention

### 4. `form-interaction-tests.html`

Tests user interaction flows:

- Variable form toggle functionality
- Form validation logic
- Real-time preview updates
- Loading state animations

### 5. Focused Playwright regression specs

- `a11y/active-learning-ta.spec.ts`: representative prompt-details axe check
- `a11y/footer-contrast.spec.ts`: footer contrast guardrail
- `a11y/dropdown-smoke.spec.ts`: navbar dropdown smoke coverage
- `a11y/navbar-regression.spec.ts`: navbar behavior across representative pages

## Running the Tests

### Manual Testing

1. Open each HTML file in a web browser
2. Tests run automatically on page load
3. Results are displayed with pass/fail indicators
4. Resize browser window to test responsive behavior

### Browser Compatibility Testing

Test across the following browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Mobile Device Testing

Test on actual devices:

- iOS devices (iPhone, iPad)
- Android devices (various screen sizes)

## Automated Testing Integration

For CI/CD integration, these tests can be run with:

### Playwright

```javascript
const { test, expect } = require('@playwright/test');

test('accessibility tests', async ({ page }) => {
  await page.goto('/tests/accessibility-tests.html');
  // Add assertions based on test results
});
```

### Puppeteer

```javascript
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('file:///path/to/tests/accessibility-tests.html');
  
  const results = await page.evaluate(() => {
    // Extract test results from the page
    return document.querySelectorAll('.pass').length;
  });
  
  console.log(`${results} tests passed`);
  await browser.close();
})();
```

## Test Coverage

### High Priority (Phase 1)

- [x] Mobile responsiveness
- [x] Basic accessibility compliance
- [x] Form validation
- [x] Touch target sizes

### Medium Priority (Phase 2)

- [x] Visual feedback states
- [x] Loading animations
- [x] Keyboard navigation
- [x] ARIA compliance

### Low Priority (Phase 3)

- [ ] Performance testing
- [ ] Cross-browser compatibility
- [ ] User experience metrics
- [ ] A/B testing framework

## Baseline Commands

```bash
npm run test:a11y:baseline
npm run test:a11y
npm run test:a11y:strict
```

- `test:a11y:baseline`: generate the representative site audit and findings report.
- `test:a11y`: run the current baseline plus focused regression checks without forcing every axe finding to zero.
- `test:a11y:strict`: opt into failure on serious/critical axe findings once the backlog has been remediated.

## Expected Test Results

Representative audit runs should complete before deployment. Key metrics:

1. **Accessibility**: Representative pages audited and latest serious/critical findings captured.
2. **Mobile**: No horizontal scrolling, all touch targets ≥44px
3. **Forms**: Proper validation, real-time updates working
4. **Cross-browser**: Consistent behavior across all supported browsers

## Troubleshooting

### Common Issues

1. **Tests failing in older browsers**: Check for ES6 compatibility
2. **Mobile tests not accurate**: Use actual devices for final validation
3. **Accessibility false positives**: Manual verification with screen readers

### Debug Mode

Add `?debug=true` to test URLs for additional logging:

```html
http://localhost:4000/tests/accessibility-tests.html?debug=true
```

## Contributing

When adding new tests:

1. Follow the existing pattern of test functions
2. Add clear pass/fail criteria
3. Include descriptive error messages
4. Update this README with new test descriptions

## Integration with Jekyll

These tests are designed to work with the Jekyll development server:

```bash
bundle exec jekyll serve
open http://localhost:4000/tests/accessibility-tests.html
```

## Related Documentation

- [ADR-001: Prompt Details Page UX Improvements](../docs/adr/0001-prompt-details-page-ux-improvements.md)
- [Accessibility Baseline](../docs/accessibility-baseline.md)
- [GitHub Issue #86](https://github.com/TedTschopp/tedt.org/issues/86)
- [WCAG 2.1 AA Guidelines](https://www.w3.org/WAI/WCAG21/AA/)
- [Bootstrap 5.3.0 Documentation](https://getbootstrap.com/docs/5.3/)
