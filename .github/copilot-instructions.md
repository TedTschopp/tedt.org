# Coding Best Practices

## General Coding Principles

### Code Iteration & Simplicity

* **Prefer simple, maintainable solutions** in all code decisions.
* Always look for **existing code** to iterate on before creating something new.
* Avoid making **major changes to established patterns or architecture**, unless explicitly instructed.
* When fixing a bug, **exhaust options in the current implementation** before introducing new patterns or technologies. If new patterns are used, **remove the old implementation** to prevent duplication.
* Write code that works consistently across **development, test, and production environments**.
* Be intentional—only make changes that are **requested or clearly relevant**.
* Focus on **areas of code related to the task**. Do not touch unrelated functionality.

### Cleanliness & Maintainability

* Keep the codebase **organized and easy to navigate**.
* As a general rule, **refactor files that grow beyond 200–300 lines**, unless there’s a clear and valid reason not to.
* Avoid **code duplication**—check for similar logic before writing new functions.
* Avoid committing **one-off scripts** to the main codebase. If necessary, place them in a `scripts/one-off/` folder or document them externally.
* Use **clear and intentional comments** to explain *why* something is done—not just what it does. Prefer self-explanatory code when possible.
* Use **consistent indentation, spacing, and formatting** throughout the codebase.
* Write **thorough tests** for all major functionality.
* Periodically audit the codebase for **unused files**, **dead code**, and **outdated content**.

## Semantic HTML

* Use semantic HTML elements like `<article>`, `<nav>`, `<section>`, `<figure>`, `<header>`, `<footer>`, and `<main>`.
* Avoid generic `<div>` and `<span>` tags when more meaningful options exist.
* Proper structure improves **accessibility, SEO, and maintainability**.

## File & Folder Structure

* Follow a **consistent and logical folder structure**.
* Keep **HTML, CSS, and JavaScript** in separate files.
* Place all documentation in a `docs/` folder.
* Use **descriptive and meaningful names** for files and folders.
* Naming conventions:

  * `kebab-case` for files and folders
  * `camelCase` for JavaScript variables and functions
  * `PascalCase` for CSS class names

## Jekyll Best Practices

* Use:

  * `_includes/` for reusable components
  * `_layouts/` for page templates
  * `_data/` for shared structured data
  
* Maintain site-wide settings in `_config.yml`.
* Use **Liquid templating** for dynamic content.
* Avoid duplication using **Jekyll includes and layouts**.
* Leverage Jekyll plugins for **pagination**, **SEO**, and **sitemaps**.
* Define metadata and configuration using **front matter** at the top of each file.

## Testing & Environment

* **Always restart the server** after making code changes so changes can be tested.
* **Kill any lingering or conflicting test servers** before starting a new one.
* Validate all **HTML, CSS, and JS** locally before pushing.
* Never overwrite the `.env` file without first asking and confirming.
* Put all test code in the `tests/` folder.
* Mock data is only for **testing**—never for development or production.
* Never add **stubbed or fake data** to code that runs in dev or prod.

### Extended Testing Strategy

* Write **unit tests**, **integration tests**, and (where needed) **end-to-end tests**.
* Use a **testing pyramid** approach: favor more unit tests than other types.
* Use browser tools and Lighthouse for **accessibility and performance testing**.
* Test across multiple browsers (Chrome, Firefox at a minimum).

## Dependency Management

* Before adding a dependency, check:

  * Is this already solved in the project?
  * Is the library **well-maintained and lightweight**?
  * Will it create **conflicts** or add unnecessary complexity?
  
* Document why any new package is introduced and how it's used.
* Use tools like `npm audit` or `dependabot` to track vulnerabilities.
* Avoid pinning dependency versions unless required for stability.

## Security Best Practices

* Never commit **secrets, API keys, or credentials** to the repository.
* Use `.env` files and environment-specific configurations to isolate sensitive data.
* Validate and sanitize all **user-generated content** and input.
* Avoid **inline JavaScript** in HTML or template files.
* Prefer built-in security features and native HTML elements before relying on ARIA.

##  Collaboration & Communication

### Git and Version Control

* Use **atomic commits**—each commit should represent a single logical change.
* Write **clear commit messages** that describe the purpose and context of the change.
* Use **feature branches** and submit **pull requests (PRs)** for all non-trivial changes.
* Avoid pushing directly to `main` or `production` branches.

### Code Review Etiquette

* Approach reviews as **collaborative and respectful conversations**.
* Give **specific, actionable feedback**; avoid vague comments.
* When receiving a review, **respond to all comments** and seek consensus if there’s disagreement.
* Prioritize the **long-term clarity and health** of the codebase over short-term fixes.

## Observability & Monitoring

* Add **console logs or structured debugging messages** during complex operations (but clean them up before shipping).
* Use **Lighthouse**, browser dev tools, or third-party tools to evaluate **load time, performance, and SEO**.
* Consider integrating tools for **automated accessibility and performance checks** into CI/CD.

## Deployment & Automation

* Use GitHub Actions or similar tools to **automate deployments** and avoid manual errors.
* Create a **deployment checklist**, including:

  * Verifying `.env` and environment variables
  * Clearing caches (where needed)
  * Triggering content rebuilds
* Automate tests and validations as part of the **CI/CD pipeline**.

## Long-Term Maintainability

* Use **Architecture Decision Records (ADRs)** in a `/decisions` folder to document key technical choices.
* Maintain a clear and friendly `CONTRIBUTING.md` to help new team members get up to speed.
* Keep an eye on **technical debt** and proactively schedule time to address it.
