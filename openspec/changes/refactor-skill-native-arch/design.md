## Context

left-skills 0.8.0 有 llm.ts(调 Anthropic API,token/代理/模型名问题 → LLM 降级)。定位"skill 中运行"→ Claude Code 本身是 LLM → 删 llm.ts,binary 只逻辑,AI 分析。入口都是 skill 触发(/left-skills)。

## Goals / Non-Goals

**Goals:**
- 删 llm.ts(不调 LLM,不 token)
- CLI 只逻辑(数据采集 + --json 输出)
- SKILL.md 是推荐入口(/left-skills → AI 跑 CLI → AI 分析 → 人审)
- 每个命令 --json(AI 消费)

**Non-Goals:**
- 不删 CLI(保留,逻辑层 + hook 埋点)
- 不自动改 skill(人审红线)
- 不做终端 CLI 为主入口(SKILL.md 是推荐入口)

## Decisions

1. **三层架构**:
   - 入口层:SKILL.md(/left-skills slash,推荐用户用)
   - 逻辑层:CLI(left-skills <命令> --json,数据采集,不 token)
   - 智能层:AI(Claude Code LLM,读 JSON 分析)
2. **删 llm.ts**:inspire/evolve 不调 LLM,只输出 --json 数据
3. **--json 每命令**:usage(已有)+ lint/inspire/evolve(加)
4. **SKILL.md body**:AI 跑 `left-skills <命令> --json` → AI 读 JSON → AI 分析 → 人审

## Risks / Trade-offs

- [CLI 不调 LLM → AI 要读 JSON 分析] → AI(Claude Code)就是 LLM,读 JSON 分析(不 left-skills 调)
- [--json 格式] → 每命令 JSON schema(inspire/evolve/lint/usage)
- [CLI 仍需(hook + 数据)] → hook 埋点 + 数据采集,CLI 保留(逻辑层)
