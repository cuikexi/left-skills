## 1. all tools(不只 Bash)

- [ ] 1.1 `src/inspire.ts` scanSessions 扩:提取 all tool_use(name + input 关键字段),不只 Bash
- [ ] 1.2 找重复 tool 序列(连续 name 组合,如 Read→Edit→Read,≥3 次)

## 2. 成功路径

- [ ] 2.1 扫会话找连续 tool_use 完成序列(以 Stop / 下条 user 消息为界)
- [ ] 2.2 LLM 判断"该 crystallize 为 skill"(GenericAgent 路子,人审)

## 3. quality+test 指令

- [ ] 3.1 LLM 精提 prompt 加 test cases 指令(Happy/Edge/Error,人审不自动 test)

## 4. 测试

- [ ] 4.1 all tools(序列提取)
- [ ] 4.2 成功路径(LLM mock 判断)
- [ ] 4.3 test 指令(prompt 含 Happy/Edge/Error)

## 5. README / docs

- [ ] 5.1 README + docs 加 inspire expand 说明(all tools + 成功路径 + test)
