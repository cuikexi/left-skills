## Why

`lint`(定义好坏 ✅)+ `usage`(度量 ✅)done。`evolve`(改进)是 v1b —— 痛点 3(bug 回流修 skill)+ 接 usage+lint 闭环(度量→改进→再度量)。**简化 prompt 版**(left-skills 只生成 prompt,不 LLM,无 API token / 质量风险)。

## What Changes

1. `left-skills evolve <skill>`:收集 usage+lint 信号 → 输出改进 prompt(给 AI 的指令)
2. **不调 LLM**(只 prompt 生成),用户在 Claude Code 跑 AI 生成 diff → 人审应用

## Capabilities

### New Capabilities

- `evolve-prompt`: 收集 usage+lint 信号 → 输出改进 prompt(不 LLM,人审)

### Modified Capabilities

(无 —— 不改 `usage` / `lint`;evolve 读它们的结果,不改)

## Impact

- 新增 `src/evolve.ts`(信号收集 + prompt 生成)+ `src/cli.ts` 加 `evolve` 命令
- 测试 + README / docs
