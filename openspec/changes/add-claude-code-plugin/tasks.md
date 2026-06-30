## 1. plugin manifest

- [ ] 1.1 `.claude-plugin/plugin.json`(name=left-skills / description / version / author / repository / license / keywords)

## 2. hooks.json

- [ ] 2.1 `hooks/hooks.json`(三 hook:UserPromptExpansion matcher `.*` / PreToolUse matcher `Skill` / UserPromptSubmit,command `left-skills hook`)

## 3. marketplace

- [ ] 3.1 `.claude-plugin/marketplace.json`(列 left-skills plugin,参考 Claude Code marketplace 规范)
- [ ] 3.2 验 `/plugin marketplace add cuikexi/left-skills` 能加

## 4. 验 plugin install

- [ ] 4.1 `/plugin install left-skills`(自动配 hook,不手写 settings)
- [ ] 4.2 打 /skill + AI 调 skill 自动记录到 `~/.left-skills/usage.json`
- [ ] 4.3 `left-skills usage` 报告含 plugin 配 hook 后的记录

## 5. README

- [ ] 5.1 README Install 加 `/plugin install` 方式(plugin 优先,`npm i-g` 备选 binary)
