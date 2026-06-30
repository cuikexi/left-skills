<div align="center">

# left-skills

**shift-left for skills** — 在 skill 投入使用前就度量它用没用,而不是等用户撞 bug。

[![npm version](https://img.shields.io/npm/v/left-skills)](https://www.npmjs.com/package/left-skills)
[![license](https://img.shields.io/npm/l/left-skills)](./LICENSE)
[![stars](https://img.shields.io/github/stars/cuikexi/left-skills)](https://github.com/cuikexi/left-skills)

[English](./README.md)

</div>

## 命名由来

`left-skills` = **shift-left for skills**。把质量/度量左移到"投入使用前"——你写完 skill,先看它用没用、写得好不好,而不是等用户撞 bug 才发现。

## How It Works

```
打 /skill 或 AI 调 skill
    │ Claude Code hook 触发
    ▼
left-skills hook(三数据源)
  - UserPromptExpansion.command_name   (手动 /slash)
  - PreToolUse.tool_input.skill        (AI 调 Skill 工具)
  - UserPromptSubmit.prompt            (自然语言提及)
    │ 解析 payload,取 skill 名
    ▼
~/.left-skills/usage.json (append 记录)
    │
    ▼
left-skills usage 报告(手动/AI/提及 分开 + 从未调用 ⚠)
```

## Installation

```bash
npm i -g left-skills
left-skills install --write   # 自动配 hook 到 ~/.claude/settings.json(合并去重 + 备份 .bak)
```

> 不想自动写?`left-skills install` 输出片段手动加。详见 [docs/install.md](docs/install.md)。

## 卸载

```bash
left-skills uninstall           # 删 hook(备份 .bak)
npm uninstall -g left-skills    # 卸 binary
```

## Quick Start

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

## Highlights

- **三数据源 hook 埋点**:手动 `/slash`、AI 调 Skill、自然语言提及,分开记
- **诚实报告**:手动/AI/提及 分开标(不混"调用次数"),从未调用 ⚠
- **给 AI 用**:`--json` 输出,AI 能解析决策(改/删 skill)
- **单文件 bundle**:TS 打包单 `.js`,随 skill 生态分发

## Limitations

- 只 **Claude Code**(Cursor / Codex 后扩)
- **AI 纯 progressive disclosure 自主激活**(不走 Skill 工具)抓不到——只手动 `/slash` + AI 调 Skill 工具 + 自然语言提及
- 需装 hook 配置(用户加 settings.json)
- MVP 期(早期,API 可能变)

## Contributing

PR 欢迎。开发:

```bash
git clone https://github.com/cuikexi/left-skills
cd left-skills
npm install
npm run build
npm link   # 本地 left-skills 进 PATH
```

提 PR 前 `npm run build` 确保 dist 最新。理念 / roadmap 见 [docs/roadmap.md](docs/roadmap.md)。

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=cuikexi/left-skills&type=Date)](https://star-history.com/#cuikexi/left-skills&date)

## License

[MIT](./LICENSE)
