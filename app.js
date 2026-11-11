const INDEX_PATH = "data/skills-index.json";
const CATEGORY_RULES = [
  ["uiux", ["ui", "ux", "user interface", "user experience", "design system", "interface design", "interaction design", "visual design", "product design", "figma", "界面设计", "交互设计", "视觉设计", "用户体验", "产品设计", "设计系统"]],
  ["code", ["code", "coding", "developer", "engineering", "programming", "debug", "test", "git", "api", "代码", "开发", "编程", "测试"]],
  ["prototype", ["prototype", "prototyping", "wireframe", "mockup", "原型"]],
  ["requirements", ["requirement", "requirements", "prd", "product manager", "business analysis", "user story", "需求", "产品经理", "业务分析", "用户故事"]],
  ["video", ["video", "editing", "editor", "subtitle", "caption", "premiere", "davinci", "ffmpeg", "剪辑", "视频", "字幕"]],
  ["copywriting", ["writing", "copywriting", "copywriter", "article", "content writing", "blog", "resume", "文案", "写作", "文章", "简历"]],
  ["social", ["social media", "creator", "wechat", "xiaohongshu", "twitter", "youtube", "tiktok", "publish", "growth", "运营", "自媒体", "公众号", "小红书"]],
  ["hr", ["human resources", "human resource", "recruit", "recruiting", "hiring", "talent", "employee", "payroll", "performance review", "hr", "人力资源", "招聘", "绩效", "薪酬", "培训"]],
];
const CATEGORY_KEYS = [...CATEGORY_RULES.map(([key]) => key), "other"];

