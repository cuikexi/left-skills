## Context

left-skills 是新项目(TypeScript,给 AI 用的 skill 生命周期工具)。MVP 聚焦「skill 调用使用统计」。Claude Code 不记录 skill 调用(无 skill 激活 hook 事件、jsonl 无调用字段,已调研验证),但用户手动 /slash 和 AI 调 Skill 工具留 hook 痕迹(已 spike 实测钉死字段)。本设计实现 hook 埋点 + 本地存储 + CLI 报告。

## Goals / Non-Goals

**Goals:**
- 抓用户手动 /slash skill 调用(`UserPromptExpansion.command_name`)
- 抓 AI 调 Skill 工具(`PreToolUse.tool_input.skill`,matcher=Skill)
- 抓 prompt 提及 skill(`UserPromptSubmit.prompt` 文本匹配已装 skill 名,近似)
- 存本地,出 usage 报告(人看 + `--json`)

**Non-Goals:**
- AI 自主激活若不走 Skill 工具(纯 progressive disclosure 内部加载)—— 抓不到,不覆盖
- evolve / inspiration / lint —— 留 v1+
- 跨 Cursor / Codex —— 只 Claude Code
- 自动改 skill —— 红线

## Decisions

1. **数据源:三 hook**(spike 钉死字段)
   - `UserPromptExpansion` → `command_name`(manual)
   - `PreToolUse`(matcher=Skill)→ `tool_input.skill`(ai)
   - `UserPromptSubmit` → `prompt` 文本匹配 skill 名(mention)
   - 理由:spike 实测三数据源都留痕;AI 自主激活走 Skill 工具(实证),覆盖大部分

2. **存储:JSON 文件**(非 SQLite)
   - 理由:数据量小(个人 skill 调用记录);SQLite(better-sqlite3)是 native binding,单 bundle 打包麻烦;JSON 无依赖、bundle 干净、可读可查
   - 备选:SQLite(查询强,但 native 依赖 + 打包复杂,MVP 不值)

3. **触发方式分类:manual / ai / mention**(分开标,不混"调用次数")
   - 理由:manual/ai 是真调用,mention 是近似(讨论 vs 调用难分);混标会误导(Goodhart)。诚实分开

4. **CLI:commander + `--json` + 退出码 0(信息性)**
   - 退出码 0:usage 是报告非 error,不阻断;未来 `--strict` 可阻断 never-called
   - 理由:usage 不该阻断 CI(信息性);AI 据 `--json` 判断

5. **hook 分发:install 提供 settings.json 片段**
   - 用户手动加片段进 settings.json(left-skills 提供 UserPromptExpansion / PreToolUse / UserPromptSubmit 三 hook 配置)+ 文档
   - 理由:hook 配置在用户 settings,left-skills 提供片段,用户控制

## Risks / Trade-offs

- [纯 progressive disclosure 抓不到] → 诚实标"已知边界",manual+ai 覆盖大部分;未来 Claude Code 若加 SkillActivation hook 再补
- [mention 文本匹配误判(讨论 skill vs 调用)] → 分开标 mention,不混 manual/ai;匹配用已装 skill 名精确匹配(非模糊)
- [hook 要用户装] → install 提供片段 + 文档;非自动(用户控制)
- [JSON 文件增长] → 数据量小;未来加 `--prune` 清旧
- [多 session 并发写 JSON] → hook 串行 append;MVP 个人用,并发低

## Migration Plan

新项目,无迁移。install = 装 bundle + 加 hook 片段到 settings.json。rollback = 删 hook 片段 + 删 JSON 文件。

## Open Questions

- mention 匹配:只精确匹配已装 skill 名,还是要分词/大小写?MVP 精确匹配(简单)
- 时间窗口:usage 默认近 30 天?可配 `--since`
