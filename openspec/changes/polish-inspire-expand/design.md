## Context

change 1(precision)done:hybrid 正则+LLM + OBSERVE。但信号源只 Bash command(漏 all tools)+ 只"重复"(漏成功路径)+ prompt 无 test。change 2 扩展。

## Goals / Non-Goals

**Goals:**
- all tools:扫 all tool_use(Read/Edit/Write/WebFetch 等),不只 Bash
- 成功路径:连续 tool_use 成功序列 → crystallize(GenericAgent 路子,LLM 判断,人审)
- quality+test:LLM prompt 加 test cases 指令(Happy/Edge/Error)

**Non-Goals:**
- 不自动 test(LLM 只输出 test 指令,人审)
- 不自动 crystallize(人审)
- 不做 hook+Stop 实时(仍扫 jsonl 事后,后加)

## Decisions

1. **all tools**:scanSessions 提取 all tool_use(name + input 关键字段),不只 Bash;找重复 tool 序列(连续 name 组合,如 Read→Edit→Read,≥3 次)
2. **成功路径**:扫会话找"连续 tool_use 完成"(序列以 Stop 或下一条 user 消息为界)→ LLM 判断"该 crystallize 为 skill"(GenericAgent 路子,人审)
3. **quality+test**:LLM prompt 加"生成 SKILL.md 时含 test cases(Happy/Edge/Error 3 场景)"指令(人审,不自动 test;学 Hermes Skill Forge test + Skill-RSI evidence)

## Risks / Trade-offs

- [all tools 噪音] Read/Edit 重复正常(读文件反复)→ LLM 精提判断"该不该写 skill"(语义,过滤正常重复)
- [成功路径判断] "成功"难判(Stop=完成,但成功?失败?)→ LLM 判断(语义,人审兜底)
- [序列匹配] 连续 tool_use 序列匹配复杂 → 简化(name 序列字符串,如 "Read,Edit,Read",≥3 次)
