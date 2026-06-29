## Why

当前 README 不专业(用户反馈"目前的实现非常悲哀"):
- Install 让用户 `git clone + build + npm link` —— 开源工具不该让用户 clone 源码,该 `npm i -g`
- 没讲 hook 原理(三数据源怎么工作、数据流向)
- 没体现 `left-skills` 命名由来(**shift-left for skills**:在 skill 投入使用前就度量/检查,而不是等用户撞 bug)
- 不像专业开源工具门面(没 badge、没原理、开发视角)
- 且没 npm publish(`npm i -g` 不可用)

## What Changes

1. **npm publish**:`package.json` 完善(name / version / files / bin / author / license / repository / keywords)+ `npm login` + `npm publish`,让 `npm i -g left-skills` 可用(不 clone 源码)
2. **README 重写成专业开源水平**(参考 cline / aider / skillshare 等 CLI README):badge + 一句话 + Install(`npm i -g`)+ Usage + **命名由来** + **原理** + 示例 + License
3. **命名由来章节**:`left-skills` = shift-left for skills(投入使用前度量/检查,不等撞 bug)
4. **原理章节**:hook 工作流程图(三数据源 `UserPromptExpansion` / `PreToolUse` / `UserPromptSubmit` → `~/.left-skills/usage.json` → `left-skills usage` 报告),让用户看懂怎么工作

## Capabilities

### New Capabilities

- `documentation`: README 体现命名由来 + 原理 + 专业结构 + npm 安装(文档质量,非代码行为)

### Modified Capabilities

(无 —— 不改 `skill-usage-tracking` spec 行为,只改文档 + 发布方式)

## Impact

- `package.json` 完善(加 author / license / repository / keywords / files)+ `npm publish`
- `README.md` 重写(专业结构 + 命名由来 + 原理 + npm Install)
- 不改代码(`src/` 不变)
- 用户安装方式从 clone 源码改为 `npm i -g left-skills`
