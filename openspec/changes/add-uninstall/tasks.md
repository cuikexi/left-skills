## 1. removeHooksFromSettings

- [ ] 1.1 `src/install.ts` 加 `removeHooksFromSettings(settingsPath)`(读 settings,删 command 含 `left-skills hook` 的 entry,备份 `.bak`,写回)

## 2. uninstall 命令

- [ ] 2.1 `src/cli.ts` 加 `uninstall` 命令(调 removeHooksFromSettings,默认全局 `~/.claude/settings.json`)

## 3. 测试

- [ ] 3.1 uninstall 后 settings 无 left-skills hook(测试 fixture:构造 settings 含 left-skills hook + 别的 hook,uninstall 后只 left-skills 删)
- [ ] 3.2 备份 `.bak` 存在

## 4. README / docs

- [ ] 4.1 README + docs/install.md 加 uninstall 说明(`left-skills uninstall` 删 hook,配合 `npm uninstall -g` 干净卸载)
