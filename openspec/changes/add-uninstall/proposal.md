## Why

`install --write`(0.1.9)写 hook 到 `~/.claude/settings.json`。用户卸载 left-skills(`npm uninstall -g`)时,**hook 残留** —— hook 命令 `left-skills hook` 找不到 binary → 报错。要 `uninstall` 删 hook 干净卸载。skillshare 有 `uninstall`(装/卸对称),left-skills 该对偶 `install --write`。

## What Changes

1. `src/install.ts` 加 `removeHooksFromSettings(settingsPath)`(删 left-skills hook entry,备份 `.bak`,写回)
2. `src/cli.ts` 加 `uninstall` 命令(调 removeHooksFromSettings,默认全局 `~/.claude/settings.json`)
3. 测试(uninstall 后 settings 无 left-skills hook + 备份 `.bak`)
4. README / docs/install.md 加 uninstall 说明

## Capabilities

### New Capabilities

- `uninstall`: `left-skills uninstall` 删 hook(对偶 `install --write`,干净卸载)

### Modified Capabilities

(无 —— 不改 `install --write` / `usage` 行为;uninstall 是新增删 hook)

## Impact

- `src/install.ts` 加 `removeHooksFromSettings`
- `src/cli.ts` 加 `uninstall` 命令
- 测试 + README / docs
- 不删 `~/.left-skills/usage.json`(用户数据留;不 `npm uninstall`,用户自己)
