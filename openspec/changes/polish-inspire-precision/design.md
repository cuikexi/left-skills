## Context

inspire 现状:精确匹配 + Bash only + 不查已装。调研竞品(Hermes/memU/GenericAgent)都 LLM 提取 pattern(语义)。left-skills 学竞品调 LLM,但守人审红线(LLM 只分析,不 apply)。hybrid(正则粗筛降成本 + LLM 精提准)。

## Goals / Non-Goals

**Goals:**
- OBSERVE:prompt 加已装 skill 名单(给 AI/人审判断重复)
- hybrid 相似匹配:正则粗筛骨架 → LLM 精提候选 → prompt(人审)
- LLM 基础设施:Anthropic API,复用 ANTHROPIC_API_KEY,只分析不 apply

**Non-Goals:**
- 不自动 apply(LLM 只分析,人审红线)
- 不调全量 LLM(正则粗筛先降候选,只候选给 LLM,降成本)
- 不做 all tools / 成功路径(change 2 expand)
- 不做 quality+test 提示(change 2)

## Decisions

1. **OBSERVE**:扫 `.claude/skills` 列已装 skill name+description → prompt 加"已装 skill 名单" → AI/人审判断(不 left-skills 自动过滤,准难)
2. **hybrid 相似匹配**:
   - 正则粗筛:command 去引号(`"..."`→`*`)+ 路径(`/path`→`*`)→ 骨架;骨架重复 ≥3 → 候选
   - 去噪:过滤简单命令(echo/ls/cat 等骨架重复不提议,或骨架太短 <10 字符不提议)
   - LLM 精提:候选给 LLM(Anthropic API),prompt "判断这些重复命令该不该写 skill + 生成 SKILL.md 草稿指令" → 输出 prompt(人审)
3. **LLM 基础设施**:
   - `src/llm.ts`:Anthropic API HTTP 调用(messages API)
   - 复用 `ANTHROPIC_API_KEY`(用户已有,不额外配)
   - LLM 只分析(输出 prompt/判断),不 apply(人审红线)
   - 模型:默认 claude-sonnet-4-6(或 ANTHROPIC_MODEL 覆盖)

## Risks / Trade-offs

- [API key] → 复用 ANTHROPIC_API_KEY(用户已有);无 key 时 fallback 纯正则(降级)
- [成本] → 正则粗筛先降候选(只候选给 LLM,不调全量);候选少 = LLM 调用少
- [LLM 幻觉] → 人审兜底(LLM 只输出 prompt,不 apply)
- [正则不准] → 正则粗筛(候选可能漏/噪),LLM 精提(候选给 LLM 判断,兜底)
