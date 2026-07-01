## Why

left-skills 0.8.0 有 llm.ts(调 Anthropic API)→ token/代理/模型名问题 → LLM 降级。但定位"skill 中运行"→ **Claude Code 本身就是 LLM** → 不需要 left-skills 调 LLM。删 llm.ts,binary 只做逻辑(数据采集),AI(Claude Code)做分析。**入口都是 skill 触发**(/left-skills slash)。

## What Changes

1. **删 llm.ts**(不调 Anthropic API,不 token/代理/模型名)
2. **CLI 只逻辑**(数据采集 + 正则 + 统计 + 格式化,不调 LLM)
3. **每个命令加 --json**(AI 消费结构化数据)
4. **inspire/evolve 改**:删 LLM 精提,只输出数据 JSON(AI 读后分析)
5. **SKILL.md body 改**:AI 跑 CLI --json + AI 分析 + 人审(推荐入口)

## Capabilities

### New Capabilities

- `skill-native-arch`: 三层架构(入口 SKILL.md / 逻辑 CLI / 智能 AI)

### Modified Capabilities

- `inspire-prompt`: 改(删 LLM 精提,只输出 --json 数据)
- `evolve-prompt`: 改(删 LLM 精提,只输出 --json 数据)
- `lint`: 改(加 --json)
- `skill-wrapper`: 改(body 改"AI 跑 --json + AI 分析")

## Impact

- 删 `src/llm.ts`
- 改 `src/inspire.ts`(删 LLM,加 --json)
- 改 `src/evolve.ts`(删 LLM,加 --json)
- 改 `src/lint.ts`(加 --json)
- 改 `src/cli.ts`(各命令加 --json)
- 改 SKILL.md wrapper(body 改)
- 测试 + README
