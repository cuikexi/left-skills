## ADDED Requirements

### Requirement: uninstall 删 left-skills hook
`left-skills uninstall` SHALL 删 `~/.claude/settings.json` 里 left-skills 的 hook entry(command 含 `left-skills hook`),不删别的 hook。

#### Scenario: uninstall 删 left-skills hook
- **WHEN** settings.json 有 left-skills hook(UserPromptExpansion/PreToolUse/UserPromptSubmit 的 command 含 `left-skills hook`),跑 `left-skills uninstall`
- **THEN** settings.json 无 left-skills hook entry(别的 hook 保留)

### Requirement: uninstall 备份 .bak
`left-skills uninstall` SHALL 备份原 settings.json 到 `.bak`(同 install --write)。

#### Scenario: uninstall 备份
- **WHEN** 跑 `left-skills uninstall`
- **THEN** `~/.claude/settings.json.bak` 存在(原内容)

### Requirement: uninstall 只删 left-skills hook
`left-skills uninstall` SHALL 只删 command 含 `left-skills hook` 的 entry,不删别的 hook / 配置。

#### Scenario: 不删别的 hook
- **WHEN** settings.json 有别的 hook(如别的工具的 PostToolUse),跑 `left-skills uninstall`
- **THEN** 别的 hook 保留,只 left-skills hook 被删

### Requirement: 干净卸载
`npm uninstall -g left-skills` + `left-skills uninstall` SHALL 干净卸载(无残留 hook 报错)。

#### Scenario: 卸载后无残留
- **WHEN** 用户 `left-skills uninstall` + `npm uninstall -g left-skills`
- **THEN** settings.json 无 left-skills hook(不报 "left-skills hook not found" 错)
