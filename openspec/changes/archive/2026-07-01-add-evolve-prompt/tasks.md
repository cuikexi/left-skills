## 1. evolve 信号收集 + prompt 生成

- [x] 1.1 `src/evolve.ts`(收集该 skill 的 usage 信号 + lint 信号;据信号生成改进 prompt)
- [x] 1.2 prompt 格式(含信号摘要 + 改进指令,给 AI 的清晰指令)

## 2. evolve 命令

- [x] 2.1 `src/cli.ts` 加 `evolve <skill>` 命令(输出 prompt 到 stdout)

## 3. 测试

- [x] 3.1 fixture(没用 + 不合规 skill,验 prompt 含 usage + lint 信号 + 指令)

## 4. README / docs

- [x] 4.1 README + docs 加 evolve 说明(prompt 版,不 LLM,人审)
