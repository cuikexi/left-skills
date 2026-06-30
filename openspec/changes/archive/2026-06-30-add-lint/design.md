## Context

`usage`(用频)done。`lint`(静态质量)补 usage(综合度量:用频 + 质量)+ evolve 前置(evolve 据 usage+lint 生成 diff)。对齐 skills-ref(结构,不重造)+ 补 skillshare 没深度。

## Goals / Non-Goals

**Goals:**
- `lint` 扫 SKILL.md 静态质量(对齐 skills-ref + 补深度)
- 0-100 静态分(规则加权聚合)
- 独立(不抢 usage;只检查不改进)

**Non-Goals:**
- 不抢 usage(用频是 usage 的事)
- 只检查(不改进 —— evolve 的事,不占位)
- 不重造 skills-ref 结构(对齐)
- 不做 AI quality(主观,无 LLM,evolve 后)

## Decisions

1. **规则**(对齐 skills-ref + 补深度):
   - `name-kebab`(ERROR):name kebab-case(小写 + 连字符,不首尾连字符,不连续连字符)
   - `name-dir-match`(ERROR):name = 目录名
   - `description-present`(ERROR):description 存
   - `description-len`(WARN):20–300 字符(短/长警告)
   - `metadata-targets`(INFO):有 metadata.targets(分发用)
   - `argument-hint`(INFO):接参数的 skill 有 argument-hint
   - `token-budget`(WARN):body < 5000 token / < 500 行(对齐 agentskills.io 推荐)
2. **0-100 静态分**:基础 100,ERROR −N / WARN −M / INFO 不扣,clamp 0–100
3. **lint 独立命令**:不抢 usage;report 后聚合(usage + lint,lint 做了 report 自动加)

## Risks / Trade-offs

- [规则对齐 skills-ref] → agentskills.io 规范已查(name/description/metadata 字段),对齐
- [主观规则 description-quality] → 不做(无 LLM,evolve 后用 AI 评)
- [token 估算] → 粗估(字符数 / 4 或行数),不精确够用
