## 1. LLM 基础设施

- [ ] 1.1 `src/llm.ts`(Anthropic API HTTP 调用,复用 ANTHROPIC_API_KEY,无 key fallback 纯正则)
- [ ] 1.2 LLM 只分析(输出 prompt/判断),不 apply(人审红线)

## 2. OBSERVE

- [ ] 2.1 `src/inspire.ts` 加:扫 `.claude/skills` 列已装 skill name+description → prompt 加名单

## 3. hybrid 相似匹配

- [ ] 3.1 正则粗筛:command 去引号(`"..."`→`*`)+ 路径(`/path`→`*`)→ 骨架;骨架重复 ≥3 → 候选
- [ ] 3.2 去噪:过滤简单命令(echo/ls/cat 或骨架 <10 字符)
- [ ] 3.3 LLM 精提:候选给 LLM,判断"该不该写 skill" + 生成 SKILL.md 草稿指令 → prompt(人审)

## 4. 测试

- [ ] 4.1 正则粗筛(骨架提取 + 去噪)
- [ ] 4.2 LLM 精提(mock,验 prompt 含判断 + 草稿指令)
- [ ] 4.3 OBSERVE(prompt 含已装名单)

## 5. README / docs

- [ ] 5.1 README + docs 加 inspire 精度说明(hybrid 正则+LLM + OBSERVE + ANTHROPIC_API_KEY)
