## ADDED Requirements

### Requirement: SKILL.md wrapper(slash 触发)
left-skills SHALL 有 `~/.claude/skills/left-skills/SKILL.md`(wrapper),body 调 `left-skills` binary。用户 `/left-skills:inspire` slash 触发 → AI 跑 `left-skills inspire`。

#### Scenario: slash 触发
- **WHEN** 用户打 `/left-skills:inspire`(slash)
- **THEN** Claude Code 触发 SKILL.md → AI 跑 `left-skills inspire` → 输出给用户

### Requirement: install --write 自动放 SKILL.md
`left-skills install --write` SHALL 自动放 `~/.claude/skills/left-skills/SKILL.md`(和 hook 一起)。

#### Scenario: install 放 SKILL.md
- **WHEN** 跑 `left-skills install --write`
- **THEN** `~/.claude/skills/left-skills/SKILL.md` 存在(wrapper)+ hook 写 settings.json

### Requirement: SKILL.md 通用(body 列子命令)
SKILL.md body SHALL 通用(列 inspire/lint/usage/evolve/doctor/report,AI 据用户意图跑对应 binary)。

#### Scenario: 用户要 lint
- **WHEN** 用户打 `/left-skills`(slash)+ 说"检查 skill 质量"
- **THEN** AI 跑 `left-skills lint`(AI 据意图选子命令)
