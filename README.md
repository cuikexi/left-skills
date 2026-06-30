<div align="center">

# left-skills

**shift-left for skills** — measure how your AI skills are used before users hit bugs.

[![npm version](https://img.shields.io/npm/v/left-skills)](https://www.npmjs.com/package/left-skills)
[![license](https://img.shields.io/npm/l/left-skills)](./LICENSE)
[![stars](https://img.shields.io/github/stars/cuikexi/left-skills)](https://github.com/cuikexi/left-skills)

[中文](./README.zh.md)

</div>

## Why "left-skills"?

`left-skills` = **shift-left for skills**. Move quality/measurement "left" — to *before* a skill is put into use — instead of waiting for users to hit bugs. Know which skills never get called, fix them early.

## How It Works

```
type /skill or AI invokes a skill
    │ Claude Code hook fires
    ▼
left-skills hook (3 sources)
  - UserPromptExpansion.command_name   (manual /slash)
  - PreToolUse.tool_input.skill        (AI invokes Skill tool)
  - UserPromptSubmit.prompt            (natural-language mention)
    │ parse payload, extract skill name
    ▼
~/.left-skills/usage.json (append records)
    │
    ▼
left-skills usage report (manual / AI / mention split + never-called ⚠)
```

## Installation

```bash
npm i -g left-skills
left-skills install --write   # auto-config hooks into ~/.claude/settings.json (merge + backup .bak)
```

> Don't want auto-write? `left-skills install` prints a snippet to add manually. See [docs/install.md](docs/install.md).

## Quick Start

```bash
left-skills usage            # human-readable report
left-skills usage --json     # for AI (JSON)
left-skills usage --since 7  # last 7 days
```

Example:

```
skill usage report (14 skills)
────────────────────────────────────
  3  grill-me            (manual1 + AI1 + mention1, last today)
  0  gitlab-ci-generate  ⚠ never called
```

## Highlights

- **3-source hook tracking**: manual `/slash`, AI Skill-tool invoke, natural-language mention — tracked separately
- **Honest reporting**: manual/AI/mention split (no fake "call count"), never-called ⚠
- **For AI use**: `--json` output, AI can parse to decide (improve/delete skill)
- **Single-file bundle**: TS bundled to one `.js`, ships via skill ecosystem

## Limitations

- **Claude Code only** (Cursor / Codex later)
- **AI pure progressive-disclosure auto-activation** (not via Skill tool) can't be tracked — only manual `/slash` + AI Skill-tool + natural-language mention
- Requires hook config (user adds to settings.json)
- MVP stage (early, API may change)

## Contributing

PRs welcome. Dev setup:

```bash
git clone https://github.com/cuikexi/left-skills
cd left-skills
npm install
npm run build
npm link   # local left-skills into PATH
```

Run `npm run build` before PR to ensure dist is fresh. Philosophy / roadmap see [docs/roadmap.md](docs/roadmap.md).

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=cuikexi/left-skills&type=Date)](https://star-history.com/#cuikexi/left-skills&date)

## License

[MIT](./LICENSE)
