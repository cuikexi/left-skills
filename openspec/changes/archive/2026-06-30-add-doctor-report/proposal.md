## Why

left-skills 不工作时用户难排错(hook 配没?binary 在 PATH?settings 错?usage.json 存?)。`usage` 报告只终端看,要分享 / 贴图 / 团队需导出。`doctor` 一键诊断(skillshare 同款)+ `report` 导出 markdown。

## What Changes

1. `left-skills doctor`:诊断安装 / hook 配置(binary 在 PATH?settings.json 有 left-skills hook?usage.json 存?npm 全局装?),输出 ✓/✗ + 修复建议
2. `left-skills report --markdown`:导出 usage 报告为 markdown(stdout,可 `> report.md`)

## Capabilities

### New Capabilities

- `doctor-report`: `doctor` 诊断 + `report` 导出(辅助命令)

### Modified Capabilities

(无 —— 不改 `usage` / `install` / `uninstall`)

## Impact

- 新增 `src/doctor.ts`(诊断函数)+ `src/report.ts` 加 `formatMarkdown`
- `src/cli.ts` 加 `doctor` / `report` 命令
- 测试 + README / docs
