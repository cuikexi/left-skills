# left-skills 研究背景

本文档固化立项前的调研结论,供后续会话接上下文。研究时间:2026-06。

## 1. 项目定位的演进

定位经过四轮修正,从"迁移工具"收敛到"skill 生命周期管理":

1. **最初设想**:`codex2claude` —— 把 codex 技能迁移到 claude。研究后发现 skillshare 已做同步,且方向太窄。
2. **第一次扩大**:反向导入器(各 CLI 原生配置 → 统一 SKILL.md 源)。发现是空白(skillshare 只做正向),但进一步研究发现方向在过时(见 §4)。
3. **第二次修正**:不做迁移,转向上层——"让 skill 更好用"的 skill 生命周期管理。
4. **最终定位**:left-skills,五环(lint → rating → bug/issue → evolve → inspiration),MVP 是 skill linter。

## 2. 生态画像(三个主流玩家)

| 项目 | 定位 | 机制 | 规模 |
|---|---|---|---|
| [skillshare](https://github.com/runkids/skillshare) | 跨 CLI skills 同步/分发 | 单一源 `~/.config/skillshare/skills/` + symlink 分发到 60+ CLI | ★2.3k, Go, v0.20.20, 1831 commits |
| [OpenSpec](https://github.com/Fission-AI/OpenSpec) | spec-driven 开发工作流 | CLI `openspec init` 为每个工具按目录约定生成 skills+commands | ★56k, TS(npm) |
| [obra/superpowers](https://github.com/obra/superpowers) | 方法论 skills(TDD/调试/协作) | 每个 CLI 走各自 plugin 协议;中文版 `superpowers-zh` 用 npx 一键检测 + 复制 SKILL.md | 上游 6 款,中文版 18 款 |

## 3. 跨 CLI 技能支持的本质

**核心结论:SKILL.md(Claude Code 格式)已成事实标准,绝大多数 CLI 接受 `<dotdir>/skills/<name>/SKILL.md`。** 多 CLI 支持 = 维护一张 tool→目录映射表 + 把同一份 SKILL.md 分发。分发时机三种:
- 一次性生成(OpenSpec `init`/`update`)
- 一次性安装检测(superpowers-zh `npx`)
- 持续 symlink 同步(skillshare `sync`)

**skills 内容本身不需要翻译**。差异只在"入口":slash command 文件格式(claude `.md`/gemini `.toml`/copilot `.prompt.md`)+ bootstrap 指令(CLAUDE.md/AGENTS.md/GEMINI.md/.cursorrules)。只有 gemini/codex 的 TOML 需要真格式转换(MD→TOML),即 extras extension transforms / command adapter 干的事。

## 4. 关键趋势:生态在收敛(颠覆性发现)

OpenSpec `supported-tools.md` 和 skillshare issues 透露:整个生态在往 SKILL.md + `~/.agents/skills/` 共享目录收敛。

证据:
- **codex prompts 已 deprecated in favor of skills**(skillshare #146 body 原文)
- **claude commands 已 merged into skills**(skillshare #146 body 原文)
- firecrawl/googleworkspace/superpowers 都往 `~/.agents/skills/` 写(skillshare #135)
- skillshare #135 "adopt/claim workflow for CLI-bundled skills" 在做"收编同构 skills"

**含义:配置层迁移(codex 原生 prompts/AGENTS.md → claude)这个方向在过时**——原生配置在退场,大家都直接写 skills。所以 left-skills 不做迁移,做 skill 质量管理(不会过时)。

## 5. 空白验证:skill linter 没人做

MVP(skill linter)的空白依据:
- **skillshare `audit`**:只做安全(prompt-injection)+ analyzability,**不做最佳实践/质量 lint**
- **superpowers `writing-skills`**:是方法论 skill(教你怎么写),**不是 linter(自动查)**
- **OpenSpec**:生成 skills,**不 lint 已有 skills**
- GitHub 精确搜 "cursor rules to claude skills converter" 等 → 0 结果
- **GitLab 搜 skillloop/skilllint/left-skills → 0 重名;skill lint 广搜 → 无竞品**(只有 0★ 的 `bucoleary/skills` skills 集合、`markdownlint-skill` 是 markdownlint 的 skill 版,都无关)

**待补**:GitHub + npm 重名查询(GitLab 不是主战场,信号弱)。定 MVP 前必须查。

## 6. skillshare roadmap 分析(会不会被吞?)

排查 skillshare 1831 commits / 12 open issues,确认它**不做 left-skills 的地盘**:
- **#135 adopt/claim**:只收编**同构 skills**(`~/.agents/skills/` SKILL.md),不反向解析异构配置
- **#146 command/prompt presets**:**正向**同步(源→各 CLI commands),不是反向导入
- **#136 convert extras to TOML**:正向 MD→TOML
- 没有任何 issue 提"skill 最佳实践 lint / 质量评分 / 生命周期管理"

结论:skillshare 管分发和安全,不管质量/生命周期。left-skills 和它互补共存。

## 7. 五环定位由来

用户提出的四个方向 + 修正:
1. **lint**(用户原方向1):拆成"一致性检测"(砍,和 skillshare 撞)和"最佳实践 lint"(留,空白)。**MVP**
2. **bug 采集**(用户原方向2):本质是 per-skill issue 管理(用户自己洞察)。**别自己造 issue tracker**(深坑),借 GitHub Issues——hook 抓会话关键字 → 自动建 Issue 带 skill 标签
3. **evolve**(用户原方向3,从 "auto evolve" 改名):去掉 auto 化解风险(hallucinate/injection/破坏稳定)。形态 = AI 据 issue+lint 生成 diff,人 review 应用 = skill 的 PR 工作流
4. **inspiration**(用户原方向4):扫会话历史(~/.claude/projects/*.jsonl)找重复模式,建议抽 skill。传播点最强
5. **rating**(用户加):分静态(基于 lint 聚合)和运行时(用户星)。MVP 不单做,静态分让 lint 顺手输出,运行时星作为 bug 采集的轻量分支

数据流:inspiration 发现 → 写 skill → lint(→rating 静态)→ 用 → bug/issue(→rating 运行时)→ evolve 改 → 回 lint。**lint 是基础**(rating/evolve 都依赖它),所以 MVP 是 lint。

## 8. 命名:left-skills

- "left" = shift-left(质量前移),和 lint MVP 契合
- 缺点:不直白(需解释)、易负面联想(leftover/left behind)、搜索一般
- 用户拍板用 `left-skills`,命名权归用户
- GitLab 查:skillloop/skilllint/left-skills 0 重名,skillshift 2 个 0★ 无关项
- **待查 GitHub + npm 重名**(定名前必验)

## 9. 待办(下一步)

- [ ] 查 GitHub + npm 的 `left-skills` / `skillloop` / `skilllint` 重名(定名)
- [ ] 选技术栈:Go(skillshare 同款,单二进制)vs TS(openspec/superpowers-zh 同款,npm)
- [ ] 定义 MVP lint 规则集(具体哪几条规则、严重度分级)
- [ ] 写 MVP 测试:拿几个真实 SKILL.md 当 fixture(可用 skillshare/superpowers 仓库里的)
- [ ] 立项提案(可选 OpenSpec 流程,但本仓库不强制;小工具可能直接写 README+测试更轻)
