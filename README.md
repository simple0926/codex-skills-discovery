# Codex Skills Discovery

[简体中文](README.zh-CN.md) | English

A bilingual, static directory for discovering public Codex Skills on GitHub. GitHub Actions generates repository metadata and `SKILL.md` snapshots on a schedule; visitors read static JSON and do not consume anonymous GitHub API allowance.

**Live site:** https://simple0926.github.io/codex-skills-discovery/

## Features

- Chinese interface by default with an English switch.
- Search and filters for workflow category, repository language, and inferred maintainer region.
- Sort by Stars or most recently updated.
- Repository details, license, update date, and indexed `SKILL.md` review.
- Copyable `$skill-installer` prompt instead of direct installation from the website.
- Static hosting with no database, server, or browser-side GitHub token.

## Categories

Categories are inferred from the repository name, description, topics, and indexed Skill names:

- Code Development
- Prototype Design
- Requirements Analysis
- Video Editing
- Copywriting
- Social Media Operations
- Human Resources Management
- Other

Inference is heuristic. A repository may be classified incorrectly when its metadata is incomplete or ambiguous.

## Data architecture

The `Refresh Skills Index` workflow runs every 12 hours and can also be started manually. It uses GitHub's authenticated Actions token to:

1. Search public repositories with the `agent-skills` topic.
2. Read public maintainer locations for region inference.
3. Find exact `SKILL.md` entries in each repository tree.
4. Write `data/skills-index.json` and repository-specific files under `data/repos/`.

The frontend only fetches those files from the same GitHub Pages site. Tokens are never sent to visitors.

## Safety boundary

- The site is for discovery and review; it never writes to the visitor's computer.
- Stars indicate attention, not safety, quality, compatibility, or maintenance.
- Maintainer region is inferred from a public profile location and may be missing or inaccurate.
- Review the full source repository, scripts, license, and `SKILL.md` before installation.

## Local preview

```bash
python3 -m http.server 4173 --directory .
```

Open `http://127.0.0.1:4173`. The committed index is initially empty until the refresh workflow or local builder generates data.

To build data locally:

```bash
GITHUB_TOKEN=your_token python3 scripts/build_index.py --output data/skills-index.json
```

Never commit the token or place it in `app.js`, generated JSON, or any browser-side file.

## Deploy to GitHub Pages

1. Push this directory to a standalone public repository.
2. Run the `Refresh Skills Index` workflow once from the Actions tab.
3. In **Settings → Pages**, choose **Deploy from a branch**.
4. Select the `main` branch and `/ (root)`.

The workflow uses the repository's built-in `GITHUB_TOKEN`. If a separate API allowance is needed, add a repository secret named `SKILLS_INDEX_TOKEN`; the workflow prefers it when present.

## Configuration

The default query is `topic:agent-skills`, with up to 200 repositories. Change `SKILLS_INDEX_QUERY` and `SKILLS_INDEX_MAX_REPOSITORIES` in `.github/workflows/refresh-skills-index.yml` to adjust the scope.

## Verification

```bash
python3 -m unittest discover -s tests -v
node --check app.js
python3 -m py_compile scripts/build_index.py
```

## Release notes

See [Release Notes](RELEASE_NOTES.md). The first public release is `v1.0.0`.

