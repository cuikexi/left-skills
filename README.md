# left-skills

[![Star History Chart](https://api.star-history.com/svg?repos=cuikexi/left-skills&type=Date)](https://star-history.com/#cuikexi/left-skills&date)

> Shift-left for AI CLI skills — 让 skill 在投入使用前就变好,而不是等用户撞 bug。

`left-skills` 是一个 **skill 生命周期管理**工具,覆盖 skill 从发现到进化的闭环。和 [skillshare](https://github.com/runkids/skillshare)(分发)、[OpenSpec](https://github.com/Fission-AI/OpenSpec)(spec 工作流)、[superpowers](https://github.com/obra/superpowers)(方法论内容)互补,不竞争——它们管 skill 怎么分发/怎么用,`left-skills` 管 **skill 本身怎么变好**。

## 五环(生命周期)

```
inspiration  从会话历史挖"该写 skill"
      ↓ [写 skill]
lint ─────────→ rating(静态分,lint 聚合)
      ↓ [用 skill]
bug/issue ───→ rating(运行时星)
      ↓
evolve(AI 据 issue+lint 生成 diff,人审批)→ 改 skill → 回 lint
```

| 环 | 做什么 | 状态 |
|---|---|---|
| **lint** | 最佳实践 lint:description 适合 progressive disclosure 吗、name kebab、metadata 齐、token 超大... | **MVP** |
| rating | 评分(静态基于 lint + 运行时用户星) | 规划 |
| bug/issue | 会话关键字触发 → 自动建 GitHub Issue(per-skill 标签) | 规划 |
| evolve | AI 据 issue+lint 生成改进 diff,人 review 应用(skill 的 PR 工作流,**非自动改**) | 规划 |
| inspiration | 扫会话历史找重复模式,建议抽 skill | 规划 |

## MVP:skill linter

扫 `.claude/skills/` 和 `.codex/skills/` 的 SKILL.md,跑最佳实践规则,出报告。

**不做**(避免和 skillshare 撞):
- 一致性检测(未同步 / codex 有 claude 没有)——这是 skillshare 单一源同步的核心,不碰
- 安全 audit(prompt-injection)——skillshare `audit` 已做,不碰

**做**:
- description 质量检查(适合 progressive disclosure 吗:是否说明能力 + 触发场景)
- frontmatter 规范(name kebab-case、metadata 齐全、argument-hint)
- token 预算检查(SKILL.md 过大警告)
- 触发词/argument-hint 检查
- 输出 lint 报告 + 聚合评分(喂给 rating)

## 技术栈

**TypeScript** + 单文件 bundle .js。给 AI 用的工具生态(GitHub 实测:MCP servers / cline / OpenSpec / continue 全 TS)主流选择;随 skill 生态分发自然、Claude Code hook 原生、lint 规则迭代快。定位与选型依据见 [docs/hyperresearch-report.md](docs/hyperresearch-report.md)。

## 状态

立项中。研究背景见 [docs/research.md](docs/research.md)。

## License

MIT(计划)
