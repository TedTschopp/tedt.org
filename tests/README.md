# Prompt Details Page - Test Suite

This directory contains comprehensive tests for the Prompt Details Page improvements as documented in [ADR-001](../docs/adr/001-prompt-details-page-ux-improvements.md).

## Test Files

### 1. `accessibility-tests.html`
Tests WCAG 2.1 AA compliance including:
- Keyboard navigation functionality
- ARIA labels and descriptions
- Color contrast validation
- Form accessibility features

### 2. `mobile-responsive-tests.html`
Tests responsive design across different viewports:
- Viewport breakpoint behavior
- Touch target size requirements (44px minimum)
- Content layout adaptation
- Button stacking and overflow prevention

### 3. `form-interaction-tests.html`
Tests user interaction flows:
- Variable form toggle functionality
- Form validation logic
- Real-time preview updates
- Loading state animations

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

## Expected Test Results

All tests should pass before deployment. Key metrics:

1. **Accessibility**: 100% pass rate on WCAG 2.1 AA tests
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

- [ADR-001: Prompt Details Page UX Improvements](../docs/adr/001-prompt-details-page-ux-improvements.md)
- [GitHub Issue #86](https://github.com/TedTschopp/tedt.org/issues/86)
- [WCAG 2.1 AA Guidelines](https://www.w3.org/WAI/WCAG21/AA/)
- [Bootstrap 5.3.0 Documentation](https://getbootstrap.com/docs/5.3/)
