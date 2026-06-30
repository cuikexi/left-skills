## Why

现状 left-skills 是 npm CLI + 手写 `~/.claude/settings.json` hook(用户要手抄 JSON 配 hook,体验差,非 skill 生态主流)。调研发现 skill 生态(superpowers)用 **Claude Code plugin**(`/plugin install` 自动配 hook,原生)。left-skills 只 Claude Code(已定),该做 plugin:**自动配 hook + 原生体验 + skill 生态主流分发**。

## What Changes

1. 加 `.claude-plugin/plugin.json` manifest(name / description / version / author / repository / license / keywords)
2. 加 `hooks/hooks.json`(三 hook:UserPromptExpansion / PreToolUse / UserPromptSubmit,command `left-skills hook`)
3. marketplace 配置(仓库 `cuikexi/left-skills` 作 marketplace,`/plugin marketplace add cuikexi/left-skills` + `/plugin install left-skills`)
4. README Install 加 `/plugin install` 方式(plugin 优先,npm i-g 备选 binary)

## Capabilities

### New Capabilities

- `claude-code-plugin`: left-skills 作为 Claude Code plugin(`.claude-plugin/plugin.json` manifest + `hooks/hooks.json`,`/plugin install` 自动配 hook)

### Modified Capabilities

(无 —— 不改 `skill-usage-tracking` 行为;plugin 是分发 / hook 配置包装,核心逻辑(npm left-skills)不变)

## Impact

- 新增 `.claude-plugin/plugin.json` + `hooks/hooks.json`
- README Install 加 `/plugin install` 方式
- 不改代码(`src/` 不变,npm left-skills 提供 binary)
- 用户安装从手写 settings.json → `/plugin install`(自动配 hook)
