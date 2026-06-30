## Why

left-skills 五环 lint → usage → issue → evolve → inspire。`usage`(度量用频)✅ MVP。`lint`(定义好坏,静态质量)是 v1a —— 补 usage(综合度量:用频 + 质量)+ evolve 前置(evolve 据 usage+lint 生成 diff)。轻(无 LLM,确定)。

## What Changes

1. `left-skills lint`:扫 SKILL.md 静态质量,对齐 skills-ref + 补深度规则,出 lint 报告(每 skill 规则 ✓/✗ + 0-100 静态分)
2. lint 独立命令(**不抢 usage**;只检查**不改进**)

## Capabilities

### New Capabilities

- `lint`: 静态质量检查(对齐 skills-ref 结构 + 补深度,0-100 分)

### Modified Capabilities

(无 —— 不改 `usage` / `install` / `doctor` / `report`;lint 独立)

## Impact

- 新增 `src/lint.ts`(规则引擎)+ `src/cli.ts` 加 `lint` 命令
- 测试 + README / docs
