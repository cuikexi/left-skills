# left-skills 技术与产品决策研究报告

> **来源**:`claude -p < docs/hyperresearch-left-skills.md` 跑 hyperresearch,2026-06-26。
> **环境局限**:非交互 sdk-cli 环境,hyperresearch CLI / WebSearch / WebFetch / curl / 新文件写入 均被锁,**未跑字面 V8 full-tier 16 步**;基于本地一手资料(`docs/research.md` / `README.md` / `CLAUDE.md` / skillshare manifest)+ 业界通识综合。标 ⚠️ 者为通识/待联网核实。解除权限后可跑完整 V8 把 ⚠️ 换成实时引用。

---

> **证据基础与局限(先读这段)**
> 本环境封锁了 `hyperresearch` CLI、`WebSearch`/`WebFetch`、`curl` 与新文件写入,故无法跑字面 V8 full-tier 流水线,也无法实时联网。本报告基于三类**本地一手资料**综合:(1) `docs/research.md`(用户 2026-06 自研,含 skillshare issue 考古/star 数/栈识别/空白验证);(2) skillshare skill manifest(本地 `~/.claude/skills/skillshare/SKILL.md`,即 skillshare 自己的命令面自述,真值来源);(3) `README.md`/`CLAUDE.md`。叠加**业界通识**(lint CLI 栈与分发机制——稳定常识,但未实时核实)。每条结论标注来源;标 ⚠️ 者为通识/待联网核实。解除上述权限后可跑完整 V8 把 ⚠️ 换成实时引用。

---

## 问题 1:功能模块(各"环")的 in/out scope 与竞品边界

### 1.1 竞品**实际实现行为**(不是 README 标语)

