## ADDED Requirements

### Requirement: 记录手动 skill 调用
系统 SHALL 在用户手动打 /skill-name 时,记录该 skill 的一次 manual 调用(取 `UserPromptExpansion` payload 的 `command_name`)。

#### Scenario: 用户打 /pdf-processing
- **WHEN** 用户打 `/pdf-processing` 触发 UserPromptExpansion hook(command_name="pdf-processing")
- **THEN** 系统记录一条 manual 调用(skill=pdf-processing, trigger=manual, timestamp=now)

### Requirement: 记录 AI skill 调用
系统 SHALL 在 AI 调 Skill 工具时,记录该 skill 的一次 ai 调用(取 `PreToolUse` payload 的 `tool_input.skill`,matcher=Skill)。

#### Scenario: AI 调 code-review skill
- **WHEN** AI 调 Skill 工具(tool_input.skill="code-review")触发 PreToolUse hook
- **THEN** 系统记录一条 ai 调用(skill=code-review, trigger=ai, timestamp=now)

### Requirement: 记录 prompt 提及 skill
系统 SHALL 在用户提交 prompt 时,若 prompt 文本含已装 skill 名,记录该 skill 的一次 mention(近似,取 `UserPromptSubmit` payload 的 `prompt` 匹配已装 skill 名)。

#### Scenario: prompt 提到 pdf-processing
- **WHEN** 用户提交 prompt "用 pdf-processing 处理" 触发 UserPromptSubmit hook,prompt 含已装 skill 名 "pdf-processing"
- **THEN** 系统记录一条 mention(skill=pdf-processing, trigger=mention, timestamp=now)

### Requirement: usage 报告(人看)
系统 SHALL 在跑 `left-skills usage` 时,输出每 skill 的调用次数(manual / ai / mention 分开)+ 最近调用时间 + 从未调用标记。

#### Scenario: 报告显示调用次数
- **WHEN** 跑 `left-skills usage`(pdf-processing 有 manual 5 + ai 7,gitlab-ci-generate 无记录)
- **THEN** 报告显示 pdf-processing(手动5 + AI7,最近2天前)+ gitlab-ci-generate ⚠ 从未调用

### Requirement: usage --json(AI 用)
系统 SHALL 在跑 `left-skills usage --json` 时,输出结构化 JSON,AI 能解析决策。

#### Scenario: --json 输出
- **WHEN** 跑 `left-skills usage --json`
- **THEN** 输出 `{skills:[{name, manual, ai, mention, last_used}], generated_at}`,AI 能据此建议改/删

### Requirement: 诚实标注触发方式
系统 SHALL 在报告中分开标 manual / ai / mention,不得混标为单一"调用次数"。

#### Scenario: 分开标不混
- **WHEN** skill 有 manual 5 + mention 3
- **THEN** 报告显示"手动5 + 提及3",不显示"调用8"

### Requirement: 从未调用标记
系统 SHALL 对无任何调用记录的已装 skill,标记 ⚠ 从未调用。

#### Scenario: 从未调用的 skill
- **WHEN** gitlab-ci-generate 已装但无调用记录
- **THEN** 报告标 ⚠ 从未调用(提示改/删)
