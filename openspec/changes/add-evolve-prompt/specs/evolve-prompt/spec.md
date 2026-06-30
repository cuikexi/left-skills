## ADDED Requirements

### Requirement: evolve <skill> 收集信号 + 输出 prompt
`left-skills evolve <skill>` SHALL 收集该 skill 的 usage(没用/少用)+ lint(不合规规则)信号,输出改进 prompt(给 AI 的指令)。

#### Scenario: 没用 + 不合规 skill
- **WHEN** skill usage 0 + lint 不合规(name 大写),跑 `left-skills evolve <skill>`
- **THEN** 输出 prompt(含 usage 信号 "从未调用" + lint 信号 "name 不 kebab" + 改进指令 "改 name + description 让 AI 触发")

### Requirement: 不调 LLM(只 prompt)
`left-skills evolve` SHALL 只输出 prompt,不调 LLM API(无 token,无质量风险)。AI 生成 diff 在 Claude Code(用户跑)。

#### Scenario: 不调 LLM
- **WHEN** 跑 `left-skills evolve <skill>`
- **THEN** 输出 prompt 文本(不调 API,不生成 diff;用户把 prompt 给 Claude Code 跑 AI)

### Requirement: 不自动改(人审)
`left-skills evolve` SHALL 不自动修改 SKILL.md(人审,红线)。用户 review AI 生成的 diff 后应用。

#### Scenario: 人审不自动
- **WHEN** 跑 `left-skills evolve <skill>`
- **THEN** SKILL.md 不变(只输出 prompt;AI diff 人审应用)
