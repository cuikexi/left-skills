# left-skills

[![Star History Chart](https://api.star-history.com/svg?repos=cuikexi/left-skills&type=Date)](https://star-history.com/#cuikexi/left-skills&date)

> 知道你的 AI skill 用没用、哪些从没被调用 —— Claude Code hook 埋点统计 skill 使用。

## Install

还没发 npm,目前从源码装:

```bash
git clone https://github.com/cuikexi/left-skills
cd left-skills
npm install
npm run build
npm link        # 让 left-skills 进 PATH
```

加 hook 配置(必需,否则没数据):

```bash
left-skills install   # 输出 hook 片段,复制进 ~/.claude/settings.json 的 hooks 字段
```

详见 [docs/install.md](docs/install.md)。

## Usage

```bash
left-skills usage            # 人看报告
left-skills usage --json     # AI 用(JSON)
left-skills usage --since 7  # 近 7 天
```

报告示例:

```
skill 调用报告(14 个 skill)
────────────────────────────────────
  3  grill-me            (手动1 + AI1 + 提及1,最近 今天)
  0  gitlab-ci-generate  ⚠ 从未调用
```

## 它做什么

- hook 埋点统计 skill 调用,三数据源:
  - 手动 `/slash` → `UserPromptExpansion.command_name`
  - AI 调 Skill 工具 → `PreToolUse.tool_input.skill`
  - 自然语言提 skill → `UserPromptSubmit.prompt` 文本匹配
- 存 `~/.left-skills/usage.json`
- 出报告:每 skill 调用次数(手动 / AI / 提及**分开标**) + 最近时间 + 从未调用 ⚠

**边界**:AI 纯 progressive disclosure 自主激活(不走 Skill 工具)抓不到;只 Claude Code(Codex 后扩)。

## More

- [roadmap](docs/roadmap.md) — 五环(usage → lint → evolve → inspiration)+ BDD
- [研究依据](docs/research.md) / [技术选型报告](docs/hyperresearch-report.md)
- 互补 [skillshare](https://github.com/runkids/skillshare)(分发)/ [OpenSpec](https://github.com/Fission-AI/OpenSpec)(spec)/ [superpowers](https://github.com/obra/superpowers)(方法论),不竞争

## License

MIT
