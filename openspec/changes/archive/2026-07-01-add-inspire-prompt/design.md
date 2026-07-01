## Context

五环 4/5 done。`inspire` 最后(痛点 1,发现)。简化 prompt(扫会话+prompt,不 LLM,质量在 Claude Code 人审)。

## Goals / Non-Goals

**Goals:**
- `inspire` 扫会话日志找重复 Bash command → 输出 prompt(提议写 skill)
- 不调 LLM(只扫+prompt)
- 人审(不自动写 skill)

**Non-Goals:**
- 不调 LLM(无 token)
- 不自动写 skill(人审,红线)
- 不 NLP(精确匹配,不语义相似)
- 不扫 user prompt(只 Bash command,MVP)

## Decisions

1. **扫会话日志**:`~/.claude/projects/*/*.jsonl`(近 30 天),提取 Bash tool_use command
2. **找重复**:长命令(≥30 字符)重复 ≥3 次(复杂命令反复 → 该写 skill 自动化)
3. **prompt 生成**:输出给 AI("你反复跑这些命令 N 次,该写 skill?生成 SKILL.md 草稿:...")
4. **不 LLM**:left-skills 只扫+prompt;用户 Claude Code 跑 AI 生成草稿 → 人审

## Risks / Trade-offs

- [精确匹配] → 命令微差漏(如 `git commit -m "X"` 每次不同)→ MVP 找明显重复够
- [阈值启发式] → ≥30 字符 / ≥3 次(不完美,但简单)
- [不 NLP] → 不找语义相似(后加)
