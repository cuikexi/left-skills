## Context

`install --write`(0.1.9)写 hook 到 `~/.claude/settings.json`(合并去重 + 备份)。用户卸载 left-skills(`npm uninstall -g`)时 hook 残留 → hook 命令 `left-skills hook` 找不到 binary 报错。要 `uninstall` 删 hook(对偶 install --write,干净卸载)。skillshare 有 uninstall(装/卸对称)。

## Goals / Non-Goals

**Goals:**
- `uninstall` 删 `~/.claude/settings.json` 的 left-skills hook(备份 `.bak`)
- 干净卸载(无残留 hook 报错)

**Non-Goals:**
- 不删别的 hook / 配置(只删 command 含 `left-skills hook` 的 entry)
- 不删 `~/.left-skills/usage.json`(用户数据留)
- 不 `npm uninstall -g`(用户自己卸 npm 包)

## Decisions

1. **removeHooksFromSettings(settingsPath)**:读 settings,删 left-skills hook entry(command 含 `left-skills hook` 的),备份 `.bak`,写回
2. **uninstall 命令**:默认全局 `~/.claude/settings.json`(同 install --write),调 removeHooksFromSettings
3. **只删 left-skills hook**:遍历 hooks 各 event,删 command 含 `left-skills hook` 的 entry(不删别的 hook)
4. **不删 usage.json**:用户数据留(不 --purge;MVP 简单)

## Risks / Trade-offs

- [误删别的 hook] → 只删 command 含 `left-skills hook` 的 entry(精确匹配 left-skills,安全)
- [settings.json 格式] → 备份 `.bak` 兜底(同 install --write)
- [event 数组删后空] → 空数组留或删 event key?(留空数组,简单)
