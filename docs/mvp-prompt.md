# 任务

实现 left-skills 的 MVP。先做技术 spike 钉死 payload 契约,再写 MVP。

# 项目背景

- left-skills = 给 AI 用的、管 skill(SKILL.md)质量与生命周期的工具。仓库 https://github.com/cuikexi/left-skills
- 技术栈:**TypeScript**(单文件 bundle .js:tsup/esbuild;frontmatter:gray-matter;CLI:commander)
- 定位:给 AI 用、多机制(hook/skill/CLI)一份核心多入口、随 skill 生态分发、**不走 MCP**
- 已拍板约束(CLAUDE.md,别推翻):
  - 不做一致性检测 / 安全 audit(避撞 skillshare)
  - evolve 绝不自动改 skill(人审)
  - bug 采集借 GitHub Issues
  - 五环:lint → rating → bug/issue → evolve → inspiration
- 用户自用驱动,三痛点:① AI 主动提议写 skill(inspiration)② 知道 skill 有没有用(usage)③ bug 回流修 skill(evolve)。流程:定义好坏 → 度量 → 改进

# 探索结论(已 grill + 技术调研验证,别重新讨论)

**MVP 方向 = 统计「用户手动激活 skill 的调用」**(不是 lint、不是 AI 自主激活)。

关键技术调研结论(实测过):
1. Claude Code 30 个 hook 事件,**无 skill 激活事件** → AI 自主激活 skill 抓不到(死局)
2. 会话日志 `~/.claude/projects/*/*.jsonl` 里**无 skill 调用记录**,只有 `attachment.type: skill_listing` / `dynamic_skill`(discovery:有哪些 skill,不是调用了哪个)
3. 故 usage(AI 自主激活)无数据源。但**用户手动激活可抓**:
   - `UserPromptExpansion` hook:用户打 `/skill-name` 时触发(matcher 按 command 名)→ **精确抓手动 /slash 调用**
   - `UserPromptSubmit` hook:用户 prompt 文本 → 可匹配已装 skill 名(**近似**,抓自然语言"用 X skill")
4. 数据库 + hook 实时埋点 > 扫 jsonl(实时/主动/结构化)

# MVP 范围

left-skills 装 hook(`UserPromptExpansion` + `UserPromptSubmit`),实时记录用户手动 skill 调用到本地数据库,出使用报告:
- 每个 skill:手动调用次数(/slash 精确 + prompt 提及近似,**分开标**)、最近调用时间、从未手动调用 ⚠
- 输出:人看(报告)+ AI 看(`--json`)
- 解用户痛点 ② 子集(自己激活了哪些 / 几次 / 哪些从没手动用过)

**诚实边界**(别越界):
- 只覆盖用户手动激活(/slash 精确 + 自然语言近似);AI 自主激活抓不到 → **不标"调用次数"**,标"手动 / 提及 / 相关tool"
- 要用户装 hook 配置(分发带 hook 片段)
- 有状态(本地数据库)
- 只 Claude Code(Cursor/Codex 后扩)

# 技术 spike(✅ 已实测钉死,2026-06-29)

`UserPromptExpansion` payload 实测字段(用户打 `/opsx:explore` 触发):
- `command_name`:精确 skill/command 名(如 `"opsx:explore"`)← **取这个当 skill 调用**
- `expansion_type`:`"slash_command"`;`command_args`、`command_source`、`prompt`(完整展开)
- 公共:`session_id` / `transcript_path` / `cwd` / `permission_mode` / `hook_event_name`

`UserPromptSubmit` payload:
- `prompt`:用户完整 prompt 文本 ← **在这里匹配已装 skill 名(近似提及)**
- 公共:同上

`PreToolUse` payload(matcher=Skill,调 Skill 工具触发):
- `tool_name`:`"Skill"`
- `tool_input.skill`:**AI 调用的 skill 名**(如 `"keybindings-help"`)← **取这个当 AI 自主调用**
- `tool_use_id`:调用 id
- 公共:同上 + `effort`

实现:UserPromptExpansion 取 `command_name`(手动 /slash 精确);**PreToolUse(matcher=Skill)取 `tool_input.skill`(AI 调 skill 精确)**;UserPromptSubmit 取 `prompt` 文本匹配 skill 名(自然语言近似)。三个数据源全通,当前会话热加载 hook。临时实测 hook 已删。

**重要修正**:之前"AI 自主激活抓不到"是错的——AI 用 skill 走 Skill 工具(jsonl 实证 tool_use name=Skill + PreToolUse 实测 `tool_input.skill`),能精确抓。只有纯 progressive disclosure 内部加载(无 tool call,实证未见)才抓不到。

# 实现 MVP(TS)

1. 核心库:解析 hook payload(用 spike 钉的字段)、关联 skill 名、写本地数据库
2. hook 入口:`UserPromptExpansion` + `UserPromptSubmit` 处理(写数据库)
3. CLI 入口:`left-skills usage` 出报告(人看 + `--json`)
4. 数据库:SQLite(better-sqlite3)或 JSON 文件(选型要考虑单 bundle 打包——better-sqlite3 是 native binding,打包麻烦,可能用纯 JS 或 JSON 文件)
5. 分发:单 bundle `.js` + hook 配置片段(用户加进 settings.json)

# BDD 验收

- 假设 我打 `/pdf-processing` 5 次,当 跑 `left-skills usage`,那么 报告显示 pdf-processing 手动调用 5 次(slash)
- 假设 `gitlab-ci-generate` 从没手动调用,当 跑 `left-skills usage`,那么 标 ⚠ 从未手动调用
- 假设 AI 调 `left-skills usage --json`,那么 返回 `{skills:[{name,count,last_used,trigger_type}]}` 且 AI 能据此建议改/删
- 真值基准:用户自己打几个 /skill,认报告对得上(真值在用户判断)

# 约束

- 不写 evolve / inspiration / lint(MVP 只做手动调用统计,其余五环留 v1+)
- 不自动改 skill
- 代码注释中文,确保不乱码
- 简洁优先:200 行能写完别写 500 行

# 第一步指令

先做 spike:读 `.claude/settings.local.json` 看临时 hook 配置 → 让用户打一个 `/command` → 读 `/tmp/ls-ue.json` 钉 payload 字段名 → 报字段名给用户。spike 完,删临时 hook,再开写 MVP。
