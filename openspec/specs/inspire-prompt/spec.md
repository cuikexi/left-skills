## ADDED Requirements

### Requirement: inspire 找重复 Bash command + 输出 prompt
`left-skills inspire` SHALL 扫会话日志(~/.claude/projects/*.jsonl,近 30 天),提取 Bash tool_use command,找重复(长命令 ≥30 字符,重复 ≥3 次),输出 prompt(提议写 skill + 草稿指令)。

#### Scenario: 有重复命令
- **WHEN** 用户反复跑某长命令(≥30 字符)≥3 次,跑 `left-skills inspire`
- **THEN** 输出 prompt(含重复命令 + 次数 + "该写 skill?生成 SKILL.md 草稿" 指令)

#### Scenario: 无重复
- **WHEN** 无重复长命令,跑 `left-skills inspire`
- **THEN** 输出 "无重复模式,暂不建议写 skill"

### Requirement: 不调 LLM(只 prompt)
`left-skills inspire` SHALL 只扫+找重复+输出 prompt,不调 LLM API。AI 生成草稿在 Claude Code(用户跑)。

#### Scenario: 不调 LLM
- **WHEN** 跑 `left-skills inspire`
- **THEN** 输出 prompt 文本(不调 API,不生成 SKILL.md;用户把 prompt 给 Claude Code 跑 AI)

### Requirement: 不自动写 skill(人审)
`left-skills inspire` SHALL 不自动创建 SKILL.md(人审,红线)。用户 review AI 草稿后丢进 .claude/skills/。

#### Scenario: 人审不自动
- **WHEN** 跑 `left-skills inspire`
- **THEN** 不创建 SKILL.md(只输出 prompt;AI 草稿人审后入库)
