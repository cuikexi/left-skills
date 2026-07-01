## ADDED Requirements

### Requirement: 删 llm.ts(不调 LLM)
left-skills SHALL 不调 Anthropic API(删 llm.ts)。CLI 只做逻辑(数据采集 + 正则 + 统计 + 格式化),不调 LLM。

#### Scenario: 不调 LLM
- **WHEN** 跑 `left-skills inspire --json`
- **THEN** 输出 JSON 数据(候选 + 序列 + OBSERVE),不调 Anthropic API

### Requirement: 每命令 --json(AI 消费)
left-skills 每命令 SHALL 支持 `--json`(结构化数据,AI 消费):usage(已有)+ lint + inspire + evolve。

#### Scenario: lint --json
- **WHEN** 跑 `left-skills lint --json`
- **THEN** 输出 JSON: `{skills: [{name, score, issues}]}`

#### Scenario: inspire --json
- **WHEN** 跑 `left-skills inspire --json`
- **THEN** 输出 JSON: `{candidates, tool_sequences, installed}`
- **AND** 不含 LLM 精提(只数据)

#### Scenario: evolve --json
- **WHEN** 跑 `left-skills evolve <skill> --json`
- **THEN** 输出 JSON: `{skill, usage, lint}`
- **AND** 不含 LLM 精提

### Requirement: SKILL.md 是推荐入口
SKILL.md wrapper SHALL 是推荐入口(`/left-skills` slash)。body 说"AI 跑 CLI --json + AI 分析 + 人审"。

#### Scenario: slash 触发 AI 分析
- **WHEN** 用户打 `/left-skills inspire`
- **THEN** AI 跑 `left-skills inspire --json` → AI 读 JSON → AI 分析(该不该写 + 草稿)→ 人审

### Requirement: 不 token 问题
left-skills SHALL 不依赖 ANTHROPIC_API_KEY/BASE_URL(删 llm.ts)。LLM = Claude Code 本身。

#### Scenario: 代理环境
- **WHEN** 用户有代理(ANTHROPIC_BASE_URL)
- **AND** 跑 `left-skills inspire --json`
- **THEN** 不调 API,输出数据(JSON),不降级
