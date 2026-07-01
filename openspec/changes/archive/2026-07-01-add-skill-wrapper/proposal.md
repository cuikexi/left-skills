## Why

left-skills 是 npm CLI(终端 `left-skills inspire`),但用户想在 Claude Code 里 `/left-skills:inspire` slash 触发。之前 plugin 方案废了(半吊子)。SKILL.md wrapper = 20 行 Markdown(body 调 `left-skills` binary),不用 plugin 规范/marketplace。

## What Changes

1. left-skills 自己也是个 skill(`~/.claude/skills/left-skills/SKILL.md`),body 是 wrapper:调 `left-skills inspire`/`lint`/`evolve`/`usage` 等
2. `install --write` 自动放 SKILL.md(和 hook 一起,一键配 hook + slash)

## Capabilities

### New Capabilities

- `skill-wrapper`: left-skills 作为 SKILL.md wrapper(`/left-skills:*` slash 触发,body 调 npm binary)

### Modified Capabilities

- `install`: 改(--write 时自动放 SKILL.md + hook)

## Impact

- `src/install.ts` 加:放 `~/.claude/skills/left-skills/SKILL.md`
- 新 SKILL.md(wrapper,body 调 left-skills 命令)
- 测试 + README
