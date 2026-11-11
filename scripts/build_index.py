#!/usr/bin/env python3
"""Build the static Skills Index consumed by the GitHub Pages frontend."""

from __future__ import annotations

import argparse
from datetime import datetime, timezone
import json
import os
from pathlib import Path
import re
import time
from typing import Any, Callable
from urllib.error import HTTPError, URLError
from urllib.parse import quote, urlencode
from urllib.request import Request, urlopen


API_ROOT = "https://api.github.com"
API_VERSION = "2026-03-10"
DEFAULT_QUERIES = ("topic:agent-skills", "topic:agent-skill")
DEFAULT_MAX_REPOSITORIES = 200
MAX_SKILLS_PER_REPOSITORY = 100
MAX_SKILL_CONTENT = 30_000
MAX_DETAIL_CONTENT = 120_000


def _token() -> str:
    return os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN") or ""


def _request(url: str, *, accept: str = "application/vnd.github+json") -> bytes:
    headers = {"Accept": accept, "User-Agent": "codex-skills-index-builder", "X-GitHub-Api-Version": API_VERSION}
    if _token():
        headers["Authorization"] = f"Bearer {_token()}"
    request = Request(url, headers=headers)
    for attempt in range(4):
        try:
            with urlopen(request, timeout=30) as response:
                return response.read()
        except HTTPError as error:
            retry_after = error.headers.get("Retry-After")
            if error.code in {429, 500, 502, 503, 504} and attempt < 3:
                time.sleep(float(retry_after or 2 ** attempt))
                continue
            message = error.read().decode("utf-8", errors="replace")[:500]
            raise RuntimeError(f"HTTP {error.code} for {url}: {message}") from error
        except URLError as error:
            if attempt < 3:
                time.sleep(2 ** attempt)
                continue
            raise RuntimeError(f"Could not reach {url}: {error.reason}") from error
    raise RuntimeError(f"Could not read {url}")


def github_json(path: str, query: dict[str, str] | None = None) -> dict[str, Any]:
    suffix = f"?{urlencode(query)}" if query else ""
    return json.loads(_request(f"{API_ROOT}{path}{suffix}").decode("utf-8"))


def fetch_text(url: str) -> str:
    return _request(url, accept="text/plain").decode("utf-8", errors="replace")


def detail_filename(full_name: str) -> str:
    return re.sub(r"[^A-Za-z0-9._-]+", "__", full_name).strip("_") + ".json"


def configured_queries() -> list[str]:
    configured = os.environ.get("SKILLS_INDEX_QUERIES", "")
    if configured:
        queries = [query.strip() for query in configured.split("||") if query.strip()]
        if queries:
            return queries
    legacy_query = os.environ.get("SKILLS_INDEX_QUERY", "").strip()
    return [legacy_query] if legacy_query else list(DEFAULT_QUERIES)


def skill_paths(tree: dict[str, Any]) -> list[str]:
    paths = []
    for item in tree.get("tree", []):
        path = str(item.get("path") or "")
        if item.get("type") != "blob" or not (path == "SKILL.md" or path.endswith("/SKILL.md")):
            continue
        if path.startswith(".system/") or "/.system/" in path:
            continue
        paths.append(path)
    return paths[:MAX_SKILLS_PER_REPOSITORY]


def frontmatter(content: str, fallback_name: str) -> tuple[str, str]:
    block = ""
    if content.startswith("---"):
        parts = content.split("---", 2)
        block = parts[1] if len(parts) > 2 else ""
    name_match = re.search(r'^name:\s*["\']?([^\n"\']+)', block, re.MULTILINE)
    description_match = re.search(r'^description:\s*["\']?([^\n"\']+)', block, re.MULTILINE)
    name = name_match.group(1).strip() if name_match else fallback_name
    description = description_match.group(1).strip() if description_match else ""
    if description in {">", ">-", "|", "|-"}:
        description = ""
    return name, description


def repository_summary(item: dict[str, Any], detail_path: str, owner_location: str, skill_names: list[str] | None = None) -> dict[str, Any]:
    owner = item.get("owner") or {}
    license_data = item.get("license") or {}
    return {
        "repo": item["full_name"],
        "name": item.get("name") or item["full_name"].split("/")[-1],
        "description": item.get("description") or "",
        "stars": int(item.get("stargazers_count") or 0),
        "forks": int(item.get("forks_count") or 0),
        "updatedAt": item.get("updated_at") or "",
        "branch": item.get("default_branch") or "main",
        "url": item.get("html_url") or f"https://github.com/{item['full_name']}",
        "topics": item.get("topics") or [],
        "language": item.get("language") or "",
        "owner": owner.get("login") or item["full_name"].split("/")[0],
        "ownerType": owner.get("type") or "User",
        "ownerLocation": owner_location,
        "license": license_data.get("spdx_id") or "",
        "detailPath": detail_path,
        "skillNames": skill_names or [],
    }


