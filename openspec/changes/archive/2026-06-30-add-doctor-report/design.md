## Context

left-skills 不工作时排错难(hook / binary / settings / usage.json 哪个出问题?)。`usage` 报告只终端看,分享 / 团队 / 贴图要导出。`doctor` 诊断 + `report` 导出(skillshare 同款 `doctor`)。

## Goals / Non-Goals

**Goals:**
- `doctor` 一键诊断(binary / hook / usage.json / npm 全局),✓/✗ + 修复建议
- `report --markdown` 导出 usage 报告 markdown

**Non-Goals:**
- doctor 只诊断(不改配置)
- report 不做 html(MVP markdown)
- doctor 不诊断别的工具(只 left-skills)

## Decisions

1. **doctor 诊断项**:
   - binary 在 PATH?(`which left-skills` 或 `command -v`)
   - `~/.claude/settings.json` 有 left-skills hook?(读 settings,查 hooks command 含 left-skills)
   - `~/.left-skills/usage.json` 存?
   - npm 全局装了 left-skills?(`npm ls -g left-skills`)
   - 输出:每项 ✓/✗ + 修复建议(没装→`npm i-g`,没 hook→`install --write`)
2. **report formatMarkdown**:usage 报告 markdown 格式(`# left-skills 报告` + skill 列表 + 调用次数 + 从未调用 ⚠),stdout(`> report.md`)
3. **doctor 只诊断**(不改配置);**report 只导出**(markdown)

## Risks / Trade-offs

- [doctor 诊断准确性] → `which` / `npm ls` 可能慢或 false neg(用 spawnSync,超时兜底)
- [report markdown 格式] → 简洁(表格 / 列表),不花哨
