## 1. SKILL.md wrapper

- [x] 1.1 写 SKILL.md(wrapper:name=left-skills,description 说明 skill 质量管理,body 列子命令 inspire/lint/usage/evolve/doctor/report,AI 据意图跑 binary)
- [x] 1.2 SKILL.md 通用(body 说"跑 left-skills <命令>,看 --help")避免 binary 加命令后过时

## 2. install --write 放 SKILL.md

- [x] 2.1 `src/install.ts` 加:`install --write` 时放 `~/.claude/skills/left-skills/SKILL.md`(和 hook 一起)
- [x] 2.2 `uninstall` 时删 `~/.claude/skills/left-skills/`(对偶)

## 3. 测试

- [x] 3.1 install --write 放 SKILL.md(验文件存在)
- [x] 3.2 uninstall 删 SKILL.md(验删)

## 4. README / docs

- [x] 4.1 README 加 slash 触发说明(`/left-skills:inspire` slash → AI 跑 binary)