const I18N = {
  zh: {
    pageTitle: "Skills Index · Codex Skills 发现",
    searchLabel: "搜索", searchPlaceholder: "输入能力，例如 PDF、testing、design…", searchButton: "搜索索引",
    categoryLabel: "分类", allCategories: "全部分类",
    codeLanguageLabel: "仓库语言", all: "全部", regionLabel: "维护者地区", sortLabel: "排序",
    recentlyUpdated: "最近更新", clearFilters: "清除筛选",
    regionCn: "中国及港澳台", regionUs: "美国", regionJp: "日本", regionEu: "欧洲", regionIn: "印度", regionOther: "其他地区", regionUnknown: "未公开",
    filterHint: "数据由 GitHub Actions 定时更新；浏览页面不会消耗你的 GitHub API 额度。维护者地区根据公开 Profile 推测，可能为空或不准确。",
    directoryEyebrow: "STATIC SKILLS DIRECTORY", publicRepositories: "公开仓库", loading: "正在获取…", staticIndex: "静态索引",
    noMatchTitle: "没有找到符合条件的仓库", noMatchBody: "换一个搜索词，或清除部分筛选条件后再试。",
    repositoryDetail: "仓库详情", loadingDetail: "正在读取静态详情…",
    defaultDescription: "该仓库没有填写简介", languageUnknown: "语言未标注", updated: "更新 {date}",
    resultCount: "显示 {visible} / {total} 个仓库", snapshot: "索引更新于 {date}", pendingSnapshot: "等待首次生成",
    loadFailedTitle: "无法读取静态索引", loadFailedBody: "请确认 GitHub Actions 已生成 data/skills-index.json，并通过 HTTP 服务访问页面。",
    emptyIndexTitle: "索引尚未生成", emptyIndexBody: "推送到 GitHub 后运行 Refresh Skills Index 工作流，即可生成仓库数据。",
    detailFailed: "无法读取仓库详情", detailUnavailable: "本次索引未能生成该仓库的详情，请等待下次定时更新。",
    noSkills: "没有发现精确命名的 SKILL.md，暂不提供安装指令。", skillsFound: "发现 {count} 个 Skill", treeTruncated: " · 大型仓库目录可能不完整",
    sourceTrust: "Stars 只代表关注度。安装前请检查 Skill 指令、仓库脚本、许可证和维护状态。",
    noLicense: "未声明许可证", openRepository: "打开仓库 ↗", readSkill: "阅读 SKILL.md →",
    skillUnavailable: "该 SKILL.md 的静态内容暂不可用，请直接打开源文件查看。", reviewFull: "请阅读完整 SKILL.md 了解用途与操作边界。",
    copyInstall: "复制 Codex 安装指令", openSource: "查看源文件 ↗", copied: "已复制安装指令。请粘贴到 Codex 对话中执行。",
    installPrompt: "请使用 $skill-installer 安装这个 Skill：\n{url}", truncated: "内容较长，静态索引仅展示部分正文。",
    categories: { uiux: "UI/UX", code: "代码开发", prototype: "原型设计", requirements: "需求分析", video: "视频剪辑", copywriting: "文案撰写", social: "自媒体运营", hr: "人力资源管理", other: "其他" },
    regions: { cn: "中国及港澳台", us: "美国", jp: "日本", eu: "欧洲", in: "印度", other: "其他地区", unknown: "未公开" },
  },
  en: {
    pageTitle: "Skills Index · Discover Codex Skills",
    searchLabel: "SEARCH", searchPlaceholder: "Search capabilities, e.g. PDF, testing, design…", searchButton: "Search the index",
    categoryLabel: "Category", allCategories: "All categories",
    codeLanguageLabel: "Repo language", all: "All", regionLabel: "Maintainer region", sortLabel: "Sort",
    recentlyUpdated: "Recently updated", clearFilters: "Clear filters",
    regionCn: "China, Hong Kong & Taiwan", regionUs: "United States", regionJp: "Japan", regionEu: "Europe", regionIn: "India", regionOther: "Other regions", regionUnknown: "Not disclosed",
    filterHint: "GitHub Actions refreshes this static data on a schedule, so browsing does not consume your GitHub API allowance. Maintainer regions are inferred from public profiles and may be missing or inaccurate.",
    directoryEyebrow: "STATIC SKILLS DIRECTORY", publicRepositories: "Public repositories", loading: "Loading…", staticIndex: "Static index",
    noMatchTitle: "No matching repositories", noMatchBody: "Try another search term or clear some filters.",
    repositoryDetail: "Repository details", loadingDetail: "Loading static details…",
    defaultDescription: "This repository has no description", languageUnknown: "Language not specified", updated: "Updated {date}",
    resultCount: "Showing {visible} of {total} repositories", snapshot: "Index updated {date}", pendingSnapshot: "Awaiting first build",
    loadFailedTitle: "Static index unavailable", loadFailedBody: "Confirm that GitHub Actions generated data/skills-index.json and open the site through HTTP.",
    emptyIndexTitle: "The index has not been generated", emptyIndexBody: "After pushing to GitHub, run the Refresh Skills Index workflow to generate repository data.",
    detailFailed: "Repository details unavailable", detailUnavailable: "This repository detail could not be generated. Please wait for the next scheduled refresh.",
    noSkills: "No exact SKILL.md files were found, so no install prompt is available.", skillsFound: "{count} Skills found", treeTruncated: " · Large repository tree may be incomplete",
    sourceTrust: "Stars only indicate attention. Review the instructions, scripts, license, and maintenance status before installing.",
    noLicense: "No license declared", openRepository: "Open repository ↗", readSkill: "Read SKILL.md →",
    skillUnavailable: "The static SKILL.md content is unavailable. Open the source file to review it.", reviewFull: "Read the full SKILL.md for purpose and operating boundaries.",
    copyInstall: "Copy Codex install prompt", openSource: "Open source file ↗", copied: "Install prompt copied. Paste it into a Codex chat to continue.",
    installPrompt: "Use $skill-installer to install this Skill:\n{url}", truncated: "This file is long; the static index shows only part of its content.",
    categories: { uiux: "UI/UX", code: "Code Development", prototype: "Prototype Design", requirements: "Requirements Analysis", video: "Video Editing", copywriting: "Copywriting", social: "Social Media Operations", hr: "Human Resources Management", other: "Other" },
    regions: { cn: "China, Hong Kong & Taiwan", us: "United States", jp: "Japan", eu: "Europe", in: "India", other: "Other regions", unknown: "Not disclosed" },
  },
};

const storedLanguage = (() => { try { return localStorage.getItem("skills-index-language"); } catch (_error) { return null; } })();
const state = {
  repositories: [], category: "", codeLanguage: "", region: "", selectedRepo: "",
  uiLanguage: storedLanguage === "en" ? "en" : "zh", generatedAt: null, loaded: false, currentDetail: null,
};
const $ = (selector) => document.querySelector(selector);
const els = {
  form: $("#searchForm"), search: $("#searchInput"), searchButton: $("#searchButton"),
  category: $("#categoryFilter"), language: $("#languageFilter"), region: $("#regionFilter"), sort: $("#sortFilter"),
  grid: $("#repositoryGrid"), empty: $("#emptyState"), count: $("#resultCount"), rate: $("#rateStatus"),
  drawer: $("#detailDrawer"), drawerBody: $("#drawerBody"), backdrop: $("#drawerBackdrop"), toast: $("#toast"),
};

