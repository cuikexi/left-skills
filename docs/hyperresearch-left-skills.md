# 任务

用 **hyperresearch skill(V8 深度研究,full tier)** 对开源项目 left-skills 做技术与产品决策研究,产出一份带引用的研究报告。两个核心问题:

1. left-skills 该包含哪些功能模块(各"环")?各模块 in-scope / out-of-scope,与竞品边界。
2. 技术栈该选什么?Go / TypeScript+npm / Python,给带论据的推荐与否决理由。

# 项目背景(已拍板,作为约束,不要推翻)

- left-skills = AI skill 生命周期管理工具("shift-left for skills"),开源,目标吸引用(非自用/练手)。**冷启动是命门**:估算 技术仅占 30%、冷启动占 70%;参照 skillshare 半年 1831 commits 才 2312★。
- 定位"互补不竞争":
  - skillshare = skill/agent 分发、跨 50+ 工具同步、安全 audit
  - openspec = spec 驱动开发工作流
  - obra/superpowers = skill 方法论与体系
  - left-skills = skill **质量与生命周期**(lint + 生命周期)
- 五环(已定):`lint → rating → bug/issue → evolve → inspiration`
- **MVP 已拍板 = skill linter**:扫 `.claude/skills/` 和 `.codex/skills/` 的 SKILL.md,做最佳实践 lint(name-kebab / name-dir-match / description-present / description-quality / description-len / metadata-targets / argument-hint / token-budget / trigger-clarity),输出按 skill 分组的报告 + 0–100 聚合评分(喂 rating)。
- 红线:**不做**一致性检测(撞 skillshare 核心)、**不做**安全 audit(撞 skillshare audit);evolve **绝不自动改** skill 资产(AI 生成 diff,人审应用);**不造 issue tracker**,bug 采集借 GitHub Issues(hook 抓会话关键字 → 自动建 Issue 带 `skill:<name>` 标签)。
- 待定的生命周期动作(不要直接拍板加,要在研究里判断归属):`migrate`(迁移/重命名/拆分目录)、`clean`(删除冗余/久未使用)、`metrics`(使用频次采集)——初步判断归 evolve/rating,需研究验证。

# 研究要覆盖(深读一手资料,不要泛泛而谈)

## 功能集(问题 1)
- 实地调研竞品**实现行为**,不是看 README 标语:
  - skillshare 的 audit/sync 具体检查哪些项?left-skills 的 lint 怎么和它**不撞又互补**?
  - obra/superpowers 的 skill 体系、SKILL.md 结构、progressive disclosure 约定
  - agentskills.io 规范(SKILL.md frontmatter、`metadata.targets` 等)
  - Claude Code / Cursor / Codex 的 skill 格式与触发机制
- 判断每个生命周期动作(migrate / clean / metrics / inspiration)的归属:是新环还是既有环的子能力?给出**五环各自的 in/out scope 表**。
- "inspiration 环"到底该做什么?调研同类工具如何做"改进建议/最佳实践推荐"。
- 给出 left-skills 功能模块清单(MVP 哪些、v1 哪些、未来哪些),每条带"为什么留 / 为什么砍"的论据。

## 技术栈(问题 2)
- 调研同类**反复调用的本地 lint CLI** 选什么栈、怎么分发:eslint / golangci-lint / ruff / biome / pylint / clippy 等。
- 三候选真实对比(带数据/引用,不要空谈):
  - **Go 单二进制**:跨平台分发、冷启动摩擦、skillshare 同款生态
  - **TypeScript+npm**:openspec/superpowers 同款,node 依赖摩擦、npx 体验
  - **Python**:uv/rye/pyinstaller 能否逼近单二进制?目标用户机器 Python 普及度?版本管理摩擦?
- 关键维度:分发门槛(冷启动)、lint 工具性能、AI 集成需求(evolve 调 LLM=HTTP,语言无关)、SKILL.md/frontmatter 解析生态、跨平台、维护成本、目标用户画像(skill 作者跨语言)。
- 给**明确推荐** + 否决其他两个的理由 + 风险。

# 产出格式

- 带引用链接的研究报告。
- 必须包含:
  - (a) 功能模块清单表(MVP / v1 / 未来 × in/out × 理由)
  - (b) 技术栈对比表(维度 × Go / TS / Python)
  - (c) 明确技术栈推荐 + 否决论据
  - (d) 风险与冷启动缓解建议
  - (e) 对待定动作(migrate/clean/metrics)的归属判断(归哪个环 / 是否该做 / 何时做)
- 不要泛泛而谈,每个结论要有具体依据(竞品实际行为、工具实际分发方式、数据)。
