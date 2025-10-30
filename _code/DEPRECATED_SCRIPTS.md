# Deprecated Scripts

The following scripts have been consolidated into `check_post_categories.py` for better maintainability:

## Replaced Scripts

### 1. `find_empty_categories.py`
**Replaced by:** `check_post_categories.py --check-type empty`

Checks for posts with empty or missing categories.

### 2. `find_truly_empty_categories.py`  
**Replaced by:** `check_post_categories.py --check-type truly-empty`

Checks for posts with `categories:` but no content after it.

### 3. `find_posts_without_categories.py`
**Replaced by:** `check_post_categories.py --check-type missing --include-gamma-world`

Finds all posts without categories (including Gamma World).

### 4. `find_non_gamma_world_posts_without_categories.py`
**Replaced by:** `check_post_categories.py --check-type missing` (default behavior)

Finds posts without categories, excluding Gamma World directory.

## Why Consolidate?

- **Single Source of Truth**: One script to maintain instead of four
- **Consistent Behavior**: All checks use the same front matter parsing logic
- **Better Documentation**: Built-in help and clear command-line interface
- **Easier Testing**: One script to test instead of four
- **Flexibility**: Easy to add new check types in the future

## Migration Guide

If you have any scripts or CI jobs that use the old scripts, update them as follows:

```bash
# Old
python3 _code/find_empty_categories.py

# New
python3 _code/check_post_categories.py --check-type empty
```

```bash
# Old
python3 _code/find_truly_empty_categories.py

# New
python3 _code/check_post_categories.py --check-type truly-empty
```

```bash
# Old
python3 _code/find_posts_without_categories.py

# New
python3 _code/check_post_categories.py --check-type missing --include-gamma-world
```

```bash
# Old
python3 _code/find_non_gamma_world_posts_without_categories.py

# New
python3 _code/check_post_categories.py --check-type missing
```

## When to Remove Old Scripts

The old scripts should be kept for a transition period (suggested: 1-2 months) to allow any external dependencies to be updated. After that period, they can be safely removed.

**Date Added:** 2025-10-30
**Suggested Removal Date:** 2025-12-30 or later
