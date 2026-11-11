from pathlib import Path
import unittest


ROOT = Path(__file__).parents[1]


class StaticDiscoveryTests(unittest.TestCase):
    def test_page_exposes_discovery_and_detail_workflow(self) -> None:
        html = (ROOT / "index.html").read_text(encoding="utf-8")

        for marker in (
            'id="searchInput"',
            'id="categoryFilter"',
            'id="sortFilter"',
            'id="languageFilter"',
            'id="regionFilter"',
            'id="repositoryGrid"',
            'id="detailDrawer"',
            'id="languageSwitch"',
            'data-language="zh"',
            'data-language="en"',
        ):
            self.assertIn(marker, html)
        self.assertNotIn("127.0.0.1", html)
        self.assertNotIn("本地服务", html)
        self.assertNotIn('id="starsFilter"', html)
        self.assertLess(html.index('id="categoryFilter"'), html.index('id="sortFilter"'))
        self.assertLess(html.index('id="sortFilter"'), html.index('id="languageFilter"'))
        self.assertNotIn('class="hero"', html)
        self.assertNotIn('class="method"', html)
        self.assertNotIn("PUBLIC DIRECTORY", html)
        self.assertNotIn("SKILLS INDEX / 2026", html)
        self.assertNotIn("数据由 GitHub Actions 定时生成。Stars 代表关注度，不代表安全、质量或兼容性。", html)
        self.assertNotIn("<footer", html)

    def test_browser_app_uses_static_index_and_only_copies_install_prompt(self) -> None:
        script = (ROOT / "app.js").read_text(encoding="utf-8")

        self.assertIn("data/skills-index.json", script)
        self.assertIn("detailPath", script)
        self.assertIn("navigator.clipboard.writeText", script)
        self.assertIn("$skill-installer", script)
        self.assertIn("function classifyRegion", script)
        self.assertIn("function keywordMatches", script)
        self.assertIn("uiLanguage", script)
        self.assertIn('document.documentElement.lang', script)
        self.assertIn('Search the index', script)
        self.assertNotIn("api.github.com", script)
        self.assertNotIn("/search/repositories", script)
        self.assertNotIn("function github", script)
        self.assertNotIn("/api/apply", script)
        self.assertNotIn("/api/preview", script)

    def test_repository_refresh_is_automated(self) -> None:
        workflow = (ROOT / ".github" / "workflows" / "refresh-skills-index.yml").read_text(encoding="utf-8")
        builder = (ROOT / "scripts" / "build_index.py").read_text(encoding="utf-8")

        self.assertIn("schedule:", workflow)
        self.assertIn("workflow_dispatch:", workflow)
        self.assertIn("build_index.py", workflow)
        self.assertIn("GITHUB_TOKEN", workflow)
        self.assertIn("skills-index.json", builder)
        self.assertIn("detailPath", builder)

    def test_supported_skill_categories_are_explicit(self) -> None:
        script = (ROOT / "app.js").read_text(encoding="utf-8")

        for category in (
            "代码开发",
            "UI/UX",
            "原型设计",
            "需求分析",
            "视频剪辑",
            "文案撰写",
            "自媒体运营",
            "人力资源管理",
            "其他",
        ):
            self.assertIn(category, script)

        self.assertLess(script.index('["uiux"'), script.index('["prototype"'))


if __name__ == "__main__":
    unittest.main()