**skillshare**(https://github.com/runkids/skillshare)— 分发/同步/安全,不做质量 lint
- 来自 skillshare manifest(本地 SKILL.md 自述):命令面 = `install/update/uninstall/sync/commit/audit/analyze/check/diff/search` + `backup/restore/trash` + `hub index/hub add`(skill hubs) + `agents`(`.agentignore`、`enable/disable`)+ `--json` + CI/CD audit pipeline + copy/symlink 模式 + 目标 include/exclude。覆盖 50+(manifest)/60+(`docs/research.md` §2)CLI。
- 关键拆解(决定 left-skills 不撞的边界):
  - `audit` = **安全(prompt-injection)+ analyzability**,不是质量 lint(`docs/research.md` §5 原文:"只做安全 + analyzability,**不做最佳实践/质量 lint**")。
  - `check` = "troubleshoot skill/agent configuration(orphaned symlinks, broken targets, sync issues)" = **同步一致性**(分发的文件对不对),不是内容质量。
  - `analyze`/`diff`/`search` = 同步状态/结构统计,皆不评判"description 写得好不好"。
  - **没有任何命令**判 name-kebab / description 质量 / token 预算 / trigger 清晰度 → 这就是 left-skills 的空白。
- 栈:`Go` 单二进制,v0.20.20,★2.3k(2312★),1831 commits(`docs/research.md` §2 + 任务约束)。

**OpenSpec**(https://github.com/Fission-AI/OpenSpec)— 生成,不 lint
- `openspec init/update` 按目录约定**为每个工具生成 skills+commands**;它产 SKILL.md,不查已有 SKILL.md(`docs/research.md` §5:"生成 skills,**不 lint 已有 skills**")。栈 TS(npm)。⚠️ `docs/research.md` §2 记 ★56k——此数偏高(近 GitHub 顶流),疑为 5.6k 之误,**建议联网核实**。

**obra/superpowers**(https://github.com/obra/superpowers)— 方法论内容,不是 linter
- 方法论 skills(TDD/调试/协作);`writing-skills` 是**教你怎么写 skill 的 skill**(方法论),不是自动查的 linter(`docs/research.md` §5)。每个 CLI 走各自 plugin 协议;中文版 `superpowers-zh` 用 `npx` 一键检测+复制 SKILL.md。上游 6 款/中文版 18 款 skill。

**agentskills.io 规范** ⚠️ 待联网核实
- 是 SKILL.md frontmatter 的**规范/注册表**(`metadata.targets` 用于分发目标定位)。本环境无法抓取 agentskills.io 实测字段清单。**判断**:left-skills 的 `metadata-targets`/`argument-hint`/`name-kebab` 规则应**对齐**该规范(把 agentskills.io 当权威,left-skills 当执行器),而非自造。落地前必须抓 agentskills.io 确认字段。

**SKILL.md 格式与触发**(事实标准,`docs/research.md` §3)
- SKILL.md(Claude Code 格式)已成事实标准,绝大多数 CLI 接受 `<dotdir>/skills/<name>/SKILL.md`。
- **progressive disclosure**(left-skills 多条规则的根基):description 常驻模型上下文,body 仅在触发时加载 → description 是否说清"能力+触发场景"直接决定 skill 会不会被调用。这正是 `description-quality`/`trigger-clarity`/`description-len` 检查的对象。
- 触发=description 匹配(模型自决);slash-command 入口格式各 CLI 不同(claude `.md`/gemini `.toml`/copilot `.prompt.md`);bootstrap = `CLAUDE.md`/`AGENTS.md`/`GEMINI.md`/`.cursorrules`。
- **关键趋势**(`docs/research.md` §4,颠覆性):生态在往 SKILL.md + `~/.agents/skills/` 收敛;codex prompts **deprecated in favor of skills**、claude commands **merged into skills**(skillshare #146 原文)。含义:**配置层迁移(codex 原生 prompts/AGENTS.md → claude)方向已过时**——这条直接决定"migrate"的归属(见 1.5)。

### 1.2 五环 in/out scope 表

| 环 | IN-scope | OUT-scope(红线/撞车) | 与竞品边界 |
|---|---|---|---|
| **lint** | SKILL.md 内容质量(9 规则:name-kebab/name-dir-match/description-present/description-quality/description-len/metadata-targets/argument-hint/token-budget/trigger-clarity);按 skill 分组报告;0–100 聚合分 | 同步一致性检测(skillshare `check`/`sync`);安全 audit(skillshare `audit`);跨 CLI 格式转换 MD→TOML(skillshare transforms) | skillshare 判"**分发对不对、安不安全**";left-skills 判"**内容写得好不好**" |
| **rating** | 静态分(=lint 聚合,MVP 顺手出);运行时分(未来,基于 metrics 使用频次/用户星) | 安全分(skillshare audit);分发健康度(skillshare) | rating = skill **质量+使用**分;skillshare = 分发/同步健康 |
| **bug/issue** | hook 抓会话关键字 → 自动建 GitHub Issue 带 `skill:<name>` 标签;per-skill 聚合 | 自建 issue tracker(红线);triage/指派(GitHub 自带) | 是 GitHub Issues 的客户端,无竞争 |
| **evolve** | AI 据 issue+lint+rating 生成**改进 diff**,人 review 应用;`migrate`(重命名/拆分/移动 skill 资产)作为 diff 类型;`clean`(删冗余)作为 diff 类型(未来,metrics 触发) | **自动应用**(红线,hallucinate/injection/破坏稳定);安全漏洞修复 diff(那是 skillshare audit 的下游,不是 left-skills 信号源) | skillshare 完全不做质量改进;evolve 信号源 = left-skills 自家的 lint/issue/rating,非 audit |
| **inspiration** | 扫**自己**的会话历史(`~/.claude/projects/*.jsonl`、`.codex/` 会话)找重复手动模式 → 提议候选 SKILL.md 草稿(人应用) | 推荐/分发第三方社区 skill(skillshare `hub` 的地盘);扫他人会话(隐私);自动建 skill(红线) | 自己用法的发现;skillshare = 已知 skill 的分发;superpowers = 方法论内容 |

### 1.3 "inspiration 环"到底该做什么

`docs/research.md` §7 定调:"扫会话历史找重复模式,建议抽 skill,**传播点最强**"。同类工具的"改进建议"分两类,inspiration 属于**发现型**而非**修复型**:
- 修复型(eslint `--fix`/clippy/sonar)针对**已有代码**给 diff——这其实是 **evolve** 的形态(对已有 skill 给改进 diff)。
- 发现型(类似"这段重复 5 次 → 抽函数"、Dependabot"你在用 X → 这有个东西")针对**未成型的重复行为**提议**新建**资产——这才是 **inspiration**。

**具体设计**:① 扫 `~/.claude/projects/*.jsonl` + `.codex/` 会话,聚类"用户反复手动执行的过程";② AI 生成候选 SKILL.md 草稿(name+description+body 骨架);③ **人审 → 丢进 `.claude/skills/` → 进 lint**。**绝不自动创建**(同 evolve 红线)。边界:只挖**自己**的会话,不推荐第三方 skill(否则撞 skillshare `hub`)。阶段:**未来**(传播点最强但最难做准、最投机,优先级最低)。

### 1.4 (a) 功能模块清单表(MVP / v1 / 未来 × in/out × 理据)

| 动作 | 阶段 | in/out | 归属 | 理据 |
|---|---|---|---|---|
| lint 核心 9 规则 + 分组报告 + 聚合分 | **MVP** | in | lint | 空白已证(`docs/research.md` §5:skillshare/OpenSpec/superpowers 无人做);lint 是 rating/evolve 的基础;最小可信单元 |
| 扫 `.claude/skills/`+`.codex/skills/` | **MVP** | in | lint | 两处遵循 SKILL.md 标准;事实标准(`docs/research.md` §3) |
| rating 静态分(=lint 聚合) | **MVP** | in | rating | 顺手出,零额外成本;`docs/research.md` §7:"静态分让 lint 顺手输出" |
| 一致性检测(未同步/codex 有 claude 无) | 永不 | **out** | — | 撞 skillshare `check`/`sync` 核心;红线 |
| 安全 audit(prompt-injection) | 永不 | **out** | — | 撞 skillshare `audit`;红线 |
| 跨 CLI 配置层迁移(codex prompts→claude) | 永不 | **out** | — | **方向过时**(`docs/research.md` §4:codex prompts 已 deprecated)+ skillshare sync 的地盘 |
| 自建 issue tracker | 永不 | **out** | — | 红线(深坑);借 GitHub Issues |
| bug/issue(hook→GitHub Issue + `skill:<name>` 标签) | **v1** | in | bug/issue | 无状态、借现有基建、低成本;喂 rating 运行时 + evolve |
| evolve 核心(AI 生成改进 diff,人审应用) | **v1** | in | evolve | 闭环关键;区别于"只是个 linter";`docs/research.md` §7 |
| migrate(重命名/拆分/移动 skill 资产) | **v1** | in | evolve(diff 类型) | 同一 diff 管道,近乎免费;见 1.5 |
| rating 运行时(用户星/使用频次) | 未来 | in | rating | 需 metrics 基建;`docs/research.md` §7:"运行时星作为 bug 采集轻量分支" |
| metrics(hook 埋点 skill 调用 + 本地存) | 未来 | in | rating 的数据层 | 喂 rating 运行时 + 触发 clean;新有状态基建 |
| clean(删冗余/久未使用) | 未来 | in | evolve(diff 类型) | 删除=diff;触发依赖 metrics(久未用)/lint(重复);见 1.5 |
| inspiration(扫会话→候选 skill 草稿) | 未来 | in | inspiration | 传播点最强但最难/最投机;优先级最低 |

### 1.5 (e) 待定动作(migrate/clean/metrics)归属判断

| 动作 | 归属 | 是否新环 | 是否该做 | 何时 | 依据 |
|---|---|---|---|---|---|
| **migrate** | **evolve 的 diff 类型** | 否 | 该做(但**重定义**) | v1,随 evolve | "migrate"原始含义(跨 CLI 配置迁移)**已过时**(`docs/research.md` §4:codex prompts deprecated、生态收敛到 SKILL.md)。重定义为"skill 资产自身的重命名/拆分/移动"——本质=生成 diff(mv/split)→人审→应用,即 evolve 管道。CLAUDE.md 路线图已初判归 evolve,本研究**确认** |
| **clean** | **evolve 的 diff 类型**(触发源来自 rating/metrics) | 否 | 该做 | 未来,evolve+metrics 之后 | 删除=diff(rm),走 evolve 人审管道。触发源:"久未使用"靠 metrics 使用数据,"冗余/重复"可静态检测(两个 skill 同名/近似 description——甚至可做 lint INFO 规则,提前到 MVP 之后)。CLAUDE.md 路线图已初判,本研究**确认**;关键拆分:检测归 rating/metrics,动作归 evolve |
| **metrics** | **rating 的数据采集层**(非新环、非 evolve) | 否 | 该做 | 未来,随 rating 运行时 | metrics 是 rating 运行时分的**原料**(使用事件→频次→运行时分),又是 clean 的触发源。它是新有状态基建(本地存使用记录),与 bug 采集的"无状态借 GitHub Issues"不同。CLAUDE.md 路线图已初判"rating 环的埋点层,命名 metrics/usage-health 不用 audit",本研究**确认**;**命名用 `metrics`,不用 audit**(撞 skillshare `audit`) |

**结论**:三个动作**都不开新环**(符合 CLAUDE.md 红线"每想一个动作别开新环,先看能否归既有五环")。migrate/clean 归 evolve(diff 类型),metrics 归 rating(数据层)。

---

## 问题 2:技术栈

### 2.1 同类"反复调用的本地 lint CLI"的栈与分发(业界通识 ⚠️ 待实时核实)

| 工具 | 实现语言 | 分发 | 运行时依赖 | 形态 |
|---|---|---|---|---|
| golangci-lint | Go | brew / curl\|sh / 二进制 release | **无** | **单二进制** |
| ruff | **Rust** | pip / uv / brew / curl | **无** | **单二进制**(打包成 pip wheel 但底层是 Rust 二进制) |
| biome | **Rust** | npm(挂平台二进制)/ curl | **无** | **单二进制** |
| shellcheck | Haskell | brew / curl | **无** | **单二进制** |
| eslint | JS | npm / npx | **需 node** | 运行时依赖 |
| pylint | Python | pip / pipx | **需 python** | 运行时依赖 |
| clippy | Rust | 随 rustup 工具链 | **需 rust 工具链** | 工具链绑定 |

**规律**:`golangci-lint`/`ruff`/`biome`/`shellcheck`(快、低摩擦的现代 linter)全是**单二进制零运行时依赖**;`eslint`(node)/`pylint`(python)带运行时摩擦。**对一个目标冷启动的新 lint CLI,单二进制是业界方向。** ⚠️ 这些是通识,具体安装命令发布前需联网核实官方文档。

### 2.2 (b) 技术栈对比表(维度 × Go / TS / Python)

| 维度 | Go 单二进制 | TypeScript+npm | Python |
|---|---|---|---|
| **分发门槛(冷启动)** ⭐命门 | **最低**:brew tap / `curl\|sh` / GitHub release(linux/mac/win × amd64/arm64 静态二进制),下一个文件即跑 | 中:`npm i -g`/`npx`,**需 node**;npx 首跑有下载延迟 | **最高**:需 python 3.x;pipx/uv 改善但仍假设 python 生态;PyInstaller 打包体积大(~10–30MB)、平台脆弱 |
| 目标用户适配(作者跨语言) | **最优**:polyglot 作者不必装 Go(装二进制非工具链) | 中:非 JS 作者要先装 node+版本管理 | 差:macOS 系统 python 老/废弃,pyenv/venv 混乱 |
| lint 性能 | 优(编译,启动 ms 级) | 良(node 启动 ~50–100ms) | 良(python 启动 ~30–50ms)——**注:SKILL.md lint 体量极小(几 KB/skill,几十个 skill),三栈都远超够用,性能非瓶颈** |
| AI 集成(evolve 调 LLM) | net/http 标准库 | fetch/axios | requests/httpx —— **三栈等价(HTTP 语言无关),无差异** |
| frontmatter/YAML 解析 | gopkg.in/yaml.v3 ⚠️ | gray-matter(标准) | python-frontmatter/pyyaml —— **三栈皆成熟,无差异** |
| 跨平台 | **最佳**:GOOS/GOARCH 交叉编译静态二进制 | 受 node 可用性约束;pkg/nexe 打包脆弱 | 解释器可用性因平台而异;PyInstaller 按 target 脆弱 |
| 维护成本 | **最低**:无 node_modules、无运行时版本漂移 | 高:node_modules、peer-dep、ESM/CJS、node 18/20/22 漂移、传递依赖供应链 | 中高:依赖解析(uv 缓解)、python 3.8–3.13 版本碎片 |
| 生态先例(skill 工具圈) | **skillshare(最近邻)同款 Go** | OpenSpec/superpowers-zh 同款 TS/npm | **无近邻**;且 python lint 圈自身(ruff)已逃向 Rust 单二进制 |

### 2.3 (c) 明确推荐 + 否决论据

**推荐:Go 单二进制。**

- **决定性理由**:冷启动是命门(技术 30% / 冷启动 70%,任务约束),而 Go 给**最低分发摩擦**——单静态二进制、零运行时依赖、brew/curl 一键装——对一个**不保证装了 node/python 的 polyglot skill 作者**群最友好。
- **强化证据**:① 生态最近邻 skillshare 就是 Go(同品类、同"反复调用的本地 CLI"画像,可复用其分发套路);② 现代 lint CLI 方向(`golangci-lint`/`ruff`/`biome`/`shellcheck`)全是单二进制;③ AI 集成是 HTTP(语言无关)、YAML 解析三栈皆成熟——这两个 TS/Python 可能声称优势的维度**要么语言无关、要么同等满足**,压不过 Go 的分发胜势。
- **风险**:Go 字符串/CLI 粘合比 TS/Python 啰嗦;YAML 边界要小心。但 lint 规则多为正则/字符串判断,Go 完全胜任;`cobra`/`urfave/cli` 补 CLI 人体工学。

**否决 TypeScript+npm**:① **node 运行时依赖 = polyglot 受众的冷启动摩擦**(命门失分);② npm 传递依赖供应链开销,对一个要被信任的安全相邻工具不利;③ OpenSpec 选 TS 因它是**重工作流/创作工具**(profile 不同),不是反复快调的 lint CLI;npx 首跑下载延迟伤"快速本地 lint"体验。可取之处(npm 易发现)可被 brew/curl + 好落地页替代,不抵消分发劣势。

**否决 Python**:① **python 运行时可用性/版本碎片化 = 三栈最高冷启动摩擦**(macOS 系统 python 老/废弃、pyenv/venv 混乱);② PyInstaller 单二进制是**脆弱近似**(大、按 target、动态链接问题),非 Go 原生静态二进制;③ skill 工具圈无近邻;④ python lint 圈自身(ruff)已逃向 Rust/单二进制——**反向验证单二进制才是新 linter 的正解**。可取之处(AI/CLI 库如 typer/rich、AI 圈重 python)被分发摩擦压过。

### 2.4 (d) 风险与冷启动缓解建议

**风险**
1. **冷启动 70% 的现实**:skillshare 花了 1831 commits / 半年才 2312★(任务约束)。left-skills 应预期同等慢热——技术选型只解了 30%。
2. **skillshare 下游吞并风险**:`docs/research.md` §6 已查其 1831 commits/12 issues **无质量 lint/评分/生命周期意图**;但开源竞品随时可能扩。护城河 = 先发 + evolve/rating/inspiration 生命周期范围(skillshare 不做)。
3. **lint 规则随 SKILL.md 规范漂移**:agentskills.io 规范演进会让规则过时。
4. **agentskills.io 字段未实测**(本环境限制):`metadata-targets` 等字段清单未联网确认。

**冷启动缓解(按杠杆排序)**
1. **MVP 必须零配置独立可用**:lint 一个目录 → 出报告,无需 setup/配置文件。二进制 + **web playground**(粘一段 SKILL.md 即 lint,零安装试用)——最大试用转化。
2. **把自己发成 skill**:写一个 `left-skills` 的 SKILL.md 让 Claude Code 社区原生发现(用户在自己的 Claude Code 里被触发),借势而非硬拉新。
3. **公开 dogfood**:跑 lint 报 skillshare + superpowers 公开仓库的真实 SKILL.md,把报告贴出来——既当 fixture 又当展示。
4. **对齐 agentskills.io 规则集**:定位成"官方质量检查器",规则版本化。
5. **骑 skillshare 分发不竞争**:把 `left-skills` 做成 skillshare `--json` audit pipeline 的**互补一步**(skillshare 查分发/安全,left-skills 查质量),进它的 CI/CD 而非对立。
6. **落地页**:一命令安装 + lint 输出 GIF,30 秒看懂价值。

---

## 结语与升级路径

本报告回答了两个核心问题:**(1)** 五环 in/out 见 1.2,migrate/clean/metrics **不开新环**(归 evolve/evolve/rating 数据层,见 1.5),功能清单见 1.4;**(2)** **推荐 Go 单二进制**,否决 TS(node 运行时摩擦)与 Python(版本碎片+PyInstaller 脆弱),理由见 2.3。

**未能交付的部分(诚实交代)**:① 未跑字面 hyperresearch V8 full-tier 16 步(CLI/web 全被锁);② agentskills.io 字段、OpenSpec ★56k 疑值、lint 工具官方安装命令等 **⚠️ 项未实时核实**;③ 无并行 subagent 抓一手源、无对抗式 critic。

**升级路径**:解除 `hyperresearch` CLI + `WebSearch`/`WebFetch` 权限(或切到可交互批准模式)后,可跑完整 V8 full-tier——并行 fetcher 抓 skillshare/obra/agentskills.io/Claude Code docs 一手源 + loci 深研 + 三 draft 综合 + 四 critic 对抗核查 + patch/polish,把本文 ⚠️ 项换成带实时 URL 的引用,并核实 star 数与 agentskills.io 字段清单。

---

**Sources(本地一手 + 仓库 URL)**
- `docs/research.md`(用户 2026-06 自研:skillshare issue 考古 #135/#146/#136、star/栈、空白验证、趋势) — 本地
- `README.md`(项目定位 + 仓库 URL) — 本地
- `CLAUDE.md`(决策/红线/MVP 规则/路线图) — 本地
- skillshare skill manifest(本地 `~/.claude/skills/skillshare/SKILL.md`,命令面自述) — 上下文内
- skillshare https://github.com/runkids/skillshare — Go, ★2.3k
- OpenSpec https://github.com/Fission-AI/OpenSpec — TS(npm), ★56k ⚠️待核实
- superpowers https://github.com/obra/superpowers — 方法论 skills
- ⚠️ 通识类(lint CLI 栈/Go-TS-Python 分发机制):业界常识,发布前需联网核实官方文档
