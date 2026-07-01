## Context

left-skills 是 npm CLI(终端跑)。用户想 Claude Code `/left-skills:inspire` slash 触发。plugin 方案废了(半吊子)。SKILL.md wrapper = 20 行(body 调 binary)。

## Goals / Non-Goals

**Goals:**
- left-skills 作为 SKILL.md wrapper(`/left-skills:*` slash 触发)
- install --write 自动放 SKILL.md(和 hook 一起)

**Non-Goals:**
- 不做 plugin(之前废)
- 不做 plugin marketplace
- SKILL.md 只是 wrapper(逻辑在 npm binary)

## Decisions

1. **SKILL.md wrapper**:body 说"跑 `left-skills <命令>`,把输出给用户"。description 说明触发场景(用户想管 skill 质量时触发)。
2. **install --write 自动放**:`install --write` 时,除写 hook(settings.json),还放 `~/.claude/skills/left-skills/SKILL.md`(wrapper)。
3. **SKILL.md 内容**:description(name=left-skills,说明 skill 质量管理);body 列子命令(inspire/lint/usage/evolve/doctor/report),AI 据用户意图跑对应 binary。

## Risks / Trade-offs

- [两步(slash + AI 跑 binary)] → 用户只打 slash(一步体验),AI 跑 binary(用户不看)
- [SKILL.md 过时(binary 加命令,wrapper 不跟)] → SKILL.md body 通用("跑 left-skills <用户要的>,看 --help 列命令")
- [wrapper 不 hook(已 global hook)] → SKILL.md 不走 hook(hook 在 settings.json,独立)
