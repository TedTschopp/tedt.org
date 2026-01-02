# Deprecated Bootstrap fork Sass files

These files are **intentionally kept for reference** during the Bootstrap 5.3 override refactor.

They are **not imported anywhere** in the active build entrypoint ([css/bootstrap-build.scss](../css/bootstrap-build.scss)) and can be deleted once the site has been visually validated and you give the all-clear.

## Safe to delete later (once validated)

- `_sass/_variables-Teds.scss`
- `_sass/_variables-dark-Teds.scss`
- `_sass/helpers/_ratio-custom.scss`

## Replacement locations (current source of truth)

- Variable overrides: `_sass/_variables-site.scss`, `_sass/_variables-dark-site.scss`
- Map overrides: `_sass/_maps-site.scss`
- Site overrides (late cascade): `_sass/_overrides-*.scss`

## Notes

- If you later want to re-check what was changed historically, these files capture the original forked state.
- When deleting, also remove this file.
