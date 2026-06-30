## Context

现状 left-skills 是 npm CLI(0.1.8,OIDC publish)+ 手写 `~/.claude/settings.json` hook(用户手抄 JSON)。skill 生态(superpowers)用 Claude Code plugin(`.claude-plugin/plugin.json` + `hooks/hooks.json`,`/plugin install` 自动配 hook)。Claude Code plugin 规范(已查 docs):manifest + `hooks/hooks.json`(格式同 settings hooks)+ marketplace 分发。

## Goals / Non-Goals

**Goals:**
- left-skills 作 Claude Code plugin(`.claude-plugin/plugin.json` + `hooks/hooks.json`)
- `/plugin install left-skills` 自动配 hook(不手写 settings.json)
- README Install 加 `/plugin install` 方式

**Non-Goals:**
- 不改代码(`src/` 不变,npm left-skills 提供 binary)
- 不做 plugin bin 自含 binary(方案 1,后升级方案 2)
- 不提交 `claude-community`(先自己 marketplace)

## Decisions

1. **plugin 结构**:`.claude-plugin/plugin.json`(manifest)+ `hooks/hooks.json`(三 hook)
2. **方案 1**(plugin 只配 hook,npm 提供 binary):用户 `npm i -g left-skills`(装 binary)+ `/plugin install left-skills`(配 hook)。plugin 是 hook 配置包装,核心逻辑不变。后升级方案 2(plugin `bin/` 自含)
3. **hooks.json**(三 hook,command `left-skills hook`,格式同 settings.json hooks):
   - `UserPromptExpansion` matcher `.*` → `left-skills hook UserPromptExpansion`
   - `PreToolUse` matcher `Skill` → `left-skills hook PreToolUse`
   - `UserPromptSubmit` → `left-skills hook UserPromptSubmit`
4. **marketplace**:仓库 `cuikexi/left-skills` 作 marketplace(`.claude-plugin/marketplace.json` 列 left-skills plugin)。`/plugin marketplace add cuikexi/left-skills` + `/plugin install left-skills`
5. **README Install**:`/plugin install` 优先(自动配 hook),`npm i -g` 备选(binary)

## Risks / Trade-offs

- [plugin 要 npm left-skills 在 PATH] → 用户先 `npm i-g`(方案 1 限制;后升级方案 2 自含 bin)
- [marketplace 配置] → `.claude-plugin/marketplace.json` 格式要查 Claude Code docs
- [plugin 规范变化] → Claude Code 演进,plugin 规范可能变
