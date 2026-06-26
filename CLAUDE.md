# left-skills · 协作指令(Claude 必读)

> 新会话先读本文件,再按需读 docs/research.md(研究依据)和 README.md(对外定位)。

## 一句话

left-skills = skill 生命周期管理工具(shift-left for skills)。五环:lint → rating → bug/issue → evolve → inspiration。MVP 是 skill linter。

## 当前阶段

立项完成,准备 MVP(skill linter)。研究依据见 docs/research.md。

## 已拍板决策(别重新讨论,除非用户主动重开)

- **名字 left-skills**:用户明知缺点(不直白/易联想 leftover/搜索一般)仍拍板。**不要再劝换名**。
- **MVP = skill linter**:做最佳实践 lint。**不做**一致性检测(=skillshare 核心,撞)、**不做**安全 audit(skillshare audit 已做,撞)。
- **evolve 非 auto**:AI 据 issue+lint 生成改进 diff,人 review 应用。**绝不自动改 skill**(防 hallucinate / prompt-injection / 破坏稳定)。
- **bug 采集借 GitHub Issues**:不自己造 issue tracker(深坑)。hook 抓会话关键字 → 自动建 Issue 带 `skill:<name>` 标签。
- **定位互补不竞争**:skillshare=分发、openspec=spec 工作流、superpowers=方法论;left-skills=skill 质量/生命周期。
- **动机**:做开源吸用户(非自用/练手)。

## 设计红线

1. 不和 skillshare 撞(同步+安全 audit 是它的;left-skills 做质量 lint+生命周期)
2. evolve 必须人审批,不自动改 prompt 资产
3. 不造 issue tracker,借 GitHub Issues
4. 简洁优先:小工具别上重流程(OpenSpec 全套非必需,本仓库不强制套)

## 用户协作偏好

- 懂技术(Go/TS/CLI/skill 体系熟),有产品判断力(会自己洞察,如"bug 采集=issue 管理"、"auto evolve→evolve")
- 会主动 push back(嫌立项太快、方向问题)——要**有判断的协作,不是听话执行**。该 push back 就 push back,别一路顺着冲
- 中文交流,代码注释中文
- 做开源吸用户,但别让 ta 低估冷启动:技术 30% / 冷启动 70%;skillshare 半年 1831 commits 才 2312★

## 技术栈(已定:Go 单二进制)

**Go 单二进制**(2026-06-26 据 hyperresearch 报告 `docs/hyperresearch-report.md` 定):冷启动是命门(技术 30%/冷启动 70%),Go 给最低分发摩擦(单静态二进制、零运行时依赖、brew/curl 一键装),对不保证装了 node/python 的 polyglot skill 作者最友好;skillshare 同款 + 现代 lint CLI(golangci-lint/ruff/biome)全单二进制。否决 TS(node 运行时摩擦)、Python(版本碎片+PyInstaller 脆弱)。AI 集成(evolve 调 LLM)=HTTP 语言无关,YAML 解析三栈皆成熟,无差异。CLI 用 `cobra`/`urfave/cli`,YAML 用 `gopkg.in/yaml.v3`。⚠️ 报告竞品数据(agentskills.io 字段/OpenSpec star)部分待联网核实,不影响 Go 结论。

## MVP lint 规则初稿(起点,待细化)

严重度 ERROR/WARN/INFO。扫 `.claude/skills/` 和 `.codex/skills/` 的 SKILL.md。

| 规则 | 级别 | 检查 |
|---|---|---|
| name-kebab | ERROR | name 是 kebab-case |
| name-dir-match | ERROR | 所在目录名 = name |
| description-present | ERROR | 有 description |
| description-quality | WARN | 说明"能力+触发场景",适合 progressive disclosure,非标题复述 |
| description-len | WARN | 长度 20–300 字符 |
| metadata-targets | INFO | 有 metadata.targets(分发用) |
| argument-hint | INFO | 接参数的 skill 有 argument-hint |
| token-budget | WARN | 主体 token 估算 >2000 警告 |
| trigger-clarity | INFO | 主体说明何时触发 |

输出:按 skill 分组的报告 + 聚合评分(0–100,喂 rating)。

## fixture(写测试用)

- skillshare 仓库 `.skillshare/skills/*/SKILL.md`(7 个真实内置 skill)
- obra/superpowers-skills 仓库 `skills/*/SKILL.md`
- 自造 2–3 个违规 fixture(缺 description / name 不 kebab / token 超大)测规则触发

## 待办

- [x] 查重名(2026-06-26):`left-skills` npm/PyPI 均 404 可用,GitHub 无同领域竞品(匿名 API 限流未跑全,用户拍板采用);备选 skilllint **禁用**(撞 `bitflight-devops/skilllint`★6 同领域 linter + `bueti/skilllint` Go/SKILL.md,且 PyPI 200 占用);skillshift(GitHub 64 个均无关求职/教育)、skillloop(npm/PyPI 404)仅无关同名,可作 plan B。
- [x] 确认技术栈(2026-06-26,Go 单二进制,据 hyperresearch 报告)
- [ ] 细化 lint 规则集 + 严重度
- [ ] 写 MVP + fixture 测试
- [x] initial commit(2026-06-26,f9ac3fa → cuikexi/left-skills)

## 未来路线图(MVP 后,不进 MVP)

- **evolve 环**设计时把 `migrate`(迁移/重命名/拆分目录)、`clean`(删除冗余/久未使用)作为 evolve 的 diff 类型一并做——本质都是"检测→生成 diff→人审→应用",不是新环/新命令,绝不自动改 skill 资产(防 hallucinate / 破坏稳定)。
- **rating 环**设计时评估使用数据采集:hook 埋点 skill 调用事件 + 本地存使用记录(自动有状态,新基础设施层,与 bug 采集借 GitHub Issues 的手动无状态不同)。命名用 metrics / usage-health,**不用 audit**(撞 skillshare audit)。
- 红线:每想一个动作别开新环——先看能否归入既有五环,避免工具膨胀(撞"简洁优先")。

## 接手第一句

"读 docs/research.md 和 README.md,从待办第一项开始。"
