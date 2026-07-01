## Why

五环 4/5(lint+usage+evolve)done。`inspire`(发现)是 v2 —— 痛点 1(AI 主动提议写 skill,不用人想)。**简化 prompt 版**(扫会话+prompt,不 LLM,无 token/质量风险)。

## What Changes

1. `left-skills inspire`:扫会话日志找重复 Bash command → 输出 prompt(提议写 skill + 草稿指令)
2. **不 LLM**(只扫+prompt),用户 Claude Code 跑 AI 生成草稿 → 人审 → `.claude/skills/`

## Capabilities

### New Capabilities

- `inspire-prompt`: 扫会话日志找重复 Bash command → 输出 prompt(不 LLM,人审)

### Modified Capabilities

(无 —— 不改 `usage`/`lint`/`evolve`;inspire 独立扫会话)

## Impact

- 新增 `src/inspire.ts`(扫日志+找重复+prompt)+ `src/cli.ts` 加 `inspire` 命令
- 测试 + README / docs
