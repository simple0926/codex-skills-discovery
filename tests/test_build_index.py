from importlib.util import module_from_spec, spec_from_file_location
import json
from pathlib import Path
from tempfile import TemporaryDirectory
import unittest


ROOT = Path(__file__).parents[1]
SPEC = spec_from_file_location("build_index", ROOT / "scripts" / "build_index.py")
MODULE = module_from_spec(SPEC)
assert SPEC and SPEC.loader
SPEC.loader.exec_module(MODULE)


class BuildIndexTests(unittest.TestCase):
    def test_default_query_covers_both_common_agent_skill_topics(self) -> None:
        self.assertEqual(MODULE.DEFAULT_QUERIES, ("topic:agent-skills", "topic:agent-skill"))

    def test_builder_writes_static_index_and_repository_detail(self) -> None:
        repository = {
            "full_name": "example/pdf-skill",
            "name": "pdf-skill",
            "description": "Work with PDF documents",
            "html_url": "https://github.com/example/pdf-skill",
            "stargazers_count": 42,
            "forks_count": 3,
            "updated_at": "2026-11-01T00:00:00Z",
            "default_branch": "main",
            "language": "Python",
            "topics": ["agent-skills", "pdf"],
            "archived": False,
            "disabled": False,
            "owner": {"login": "example", "type": "Organization"},
        }

        seen_queries = []

        def api_get(path, query=None):
            if path == "/search/repositories":
                seen_queries.append(query["q"])
                return {"items": [repository]}
            if path == "/repos/example/pdf-skill/git/trees/main":
                return {"tree": [{"path": "skills/pdf/SKILL.md", "type": "blob"}], "truncated": False}
            if path == "/orgs/example":
                return {"location": "Shanghai, China"}
            raise AssertionError(path)

        def text_get(url):
            self.assertIn("raw.githubusercontent.com", url)
            return "---\nname: pdf\ndescription: Read PDFs\n---\n# PDF"

        with TemporaryDirectory() as directory:
            output = Path(directory) / "data" / "skills-index.json"
            MODULE.build_catalog(output, api_get=api_get, text_get=text_get, max_repositories=10)

            index = json.loads(output.read_text(encoding="utf-8"))
            self.assertEqual(index["query"], "topic:agent-skills || topic:agent-skill")
            self.assertEqual(index["queries"], ["topic:agent-skills", "topic:agent-skill"])
            self.assertEqual(seen_queries, ["topic:agent-skills", "topic:agent-skill"])
            self.assertEqual(index["repositoryCount"], 1)
            self.assertEqual(index["repositories"][0]["ownerLocation"], "Shanghai, China")
            self.assertEqual(index["repositories"][0]["detailPath"], "data/repos/example__pdf-skill.json")

            detail = json.loads((output.parent / "repos" / "example__pdf-skill.json").read_text(encoding="utf-8"))
            self.assertEqual(detail["skills"][0]["name"], "pdf")
            self.assertIn("# PDF", detail["skills"][0]["content"])


if __name__ == "__main__":
    unittest.main()