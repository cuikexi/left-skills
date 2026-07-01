## ADDED Requirements

### Requirement: all tools(不只 Bash)
inspire SHALL 扫 all tool_use(Read/Edit/Write/WebFetch 等),不只 Bash;找重复 tool 序列(连续 name 组合 ≥3 次)。

#### Scenario: Read+Edit 序列重复
- **WHEN** Read→Edit→Read 连续组合 ≥3 次,跑 inspire
- **THEN** 候选含 tool 序列(不只 Bash command)

### Requirement: 成功路径 crystallize
inspire SHALL 找连续 tool_use 成功完成序列,LLM 判断"该 crystallize 为 skill"(GenericAgent 路子,人审)。

#### Scenario: 成功路径提议
- **WHEN** 连续 tool_use(Read→Edit→Bash→Test)完成某任务 ≥1 次,跑 inspire
- **THEN** LLM 判断该序列该不该 crystallize → 输出 prompt(人审)

### Requirement: quality+test 指令
LLM 精提 prompt SHALL 含 test cases 指令(Happy/Edge/Error 3 场景),人审(不自动 test)。

#### Scenario: prompt 含 test 指令
- **WHEN** LLM 精提(有 API key),输出 prompt
- **THEN** prompt 含"生成 SKILL.md 时含 test cases(Happy/Edge/Error)"指令(人审,不自动 test)
