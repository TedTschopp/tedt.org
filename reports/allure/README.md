# Allure Reports (Playwright)

This folder is the **published location** for Allure HTML reports.

- Raw test results (JSON/XML) go to: `reports/allure/allure-results/`
- Rendered HTML report goes to: `reports/allure/latest/`
- Entry point you can browse to on the site: `reports/allure/index.html`

## 1) Install dependencies

```bash
npm install
```

## 2) Run the Playwright a11y tests with Allure output

```bash
npm run test:a11y:allure
```

That writes results to `reports/allure/allure-results/`.

## 3) Generate the HTML report into the published folder

```bash
npm run allure:generate
```

Open `reports/allure/index.html` (or `reports/allure/latest/index.html`) in your browser.

## Notes

- The default Playwright reporter remains `list` (no Allure) unless you run the `test:a11y:allure` script.
- The generated HTML report is intentionally not committed by default (it is large and changes frequently). If you want it versioned, remove the ignore rule in `reports/allure/.gitignore`.
