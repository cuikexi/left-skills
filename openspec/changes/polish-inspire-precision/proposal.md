## Why

inspire 现状局限:精确匹配(`git commit -m "X"` 每次不同,不算重复 → 漏)+ 不查已装(重复提议)+ 不调 LLM(正则不准)。调研竞品(Hermes Skill Forge / memU / GenericAgent)都 **LLM 提取 pattern**(语义,准)。left-skills 学竞品调 LLM(红线 = 不自动改,不是不调 LLM),用 **hybrid**(正则粗筛降成本 + LLM 精提准)。

## What Changes

1. **OBSERVE**:inspire prompt 加已装 skill 名单(给 AI / 人审判断重复,不自动过滤)
2. **hybrid 相似匹配**:正则粗筛骨架(去引号 / 路径,免费)→ LLM 精提候选(判断"该不该写 skill",语义)→ 输出 prompt(人审)
3. **LLM 基础设施**:left-skills 调 Anthropic API(复用 `ANTHROPIC_API_KEY`),LLM 只分析不 apply(人审红线)

## Capabilities

### New Capabilities

- `llm-analysis`: left-skills 调 LLM 做分析(Anthropic API,只分析不 apply,人审红线)
- `inspire-precision`: inspire 精度打磨(OBSERVE + hybrid 相似匹配)

### Modified Capabilities

- `inspire-prompt`: 改(加 OBSERVE 名单 + hybrid 正则+LLM,替代纯精确匹配)

## Impact

- 新增 `src/llm.ts`(Anthropic API 调用)
- 改 `src/inspire.ts`(OBSERVE + hybrid 相似匹配)
- 测试 + README / docs
