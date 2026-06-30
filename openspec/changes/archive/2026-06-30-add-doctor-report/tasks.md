## 1. doctor 诊断

- [x] 1.1 `src/doctor.ts`(诊断函数:checkBinary / checkHook / checkUsageFile / checkHookCanRun / checkNodeVersion,5 项深 self-check)
- [x] 1.2 `src/cli.ts` 加 `doctor` 命令(调诊断,输出 ✓/✗ + 建议)

## 2. report 导出

- [x] 2.1 `src/report.ts` 加 `formatMarkdown(report)`(usage 报告 markdown 格式)
- [x] 2.2 `src/cli.ts` 加 `report --markdown` 命令(输出 markdown 到 stdout)

## 3. 测试

- [x] 3.1 doctor 5 项实测(binary/hook/usage/hook 能跑/node 全 ✓)
- [x] 3.2 report markdown 实测(表格输出)

## 4. README / docs

- [ ] 4.1 README + docs/install.md 加 doctor + report 说明
