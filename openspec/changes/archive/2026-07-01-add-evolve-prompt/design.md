## Context

`lint`+`usage` done。`evolve` 接闭环(度量→改进→再度量)。**简化 prompt**(left-skills 不 LLM,只 prompt;AI 改在 Claude Code,人审兜底)—— 质量风险转移,left-skills 不背锅。

## Goals / Non-Goals

**Goals:**
- `evolve <skill>` 收集 usage+lint 信号 → 输出改进 prompt
- 不调 LLM(只 prompt 生成)
- 人审(不自动改)

**Non-Goals:**
- 不调 LLM(无 API token)
- 不自动改 skill(人审,红线)
- 不 bug 痕迹(issue 后,bug 信号补)
- 不生成 diff(只 prompt;AI 生成 diff 在 Claude Code)

## Decisions

1. **信号收集**:读 usage(该 skill 没用/少用?)+ lint(不合规规则?)→ 汇总信号
2. **prompt 生成**:据信号输出给 AI 的改进指令(如 "description 没说明 trigger,改加 use when... / name 不 kebab,改 / body 太长,拆 references")
3. **不 LLM**:left-skills 只 prompt;用户把 prompt 给 Claude Code → AI 生成 diff → 人审
4. **人审**:用户 review diff,接受/拒绝(红线,不自动应用)

## Risks / Trade-offs

- [prompt 质量] → 指令清不清?但人审 + AI 在 Claude Code(用户控),left-skills 不背锅
- [信号准] → usage+lint 已有(准),evolve 据实
- [不 bug 痕迹] → issue 后补(bug 信号;evolve v1b 据 usage+lint 够)
