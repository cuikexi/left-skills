## 1. lint 规则引擎

- [ ] 1.1 `src/lint.ts`(规则:name-kebab / name-dir-match / description-present / description-len / metadata-targets / argument-hint / token-budget,0-100 分)
- [ ] 1.2 扫 SKILL.md frontmatter + body(gray-matter 解析)

## 2. lint 命令

- [ ] 2.1 `src/cli.ts` 加 `lint` 命令(扫 .claude/skills + .codex/skills,出 lint 报告:每 skill 规则 ✓/✗ + 0-100 分)

## 3. 测试

- [ ] 3.1 fixture 合规 skill(全 ✓ + 高分)
- [ ] 3.2 fixture 违规 skill(name 大写 / name≠目录 / description 缺,验规则触发)

## 4. README / docs

- [ ] 4.1 README + docs 加 lint 说明(`left-skills lint` 静态质量 + 0-100 分)
