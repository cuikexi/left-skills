## 1. 项目骨架

- [ ] 1.1 初始化 TS 项目(`package.json` + `tsconfig.json`)
- [ ] 1.2 加依赖(commander / tsup / gray-matter)
- [ ] 1.3 tsup 配置(单文件 bundle `.js`)
- [ ] 1.4 bin 入口(`left-skills` 命令)

## 2. hook payload 解析(三数据源)

- [ ] 2.1 `UserPromptExpansion` 解析(取 `command_name` → manual 记录)
- [ ] 2.2 `PreToolUse` 解析(matcher=Skill,取 `tool_input.skill` → ai 记录)
- [ ] 2.3 `UserPromptSubmit` 解析(`prompt` 文本匹配已装 skill 名 → mention 记录)
- [ ] 2.4 hook 入口子命令(`left-skills hook <event>`,读 stdin payload 解析后写存储)

## 3. 本地存储

- [ ] 3.1 JSON 文件存储结构(skill 调用记录数组)
- [ ] 3.2 append 记录(append-only,串行)
- [ ] 3.3 读取 + 聚合(按 skill 名 + 触发方式 + 时间窗口)

## 4. CLI usage 报告

- [ ] 4.1 `left-skills usage`(人看:每 skill manual/ai/mention 分开 + 最近时间 + 从未调用 ⚠)
- [ ] 4.2 `--json` 输出(`{skills:[{name,manual,ai,mention,last_used}],generated_at}`)
- [ ] 4.3 退出码(0 信息性)
- [ ] 4.4 扫已装 skill 名(`.claude/skills/` + `.codex/skills/`)列从未调用

## 5. hook 配置分发

- [ ] 5.1 生成 hook 片段(UserPromptExpansion / PreToolUse / UserPromptSubmit 配置,调 `left-skills hook`)
- [ ] 5.2 install 文档(用户加片段进 settings.json)

## 6. BDD 验收

- [ ] 6.1 fixture:模拟打 /skill(构造 UserPromptExpansion payload)→ 记录 manual
- [ ] 6.2 fixture:模拟 AI 调 Skill(构造 PreToolUse payload)→ 记录 ai
- [ ] 6.3 fixture:模拟 prompt 提及(构造 UserPromptSubmit payload)→ 记录 mention
- [ ] 6.4 验收:跑 `left-skills usage` 报告对得上 fixture 预期
- [ ] 6.5 验收:`--json` 结构 AI 可解析
- [ ] 6.6 真值基准:用户自己打几个 /skill,认报告对得上
