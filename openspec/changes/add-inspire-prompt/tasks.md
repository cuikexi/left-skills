## 1. inspire 扫会话 + 找重复 + prompt

- [ ] 1.1 `src/inspire.ts`(扫 ~/.claude/projects/*.jsonl 近 30 天,提取 Bash tool_use command,找重复 ≥3 次,prompt 生成)
- [ ] 1.2 阈值:长命令 ≥30 字符 + 重复 ≥3 次(启发式)

## 2. inspire 命令

- [ ] 2.1 `src/cli.ts` 加 `inspire` 命令(输出 prompt 到 stdout)

## 3. 测试

- [ ] 3.1 fixture(构造 jsonl 含重复 Bash command,验找重复 + prompt)

## 4. README / docs

- [ ] 4.1 README + docs 加 inspire 说明(扫会话找重复 + prompt,不 LLM,人审)