def build_repository_detail(
    item: dict[str, Any],
    *,
    api_get: Callable[..., dict[str, Any]],
    text_get: Callable[[str], str],
) -> dict[str, Any]:
    full_name = item["full_name"]
    branch = item.get("default_branch") or "main"
    tree = api_get(f"/repos/{full_name}/git/trees/{quote(branch, safe='')}", {"recursive": "1"})
    skills = []
    remaining_content = MAX_DETAIL_CONTENT
    for path in skill_paths(tree):
        directory = path.rsplit("/", 1)[0] if "/" in path else "."
        fallback_name = directory.rsplit("/", 1)[-1] if directory != "." else full_name.split("/")[-1]
        raw_url = f"https://raw.githubusercontent.com/{full_name}/{quote(branch, safe='')}/{quote(path, safe='/')}"
        content = ""
        error = ""
        if remaining_content > 0:
            try:
                content = text_get(raw_url)
            except RuntimeError as exception:
                error = str(exception)
        name, description = frontmatter(content, fallback_name)
        source_url = f"https://github.com/{full_name}/blob/{quote(branch, safe='')}/{quote(path, safe='/')}"
        install_url = item.get("html_url") or f"https://github.com/{full_name}"
        if directory != ".":
            install_url = f"https://github.com/{full_name}/tree/{quote(branch, safe='')}/{quote(directory, safe='/')}"
        content_limit = min(MAX_SKILL_CONTENT, remaining_content)
        indexed_content = content[:content_limit]
        remaining_content -= len(indexed_content)
        skills.append({
            "entry": path,
            "path": directory,
            "name": name,
            "description": description,
            "content": indexed_content,
            "contentTruncated": len(content) > len(indexed_content),
            "sourceUrl": source_url,
            "installUrl": install_url,
            "error": error,
        })
    return {"repo": full_name, "treeTruncated": bool(tree.get("truncated")), "skills": skills}


def build_catalog(
    output_path: Path,
    *,
    api_get: Callable[..., dict[str, Any]] = github_json,
    text_get: Callable[[str], str] = fetch_text,
    max_repositories: int = DEFAULT_MAX_REPOSITORIES,
) -> dict[str, Any]:
    queries = configured_queries()
    repositories_by_name: dict[str, dict[str, Any]] = {}
    for query in queries:
        query_repositories: list[dict[str, Any]] = []
        page = 1
        while len(query_repositories) < max_repositories:
            per_page = min(100, max_repositories - len(query_repositories))
            data = api_get("/search/repositories", {
                "q": query,
                "sort": "stars",
                "order": "desc",
                "per_page": str(per_page),
                "page": str(page),
            })
            raw_items = data.get("items", [])
            items = [item for item in raw_items if not item.get("archived") and not item.get("disabled")]
            query_repositories.extend(items)
            if len(raw_items) < per_page:
                break
            page += 1
        for item in query_repositories:
            repositories_by_name[item["full_name"]] = item

    repositories = sorted(
        repositories_by_name.values(),
        key=lambda item: int(item.get("stargazers_count") or 0),
        reverse=True,
    )[:max_repositories]

    output_path.parent.mkdir(parents=True, exist_ok=True)
    details_dir = output_path.parent / "repos"
    details_dir.mkdir(parents=True, exist_ok=True)
    for old_detail in details_dir.glob("*.json"):
        old_detail.unlink()

    owner_locations: dict[str, str] = {}
    summaries = []
    detail_failures = 0
    for item in repositories:
        owner = item.get("owner") or {}
        login = owner.get("login") or item["full_name"].split("/")[0]
        if login not in owner_locations:
            profile_path = f"/orgs/{quote(login)}" if owner.get("type") == "Organization" else f"/users/{quote(login)}"
            try:
                profile = api_get(profile_path)
                owner_locations[login] = profile.get("location") if isinstance(profile.get("location"), str) else ""
            except RuntimeError:
                owner_locations[login] = ""

        filename = detail_filename(item["full_name"])
        detail_path = f"data/repos/{filename}"
        try:
            detail = build_repository_detail(item, api_get=api_get, text_get=text_get)
        except RuntimeError as exception:
            detail_failures += 1
            detail = {"repo": item["full_name"], "treeTruncated": False, "skills": [], "error": str(exception)}
        (details_dir / filename).write_text(json.dumps(detail, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        summaries.append(repository_summary(item, detail_path, owner_locations[login], [skill.get("name", "") for skill in detail.get("skills", [])]))

    catalog = {
        "schemaVersion": 1,
        "generatedAt": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "query": " || ".join(queries),
        "queries": queries,
        "repositoryCount": len(summaries),
        "detailFailures": detail_failures,
        "repositories": summaries,
    }
    output_path.write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return catalog


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=Path("data/skills-index.json"))
    parser.add_argument("--max-repositories", type=int, default=int(os.environ.get("SKILLS_INDEX_MAX_REPOSITORIES", DEFAULT_MAX_REPOSITORIES)))
    args = parser.parse_args()
    catalog = build_catalog(args.output, max_repositories=max(1, min(args.max_repositories, 500)))
    print(f"Wrote {catalog['repositoryCount']} repositories to {args.output}")
    if catalog["detailFailures"]:
        print(f"Warning: {catalog['detailFailures']} repository detail files could not be refreshed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
