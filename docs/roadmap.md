# left-skills Roadmap

> 对应你的:**三痛点**(1 AI 提议写 skill / 2 知道 skill 有没有用 / 3 bug 回流修 skill)+ **三需求**(1 什么是好 skill / 2 什么时候改 / 3 怎么改进)+ **流程**(定义好坏 → 度量 → 改进)

## 总览

```
你的流程        定义好坏 ──→ 度量 ──→ 改进 ──→ (发现)
                  │           │         │          │
roadmap       v1a 静态好坏  MVP usage  v1b evolve  v2 inspiration
                  │           │         │          │
解痛点            —         痛点2      痛点3       痛点1
解需求           需求1       需求2      需求3        —
```

## 阶段表

| 阶段 | 做什么 | 解你的 | 完成结果 |
|---|---|---|---|
| **MVP · usage** | hook 埋点统计 skill 调用(手动 / AI / 提及),存数据库,出报告 | 痛点2 / 需求2 / 流程"度量" | skill 使用报告 |
| **v1a · 静态好坏** | 对齐 skills-ref 结构 + 补深度规则(metadata/argument-hint/token) | 需求1(静态)/ 流程"定义好坏" | 静态质量分,并入报告 |
| **v1b · evolve** | AI 据 usage+静态+bug 痕迹生成 skill 改进 diff,**人审**应用 | 痛点3 / 需求3 / 流程"改进" | 改进 diff,不自动改 |
| **v2 · inspiration** | 扫会话找"反复手动做但没 skill"的重复模式,AI 给候选 skill 草稿 | 痛点1 | skill 草稿,人审入库 |
| **future** | clean(删冗余)/ migrate(重命名拆分)作为 evolve 的 diff 类型;跨 Cursor/Codex 日志 | 生命周期完整 | — |

## MVP 数据源(✅ 已 spike 验证,2026-06-29)

```
手动 /slash       → UserPromptExpansion.command_name        ✅ 实测钉死
AI 调 skill       → PreToolUse(matcher=Skill).tool_input.skill ✅ 实测钉死
自然语言提 skill  → UserPromptSubmit.prompt 文本匹配         ✅ 实测钉死
```

边界:纯 progressive disclosure 内部加载(无 tool call,实证未见)抓不到。要用户装 hook 配置(分发带 hook 片段);有状态(本地数据库);只 Claude Code(Cursor/Codex 后扩)。

## BDD(每阶段完成 → 达到什么结果)

### MVP · usage(解痛点2:"怎么知道 AI 有没有用")

```
假设 我打 /pdf-processing 5 次 + AI 调 code-review 3 次
当  跑 left-skills usage
那么 报告显示 pdf-processing(手动5) / code-review(AI3)
且  从未调用的 skill 标 ⚠

假设 AI 调 left-skills usage --json
当  AI 拿到 {skills:[{name,count,last_used,trigger_type}]}
那么 AI 能据此建议"gitlab-ci-generate 从没被调用,要不要改/删"
```

### v1a · 静态好坏(解需求1:"什么是好 skill"静态维度)

```
假设 我的 skill name 含大写、且 name≠目录名
当  跑 left-skills lint(或并入 usage 报告静态部分)
那么 标"name 不全小写 / name≠目录名"(对齐 skills-ref)
且  给 0–100 静态分
```

### v1b · evolve(解痛点3:"bug 回流修 skill,不用显式提醒")

```
假设 data-analysis skill 调用后,会话日志显示我多次纠正"不对,我要的是 X"(bug 痕迹)
当  跑 left-skills evolve data-analysis
那么 AI 据使用+bug 痕迹生成改进 diff(改 description/body)
且  diff 提交给我 review,不自动应用(红线)
且  我审过后应用,skill 变好 → 回 MVP usage 再度量(改好了吗)
```

### v2 · inspiration(解痛点1:"为啥要我来想写 skill,AI 不能告诉我")

```
假设 我近 30 天反复手动跑"git add && git commit && gh pr create"序列 5 次,无对应 skill
当  跑 left-skills inspire
那么 AI 识别重复模式,提议"该写个 quick-pr skill"
且  给 SKILL.md 草稿,我审过后丢进 .claude/skills/ → 进 MVP usage 度量
```

## 闭环(先定义好坏 → 度量 → 改进 → 再度量)

```
v2 inspire 提议写 skill ──→ 人审入库
      │
      ▼
MVP usage 度量(被用了吗)──→ 没用?──→ v1b evolve 改 description
      │                          │              │
      │                          ▼              ▼
      │                     有 bug 痕迹 ──→ v1b evolve 改 skill
      │
      ▼
v1a 静态好坏(规范对齐)──→ 不合规 ──→ v1b evolve 修结构
      │
      ▼
回 MVP usage 再度量(改好了吗)  ← 闭环
```

## 技术栈

TypeScript(单文件 bundle .js:tsup/esbuild;frontmatter:gray-matter;CLI:commander)。定位:给 AI 用、多机制(hook/skill/CLI)、随 skill 生态分发、不走 MCP。选型依据见 `docs/hyperresearch-report.md` + GitHub 生态实测。

## 约束(红线)

- 不做一致性检测 / 安全 audit(避撞 skillshare)
- evolve 绝不自动改 skill(人审)
- bug 采集借 GitHub Issues
- 简洁优先
- MVP 只做 usage 统计,不写 evolve/inspiration/lint(留 v1+)
