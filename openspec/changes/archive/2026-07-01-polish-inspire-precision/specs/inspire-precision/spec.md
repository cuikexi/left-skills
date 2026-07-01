## ADDED Requirements

### Requirement: LLM 基础设施(只分析不 apply)
left-skills SHALL 调 Anthropic API(复用 `ANTHROPIC_API_KEY`),LLM 只做分析(提取 pattern / 判断 / 生成 prompt),**不自动 apply**(人审红线)。无 API key 时 fallback 纯正则(降级,不崩)。

#### Scenario: 有 API key
- **WHEN** ANTHROPIC_API_KEY 存在,跑 inspire
- **THEN** LLM 精提候选(判断该不该写 skill),输出 prompt(人审,不自动 apply)

#### Scenario: 无 API key(降级)
- **WHEN** ANTHROPIC_API_KEY 不存在,跑 inspire
- **THEN** fallback 纯正则粗筛(无 LLM 精提),输出候选 prompt(降级,不崩)

### Requirement: OBSERVE 加已装 skill 名单
inspire prompt SHALL 含已装 skill 名单(name + description),给 AI / 人审判断重复(不 left-skills 自动过滤)。

#### Scenario: 已装 skill 名单
- **WHEN** 已装 quick-pr skill,跑 inspire
- **THEN** prompt 含"已装: quick-pr(...)"名单(AI/人审判断不重复提议)

### Requirement: hybrid 相似匹配(正则粗筛 + LLM 精提)
inspire SHALL 用 hybrid:正则粗筛骨架(去引号/路径)→ 候选 → LLM 精提(判断该不该写 skill)→ prompt(人审)。

#### Scenario: 骨架重复 + LLM 精提
- **WHEN** `git commit -m "X"` 重复 5 次(精确不同,骨架同),跑 inspire
- **THEN** 正则粗筛找到骨架候选(`git commit -m *`)→ LLM 精提判断"该写 skill"→ 输出 prompt(人审)

### Requirement: 去噪(过滤简单命令)
inspire SHALL 过滤简单命令(echo / ls / cat 等骨架重复不提议,或骨架太短 <10 字符不提议)。

#### Scenario: echo 噪音过滤
- **WHEN** `echo "===" ` 重复 5 次,跑 inspire
- **THEN** 不提议(echo 简单命令,去噪过滤)
