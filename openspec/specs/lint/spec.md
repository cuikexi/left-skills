## ADDED Requirements

### Requirement: lint 扫 SKILL.md 静态质量
`left-skills lint` SHALL 扫 `.claude/skills/` + `.codex/skills/` 的 SKILL.md,跑静态质量规则(对齐 skills-ref + 补深度),输出每 skill 规则 ✓/✗。

#### Scenario: 违规 skill 标记
- **WHEN** skill name 含大写 + name≠目录名,跑 `left-skills lint`
- **THEN** 标 name-kebab ✗ + name-dir-match ✗,静态分低

#### Scenario: 合规 skill 全 ✓
- **WHEN** skill 合规(name kebab / name=目录 / description 存且长度合 / metadata 齐),跑 `left-skills lint`
- **THEN** 全 ✓,静态分高

### Requirement: 0-100 静态分
`left-skills lint` SHALL 给每 skill 0-100 静态分(规则加权聚合,ERROR 扣多 / WARN 扣少 / INFO 不扣)。

#### Scenario: 静态分
- **WHEN** 跑 `left-skills lint`
- **THEN** 每 skill 有 0-100 分(违规低,合规高)

### Requirement: lint 独立不抢 usage
`left-skills lint` SHALL 只做静态质量检查,不抢 usage(用频)—— lint 静态 / usage 用频,各司其职。

#### Scenario: lint 不抢 usage
- **WHEN** 跑 `left-skills lint`
- **THEN** 只输出静态质量(不输出用频,用频是 usage 的事)

### Requirement: lint 只检查不改进
`left-skills lint` SHALL 只检查输出,不修改 SKILL.md(改进是 evolve 的事)。

#### Scenario: lint 不改
- **WHEN** 跑 `left-skills lint`
- **THEN** SKILL.md 不变(只输出报告)
