## ADDED Requirements

### Requirement: README 体现命名由来
README SHALL 说明 `left-skills` 命名由来 = shift-left for skills(在 skill 投入使用前度量/检查,不等用户撞 bug)。

#### Scenario: 用户理解命名
- **WHEN** 新用户看 README
- **THEN** README 有"命名由来"说明,用户理解 left-skills = shift-left for skills(质量/度量左移)

### Requirement: README 有 How It Works 原理章节
README SHALL 有"How It Works"章节,含 hook 工作流程(三数据源 → 存储 → 报告)。

#### Scenario: 用户理解怎么工作
- **WHEN** 用户看 README How It Works 章节
- **THEN** 看到 hook 三数据源(UserPromptExpansion / PreToolUse / UserPromptSubmit)→ `~/.left-skills/usage.json` → `left-skills usage` 报告 的流程图

### Requirement: README Install 用 npm i -g(不 clone)
README Installation SHALL 用 `npm i -g left-skills`,不得要求用户 clone 源码。

#### Scenario: 用户 npm 安装
- **WHEN** 用户按 README 装
- **THEN** 跑 `npm i -g left-skills` 装好(不 clone 源码、不 build)

### Requirement: README Star History 放最后
README 的 Star History 图 SHALL 放在文档底部(License 前),不得放顶部。

#### Scenario: Star 图在底部
- **WHEN** 用户打开 README
- **THEN** Star History 图在文档底部(不在顶部);顶部是 logo + badge + 一句话 + 命名由来

### Requirement: README 有 Contributing 章节
README SHALL 有 Contributing 章节(开源贡献指引)。

#### Scenario: 贡献者看指引
- **WHEN** 有人想贡献
- **THEN** README 有 Contributing 章节,指引导如何贡献(clone 开发 / 提 PR 等)

### Requirement: README 专业结构
README SHALL 有专业开源工具结构:logo + badge + 一句话 + 命名由来 + How It Works + Installation + Quick Start + Highlights + Contributing + Star History(底)+ License。

#### Scenario: README 像开源工具门面
- **WHEN** 用户打开 README
- **THEN** 看到完整专业结构(参考 cline/aider/skillshare),像专业开源 CLI 工具
