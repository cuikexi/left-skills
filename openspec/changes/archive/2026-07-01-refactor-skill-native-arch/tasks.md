## 1. 删 llm.ts + inspire/evolve CLI

- [ ] 1.1 删 `src/llm.ts`(不调 Anthropic API)
- [ ] 1.2 删 `src/inspire.ts` 的 CLI 命令(inspire 拆成 scan + list-skills)
- [ ] 1.3 删 `src/evolve.ts` 的 CLI 命令(evolve 用 usage + lint,AI 组合)

## 2. 加 scan + list-skills CLI

- [ ] 2.1 `src/scan.ts`(扫 jsonl 一次,出 Bash 重复骨架 + tool 序列,--json)
- [ ] 2.2 `src/cli.ts` 加 `scan` 命令
- [ ] 2.3 `src/cli.ts` 加 `list-skills` 命令(包装 listInstalledSkills,--json)
- [ ] 2.4 `src/lint.ts` 加 --json 输出

## 3. SKILL.md body 改

- [ ] 3.1 `src/install.ts` SKILL_MD_CONTENT 改(body:AI 跑 CLI --json + AI 分析 + 人审,写死组合表)
- [ ] 3.2 SKILL.md 列入口(inspire/evolve/lint/usage)+ 组合(scan+list-skills / usage+lint)+ 红线

## 4. 测试

- [ ] 4.1 scan --json(Bash 重复 + tool 序列)
- [ ] 4.2 list-skills --json(已装名单)
- [ ] 4.3 lint --json
- [ ] 4.4 不调 LLM(无 llmAnalyze)

## 5. README / docs

- [ ] 5.1 README 改:入口是 /left-skills slash(推荐),CLI 是数据工具箱(不调 LLM)
