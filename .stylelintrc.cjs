/**
 * Stylelint config intentionally scoped for "override" files only.
 *
 * Goal: catch real CSS/SCSS mistakes (invalid syntax, unknown properties, duplicates)
 * without enforcing formatting or modern-notation rewrites.
 */

module.exports = {
  rules: {
    'block-no-empty': true,
    'color-no-invalid-hex': true,
    'declaration-block-no-duplicate-properties': true,
    'declaration-block-no-shorthand-property-overrides': true,
    'font-family-no-duplicate-names': true,
    'function-calc-no-unspaced-operator': true,
    'media-feature-name-no-unknown': true,
    'property-no-unknown': [
      true,
      {
        ignoreProperties: ['-webkit-backdrop-filter', '-webkit-hyphens'],
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.scss'],
      customSyntax: 'postcss-scss',
      plugins: ['stylelint-scss'],
      rules: {
        // SCSS uses its own at-rules; prefer the SCSS-aware rule.
        'at-rule-no-unknown': null,
        'scss/at-rule-no-unknown': true,
      },
    },
  ],
};
