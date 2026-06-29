# left-skills

[![Star History Chart](https://api.star-history.com/svg?repos=cuikexi/left-skills&type=Date)](https://star-history.com/#cuikexi/left-skills&date)

> Shift-left for AI CLI skills — 先度量 skill 用没用,再决定改/删,而不是等用户撞 bug。

`left-skills` 是一个 **skill 生命周期管理**工具,覆盖 skill 从发现到进化的闭环。和 [skillshare](https://github.com/runkids/skillshare)(分发)、[OpenSpec](https://github.com/Fission-AI/OpenSpec)(spec 工作流)、[superpowers](https://github.com/obra/superpowers)(方法论内容)互补,不竞争——它们管 skill 怎么分发/怎么用,`left-skills` 管 **skill 本身怎么变好**。

## MVP:skill 调用使用统计(usage)

你写完 skill 不知道 AI 有没有调用、哪些从没用过?left-skills 通过 Claude Code hook 埋点统计 skill 调用,出使用报告。

**三数据源**(hook 实测验证):
- 手动 `/slash` → `UserPromptExpansion.command_name`
- AI 调 Skill 工具 → `PreToolUse.tool_input.skill`
- 自然语言提 skill → `UserPromptSubmit.prompt` 文本匹配

**用法**:
```bash
left-skills usage          # 人看报告(每 skill 手动/AI/提及 分开 + 从未调用 ⚠)
left-skills usage --json   # AI 用(JSON)
left-skills install        # 输出 hook 配置片段
```

**诚实边界**:AI 纯 progressive disclosure 自主激活(不走 Skill 工具)抓不到;只 Claude Code(Cursor/Codex 后扩)。

安装见 [docs/install.md](docs/install.md)。

## 五环(生命周期)

```
inspiration  从会话历史挖"该写 skill"
      ↓ [写 skill]
lint ─────────→ rating(静态分)
      ↓ [用 skill]
usage ────────→ rating(运行时)  ← MVP
      ↓
bug/issue ───→ evolve(AI 据 issue+usage 生成 diff,人审批)→ 改 skill → 回 usage
```

| 环 | 做什么 | 状态 |
|---|---|---|
| **usage** | hook 埋点统计 skill 调用(手动 / AI / 提及),出报告 | **MVP ✅** |
| lint | 静态质量(name / description / token,对齐 skills-ref) | v1a |
| rating | 评分(静态 lint + 运行时 usage) | 规划(usage 是运行时部分) |
| bug/issue | 会话关键字 → 自动建 GitHub Issue(per-skill 标签) | 规划 |
| evolve | AI 据 issue+usage 生成改进 diff,人 review(**非自动改**) | 规划 |
| inspiration | 扫会话历史找重复模式,建议抽 skill | 规划 |

roadmap 详见 [docs/roadmap.md](docs/roadmap.md)。

## 技术栈

**TypeScript** + 单文件 bundle .js。给 AI 用的工具生态(GitHub 实测:MCP servers / cline / OpenSpec / continue 全 TS)主流;随 skill 生态分发、Claude Code hook 原生、迭代快。选型依据见 [docs/hyperresearch-report.md](docs/hyperresearch-report.md)。

## 状态

**MVP usage 跑通**(23/23 task 完成,真值验通过)。研究背景见 [docs/research.md](docs/research.md),MVP 设计见 [docs/mvp-prompt.md](docs/mvp-prompt.md)。

## License

MIT(计划)