function t(key, values = {}) {
  let text = I18N[state.uiLanguage][key] ?? key;
  Object.entries(values).forEach(([name, value]) => { text = text.replace(`{${name}}`, String(value)); });
  return text;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
}

function metric(value) { return new Intl.NumberFormat(state.uiLanguage === "zh" ? "zh-CN" : "en-US").format(Number(value) || 0); }
function shortDate(value, includeTime = false) {
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return "—";
  const options = includeTime ? { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" } : { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Intl.DateTimeFormat(state.uiLanguage === "zh" ? "zh-CN" : "en-US", options).format(date);
}

function keywordMatches(haystack, keyword) {
  if (/[\u3400-\u9fff]/.test(keyword)) return haystack.includes(keyword);
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
  return new RegExp(`(^|[^a-z0-9])${escaped}($|[^a-z0-9])`, "i").test(haystack);
}

function categoryFor(item) {
  const haystack = [item.name, item.description, ...(item.topics || []), ...(item.skillNames || [])].filter(Boolean).join(" ").toLowerCase();
  return CATEGORY_RULES.find(([, words]) => words.some((word) => keywordMatches(haystack, word)))?.[0] || "other";
}

function classifyRegion(location) {
  const value = String(location || "").trim().toLowerCase();
  if (!value) return "unknown";
  const matches = (terms) => terms.some((term) => value.includes(term));
  if (matches(["china", "beijing", "shanghai", "shenzhen", "hangzhou", "guangzhou", "chengdu", "hong kong", "taiwan", "中国", "北京", "上海", "深圳", "杭州", "广州", "成都", "香港", "台湾", "台北"])) return "cn";
  if (matches(["united states", "usa", "u.s.", "california", "san francisco", "new york", "seattle", "texas", "boston", "chicago"])) return "us";
  if (matches(["japan", "tokyo", "osaka", "kyoto", "日本", "東京", "大阪", "京都"])) return "jp";
  if (matches(["india", "bengaluru", "bangalore", "delhi", "mumbai", "hyderabad", "印度"])) return "in";
  if (matches(["europe", "united kingdom", "england", "london", "germany", "berlin", "france", "paris", "spain", "italy", "netherlands", "amsterdam", "sweden", "finland", "norway", "denmark", "poland", "portugal", "switzerland", "austria", "belgium", "ireland"])) return "eu";
  return "other";
}

function visibleRepositories() {
  const term = els.search.value.trim().toLowerCase();
  const repositories = state.repositories.filter((repo) => {
    const haystack = [repo.repo, repo.name, repo.description, ...(repo.topics || [])].filter(Boolean).join(" ").toLowerCase();
    return (!term || haystack.includes(term))
      && (!state.category || repo.category === state.category)
      && (!state.codeLanguage || repo.language === state.codeLanguage)
      && (!state.region || repo.region === state.region);
  });
  return repositories.sort((a, b) => els.sort.value === "updated"
    ? new Date(b.updatedAt).valueOf() - new Date(a.updatedAt).valueOf()
    : b.stars - a.stars);
}

function rebuildCategories() {
  const current = state.category;
  const counts = state.repositories.reduce((map, repo) => map.set(repo.category, (map.get(repo.category) || 0) + 1), new Map());
  els.category.innerHTML = `<option value="">${escapeHtml(t("allCategories"))}</option>` + CATEGORY_KEYS.map((key) => {
    const count = counts.has(key) ? ` (${counts.get(key)})` : "";
    return `<option value="${key}">${escapeHtml(I18N[state.uiLanguage].categories[key])}${count}</option>`;
  }).join("");
  els.category.value = CATEGORY_KEYS.includes(current) ? current : "";
  state.category = els.category.value;
}

function renderEmpty(title, body, label = "NO MATCH") {
  els.grid.hidden = true;
  els.empty.hidden = false;
  els.empty.innerHTML = `<span>${escapeHtml(label)}</span><h3>${escapeHtml(title)}</h3><p>${escapeHtml(body)}</p>`;
}

function renderRepositories() {
  if (!state.loaded) return;
  const repositories = visibleRepositories();
  els.count.textContent = t("resultCount", { visible: metric(repositories.length), total: metric(state.repositories.length) });
  if (!state.repositories.length) {
    renderEmpty(t("emptyIndexTitle"), t("emptyIndexBody"), "INDEX PENDING");
    return;
  }
  if (!repositories.length) {
    renderEmpty(t("noMatchTitle"), t("noMatchBody"));
    return;
  }
  els.empty.hidden = true;
  els.grid.hidden = false;
  els.grid.innerHTML = repositories.map((repo, index) => `
    <button class="repository-card" type="button" data-repo="${escapeHtml(repo.repo)}" style="animation-delay:${Math.min(index, 8) * 35}ms">
      <span class="repo-number"><span>NO. ${String(index + 1).padStart(2, "0")}</span><span class="repo-category">${escapeHtml(I18N[state.uiLanguage].categories[repo.category])}</span></span>
      <h3>${escapeHtml(repo.repo)}</h3>
      <p>${escapeHtml(repo.description || t("defaultDescription"))}</p>
      <span class="repo-attributes"><span>${escapeHtml(repo.language || t("languageUnknown"))}</span>${repo.region !== "unknown" ? `<span>${escapeHtml(I18N[state.uiLanguage].regions[repo.region])}</span>` : ""}</span>
      <span class="repo-footer"><span>★ ${metric(repo.stars)}</span><span>${escapeHtml(t("updated", { date: shortDate(repo.updatedAt) }))} →</span></span>
    </button>`).join("");
}

function applyLanguage({ persist = true } = {}) {
  document.documentElement.lang = state.uiLanguage === "zh" ? "zh-CN" : "en";
  document.title = t("pageTitle");
  document.querySelectorAll("[data-i18n]").forEach((element) => { element.textContent = t(element.dataset.i18n); });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => { element.placeholder = t(element.dataset.i18nPlaceholder); });
  document.querySelectorAll("[data-language]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.language === state.uiLanguage)));
  if (persist) { try { localStorage.setItem("skills-index-language", state.uiLanguage); } catch (_error) { /* Optional. */ } }
  rebuildCategories();
  if (state.generatedAt) els.rate.textContent = t("snapshot", { date: shortDate(state.generatedAt, true) });
  else els.rate.textContent = t("pendingSnapshot");
  renderRepositories();
  if (state.currentDetail && els.drawer.classList.contains("open")) renderRepositoryDetail(state.currentDetail);
}

async function loadIndex() {
  els.count.textContent = t("loading");
  try {
    const response = await fetch(INDEX_PATH, { cache: "no-cache" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    state.generatedAt = data.generatedAt || null;
    state.repositories = (data.repositories || []).map((repo) => ({ ...repo, category: categoryFor(repo), region: classifyRegion(repo.ownerLocation) }));
    state.loaded = true;
    applyLanguage({ persist: false });
  } catch (_error) {
    state.loaded = true;
    state.repositories = [];
    els.count.textContent = t("detailFailed");
    renderEmpty(t("loadFailedTitle"), t("loadFailedBody"), "LOAD ERROR");
  }
}

function openDrawer() {
  els.backdrop.hidden = false;
  els.drawer.setAttribute("aria-hidden", "false");
  requestAnimationFrame(() => { els.backdrop.classList.add("visible"); els.drawer.classList.add("open"); });
  document.body.style.overflow = "hidden";
}

function closeDrawer() {
  els.backdrop.classList.remove("visible");
  els.drawer.classList.remove("open");
  els.drawer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  setTimeout(() => { els.backdrop.hidden = true; }, 300);
}

function renderRepositoryDetail(detail) {
  const summary = state.repositories.find((repo) => repo.repo === detail.repo);
  if (!summary) return;
  const skills = detail.skills || [];
  const error = detail.error ? `<div class="error-panel">${escapeHtml(t("detailUnavailable"))}</div>` : "";
  els.drawerBody.innerHTML = `
    <section class="repo-detail-head">
      <h3>${escapeHtml(summary.repo)}</h3><p>${escapeHtml(summary.description || t("defaultDescription"))}</p>
      <div class="detail-metrics"><span>★ ${metric(summary.stars)}</span><span>⑂ ${metric(summary.forks)}</span><span>${escapeHtml(summary.license || t("noLicense"))}</span><span>${escapeHtml(t("updated", { date: shortDate(summary.updatedAt) }))}</span><a href="${escapeHtml(summary.url)}" target="_blank" rel="noreferrer">${escapeHtml(t("openRepository"))}</a></div>
    </section>
    <div class="trust-note">${escapeHtml(t("sourceTrust"))}</div>
    ${error}
    <section class="skill-list"><h4>${escapeHtml(t("skillsFound", { count: metric(skills.length) }))}${detail.treeTruncated ? escapeHtml(t("treeTruncated")) : ""}</h4>
      ${skills.length ? skills.map((skill, index) => `<button class="skill-item" type="button" data-skill-index="${index}"><span>${escapeHtml(skill.name)}</span><span>${escapeHtml(t("readSkill"))}</span></button>`).join("") : `<div class="error-panel">${escapeHtml(t("noSkills"))}</div>`}
    </section><section class="skill-review" id="skillReview" hidden></section>`;
  $("#drawerTitle").textContent = t("repositoryDetail");
}

async function openRepository(repoName) {
  const summary = state.repositories.find((repo) => repo.repo === repoName);
  if (!summary) return;
  state.selectedRepo = repoName;
  state.currentDetail = null;
  openDrawer();
  els.drawerBody.innerHTML = `<div class="drawer-loading">${escapeHtml(t("loadingDetail"))}</div>`;
  try {
    const response = await fetch(summary.detailPath, { cache: "no-cache" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    state.currentDetail = await response.json();
    renderRepositoryDetail(state.currentDetail);
  } catch (_error) {
    els.drawerBody.innerHTML = `<div class="error-panel"><strong>${escapeHtml(t("detailFailed"))}</strong><br />${escapeHtml(t("detailUnavailable"))}</div>`;
  }
}

function openSkill(button) {
  const review = $("#skillReview");
  const skill = state.currentDetail?.skills?.[Number(button.dataset.skillIndex)];
  if (!review || !skill) return;
  review.hidden = false;
  const prompt = t("installPrompt", { url: skill.installUrl });
  const body = skill.content
    ? `<pre class="skill-content">${escapeHtml(skill.content)}</pre>${skill.contentTruncated ? `<p>${escapeHtml(t("truncated"))}</p>` : ""}`
    : `<div class="error-panel">${escapeHtml(t("skillUnavailable"))}</div>`;
  review.innerHTML = `<h4>${escapeHtml(skill.name)}</h4><p>${escapeHtml(skill.description || t("reviewFull"))}</p>${body}<div class="install-actions"><button class="copy-install" type="button" data-prompt="${escapeHtml(prompt)}">${escapeHtml(t("copyInstall"))}</button><a class="open-source" href="${escapeHtml(skill.sourceUrl)}" target="_blank" rel="noreferrer">${escapeHtml(t("openSource"))}</a></div>`;
  review.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (_error) {
    const field = document.createElement("textarea");
    field.value = text; field.style.position = "fixed"; field.style.opacity = "0";
    document.body.append(field); field.select(); document.execCommand("copy"); field.remove();
  }
  showToast(t("copied"));
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.hidden = false;
  setTimeout(() => { els.toast.hidden = true; }, 3600);
}

els.form.addEventListener("submit", (event) => { event.preventDefault(); renderRepositories(); });
els.search.addEventListener("input", renderRepositories);
els.sort.addEventListener("change", renderRepositories);
els.language.addEventListener("change", () => { state.codeLanguage = els.language.value; renderRepositories(); });
els.category.addEventListener("change", () => { state.category = els.category.value; renderRepositories(); });
els.region.addEventListener("change", () => { state.region = els.region.value; renderRepositories(); });
$("#resetFilters").addEventListener("click", () => {
  state.category = ""; state.codeLanguage = ""; state.region = "";
  els.search.value = ""; els.category.value = ""; els.language.value = ""; els.region.value = ""; els.sort.value = "stars";
  renderRepositories();
});
$("#languageSwitch").addEventListener("click", (event) => {
  const button = event.target.closest("[data-language]");
  if (!button || button.dataset.language === state.uiLanguage) return;
  state.uiLanguage = button.dataset.language;
  applyLanguage();
});
els.grid.addEventListener("click", (event) => { const card = event.target.closest("[data-repo]"); if (card) void openRepository(card.dataset.repo); });
els.drawerBody.addEventListener("click", (event) => {
  const skill = event.target.closest("[data-skill-index]");
  if (skill) openSkill(skill);
  const copy = event.target.closest("[data-prompt]");
  if (copy) void copyText(copy.dataset.prompt);
});
$("#closeDrawer").addEventListener("click", closeDrawer);
els.backdrop.addEventListener("click", closeDrawer);
document.addEventListener("keydown", (event) => { if (event.key === "Escape" && els.drawer.classList.contains("open")) closeDrawer(); });

applyLanguage({ persist: false });
void loadIndex();
