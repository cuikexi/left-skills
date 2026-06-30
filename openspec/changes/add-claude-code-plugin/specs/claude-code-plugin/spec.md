## ADDED Requirements

### Requirement: plugin manifest
left-skills SHALL 有 `.claude-plugin/plugin.json` manifest(name / description / version / author / repository / license / keywords),符合 Claude Code plugin 规范。

#### Scenario: manifest 存在且合规
- **WHEN** 检查 `.claude-plugin/plugin.json`
- **THEN** 有 name=left-skills / description / version / author / repository / license / keywords,符合 plugin 规范

### Requirement: hooks.json 配三 hook
left-skills plugin SHALL 有 `hooks/hooks.json`,配三 hook(UserPromptExpansion / PreToolUse / UserPromptSubmit),command `left-skills hook`。

#### Scenario: 三 hook 配置
- **WHEN** 检查 `hooks/hooks.json`
- **THEN** 有 UserPromptExpansion(matcher `.*`)+ PreToolUse(matcher `Skill`)+ UserPromptSubmit,command 均为 `left-skills hook <event>`

### Requirement: /plugin install 自动配 hook
`/plugin install left-skills` SHALL 自动配 hook(用户不手写 settings.json),装后打 /skill + AI 调 skill 自动记录。

#### Scenario: plugin install 后自动记录
- **WHEN** 用户 `/plugin install left-skills`(且已 npm i-g left-skills)+ 打 /skill 或 AI 调 skill
- **THEN** 自动记录到 `~/.left-skills/usage.json`(不手写 settings.json)

### Requirement: README Install 加 /plugin install
README Installation SHALL 有 `/plugin install` 方式(plugin 优先,自动配 hook),npm i-g 作备选 binary。

#### Scenario: README 教 plugin install
- **WHEN** 用户看 README Install
- **THEN** 有 `/plugin marketplace add cuikexi/left-skills` + `/plugin install left-skills` 步骤(优先),npm i-g 作 binary 备选
