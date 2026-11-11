# Codex Skills Discovery

简体中文 | [English](README.md)

一个用于发现 GitHub 公开 Codex Skills 的双语静态目录。GitHub Actions 定时生成仓库元数据和 `SKILL.md` 快照；访客只读取静态 JSON，不消耗匿名 GitHub API 额度。

**在线访问：** https://simple0926.github.io/codex-skills-discovery/

## 主要能力

- 默认中文，支持切换英文界面。
- 支持搜索，并按工作分类、仓库语言、推测的维护者地区筛选。
- 支持按 Stars 或最近更新时间排序。
- 查看仓库详情、许可证、更新时间以及索引后的 `SKILL.md`。
- 复制 `$skill-installer` 安装提示词，不从网页直接安装。
- 无数据库、无运行时后端、前端不保存 GitHub Token。

## 分类

系统根据仓库名称、简介、Topics 和已经索引的 Skill 名称推测分类：

- 代码开发
- UI/UX
- 原型设计
- 需求分析
- 视频剪辑
- 文案撰写
- 自媒体运营
- 人力资源管理
- 其他

分类属于启发式推测；当仓库元数据不完整或含义模糊时，可能出现误判。

## 数据架构

`Refresh Skills Index` 工作流默认每 12 小时运行一次，也支持手动触发。它使用 GitHub Actions 提供的认证 Token：

1. 搜索带有 `agent-skills` Topic 的公开仓库。
2. 读取维护者公开地区，用于推测地区分类。
3. 在仓库目录树中寻找精确命名的 `SKILL.md`。
4. 生成 `data/skills-index.json` 和 `data/repos/` 下的仓库详情文件。

前端只读取同一个 GitHub Pages 站点中的这些静态文件，不会把 Token 发送给访客。

## 安全边界

- 网站只负责发现与审阅，不写入访客电脑。
- Stars 只代表关注度，不代表安全、质量、兼容性或维护状态。
- 维护者地区来自公开 Profile 的 `location` 推测，可能为空或不准确。
- 安装前应阅读完整源仓库、脚本、许可证和 `SKILL.md`。

## 本地预览

```bash
python3 -m http.server 4173 --directory .
```

打开 `http://127.0.0.1:4173`。首次提交的静态索引为空，需要运行刷新工作流或本地生成脚本后才会出现真实仓库数据。

在本地生成数据：

```bash
GITHUB_TOKEN=你的令牌 python3 scripts/build_index.py --output data/skills-index.json
```

不要提交 Token，也不要把它写入 `app.js`、生成的 JSON 或任何浏览器端文件。

## 发布到 GitHub Pages

1. 将本目录推送到独立的公开仓库。
2. 在 Actions 页面手动运行一次 `Refresh Skills Index`。
3. 在 **Settings → Pages** 中选择 **Deploy from a branch**。
4. 选择 `main` 分支和 `/ (root)`。

工作流默认使用仓库内置的 `GITHUB_TOKEN`。如果需要独立 API 额度，可以添加名为 `SKILLS_INDEX_TOKEN` 的仓库 Secret；工作流会优先使用它。

## 调整数据范围

默认查询是 `topic:agent-skills`，最多索引 200 个仓库。修改 `.github/workflows/refresh-skills-index.yml` 中的 `SKILLS_INDEX_QUERY` 和 `SKILLS_INDEX_MAX_REPOSITORIES` 可以调整范围。

## 验证

```bash
python3 -m unittest discover -s tests -v
node --check app.js
python3 -m py_compile scripts/build_index.py
```

## 发布说明

参见[中文版发布说明](RELEASE_NOTES.zh-CN.md)。首个公开版本为 `v1.0.0`。

