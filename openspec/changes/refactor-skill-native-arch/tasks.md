## 1. 删 llm.ts

- [ ] 1.1 删 `src/llm.ts`(不调 Anthropic API)
- [ ] 1.2 inspire/evolve 删 llmAnalyze 调用(只输出数据)

## 2. --json 每命令

- [ ] 2.1 `src/lint.ts` 加 `--json` 输出({skills: [{name, score, issues}]})
- [ ] 2.2 `src/inspire.ts` 加 `--json` 输出({candidates, tool_sequences, installed})
- [ ] 2.3 `src/evolve.ts` 加 `--json` 输出({skill, usage, lint})
- [ ] 2.4 `src/cli.ts` 各命令加 `--json` option

## 3. SKILL.md body 改

- [ ] 3.1 `src/install.ts` SKILL_MD_CONTENT 改(body:AI 跑 --json + AI 分析 + 人审)
- [ ] 3.2 SKILL.md 列子命令(--json 用法)+ 红线(人审)

## 4. 测试

- [ ] 4.1 inspire --json(结构化,无 LLM)
- [ ] 4.2 evolve --json
- [ ] 4.3 lint --json
- [ ] 4.4 不调 LLM(无 llmAnalyze)

## 5. README / docs

- [ ] 5.1 README 改:入口是 /left-skills slash(推荐),CLI 是底层逻辑(不调 LLM)
