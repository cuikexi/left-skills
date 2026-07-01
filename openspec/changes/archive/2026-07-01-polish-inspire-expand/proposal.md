## Why

change 1(precision)done:hybrid 正则+LLM + OBSERVE + LLM 基础设施。但 inspire 仍只扫 Bash command(漏 Read/Edit/Write 等重复)+ 只找"重复"(漏"成功完成路径")+ prompt 不含 test 指令。change 2 expand 扩展信号源 + prompt 增强。

## What Changes

1. **all tools**:inspire 扫 all tool_use(不只 Bash),找重复 tool 序列(如 Read→Edit→Read 组合)
2. **成功路径**:找连续 tool_use 成功完成序列,提议 crystallize 为 skill(GenericAgent 路子,LLM 判断,人审)
3. **quality+test**:LLM 精提 prompt 加 test cases 指令(Happy/Edge/Error,人审不自动 test)

## Capabilities

### New Capabilities

- `inspire-expand`: inspire 扩展(all tools + 成功路径 + quality+test)

### Modified Capabilities

- `inspire-prompt`: 改(扩 all tools + 成功路径 + test 指令)
- `llm-analysis`: 改(prompt 加 test 指令)

## Impact

- 改 `src/inspire.ts`(scanSessions 扩 all tools + 序列 + 成功路径 + test 指令)
- 测试 + README
