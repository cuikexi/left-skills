## ADDED Requirements

### Requirement: doctor 诊断 + ✓/✗ + 建议
`left-skills doctor` SHALL 诊断(binary 在 PATH?settings.json 有 left-skills hook?usage.json 存?npm 全局装?),输出每项 ✓/✗ + 修复建议。

#### Scenario: 全装好
- **WHEN** left-skills 装好 + hook 配好 + usage.json 存,跑 `left-skills doctor`
- **THEN** 全 ✓(binary ✓ / hook ✓ / usage.json ✓ / npm ✓)

#### Scenario: hook 没配
- **WHEN** settings.json 无 left-skills hook,跑 `left-skills doctor`
- **THEN** hook ✗ + 建议"跑 left-skills install --write"

### Requirement: doctor 只诊断不改
`left-skills doctor` SHALL 只诊断输出,不修改配置(不写 settings / 不装 binary)。

#### Scenario: doctor 不改
- **WHEN** 跑 `left-skills doctor`
- **THEN** settings.json / binary / usage.json 不变(只输出诊断)

### Requirement: report 导出 markdown
`left-skills report --markdown` SHALL 输出 usage 报告 markdown 到 stdout(可 `> report.md` 分享)。

#### Scenario: report markdown
- **WHEN** 跑 `left-skills report --markdown`
- **THEN** 输出 markdown 报告(`# left-skills 报告` + skill 列表 + 调用次数 + 从未调用 ⚠),可 `> report.md`
