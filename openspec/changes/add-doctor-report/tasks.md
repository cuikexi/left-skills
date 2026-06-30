## 1. doctor 诊断

- [ ] 1.1 `src/doctor.ts`(诊断函数:checkBinary / checkHook / checkUsageFile / checkNpmGlobal,返回 ✓/✗ + 建议)
- [ ] 1.2 `src/cli.ts` 加 `doctor` 命令(调诊断,输出 ✓/✗ + 建议)

## 2. report 导出

- [ ] 2.1 `src/report.ts` 加 `formatMarkdown(report)`(usage 报告 markdown 格式)
- [ ] 2.2 `src/cli.ts` 加 `report --markdown` 命令(输出 markdown 到 stdout)

## 3. 测试

- [ ] 3.1 doctor 诊断(fixture:模拟 binary/hook/usage.json 状态,验 ✓/✗ + 建议)
- [ ] 3.2 report markdown(验格式:含 skill 列表 + 从未调用 ⚠)

## 4. README / docs

- [ ] 4.1 README + docs/install.md 加 doctor + report 说明
