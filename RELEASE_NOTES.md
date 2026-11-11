# Codex Skills Discovery v1.0.0

Initial public release of the static, bilingual Codex Skills discovery directory.

## Highlights

- Chinese-first interface with complete English switching.
- Search and filtering by workflow category, repository language, and inferred maintainer region.
- Stars and recent-update sorting.
- Static repository details and indexed `SKILL.md` review.
- Copyable Codex installation prompts with no direct browser-side installation.
- Eight practical categories, including a distinct Human Resources Management category.
- Responsive desktop and mobile layouts.

## Static data pipeline

- Scheduled GitHub Actions refresh every 12 hours.
- Manual workflow trigger for the first build or an immediate refresh.
- Same-origin JSON data for repository lists and details.
- No visitor-side GitHub API requests and no frontend token exposure.
- Per-file and per-repository content budgets keep generated data manageable.

## Verification

- 5 automated tests covering static data generation, repository detail snapshots, frontend data boundaries, categories, and workflow configuration.
- JavaScript and Python syntax validation.
- Desktop and mobile visual checks in Chinese and English.
- Repository detail and `SKILL.md` interaction checks.

## Known limitations

- Category and region values are heuristic and may be inaccurate.
- The site indexes repositories matching `topic:agent-skills`; Skills without that topic are outside the default scope.
- Very large `SKILL.md` content is truncated in the static snapshot; the source link remains available.
- Data freshness follows the latest successful scheduled workflow run.

