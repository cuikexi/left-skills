## Why

left-skills 用户写完 skill 后,无法知道 AI 有没有调用、哪些 skill 从没被用过——Claude Code 不记录 skill 调用,无使用统计。这是用户自用三痛点之一(痛点②「知道 skill 有没有用」),也是「先度量后优化」流程的度量起点。没有 usage 度量,用户无法决定哪个 skill 该改/删,后续 evolve / inspiration 闭环也无输入。

## What Changes

- 新增 hook 埋点抓 skill 调用,三数据源(已 spike 实测验证):
  - `UserPromptExpansion`(用户手动 /slash)→ 取 `command_name`
  - `PreToolUse`(matcher=Skill,AI 调 Skill 工具)→ 取 `tool_input.skill`
  - `UserPromptSubmit`(用户 prompt 文本)→ 匹配已装 skill 名(近似提及)
- 新增本地存储:记录 skill 调用(skill 名 / 时间 / 触发方式 `manual`|`ai`|`mention` / session_id)
- 新增 CLI `left-skills usage`:出使用报告(每 skill 调用次数 + 最近时间 + 从未调用 ⚠;人看 + `--json` + 退出码)
- 新增 hook 配置片段:用户加进 `~/.claude/settings.json` 或项目 `.claude/settings.json`(install 时提供片段)

## Capabilities

### New Capabilities

- `skill-usage-tracking`:hook 埋点抓 skill 调用(三数据源)+ 本地存储 + usage 报告(CLI + `--json`)

### Modified Capabilities

(无 —— 新项目,仓库当前无既有 spec)

## Impact

- 新增 TS 代码:`src/`(hook payload 解析、存储、CLI)+ `package.json`(tsup / commander / gray-matter)
- 用户配置:需在 settings.json 加 hook 片段(分发提供)
- 本地数据:存储文件(SQLite 或 JSON,选型在 design 定)
- 边界(不覆盖):AI 自主激活若不走 Skill 工具(纯 progressive disclosure 内部加载,实证未见)抓不到;只 Claude Code(Cursor/Codex 后扩)
- 不影响现有代码(新项目,仓库当前只有 docs / CLAUDE.md / README)
