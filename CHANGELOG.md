# Changelog

## 0.5.0 (2026-07-01)

- `left-skills evolve <skill>`:收集 usage+lint 信号 → 输出改进 prompt(给 AI,人审,不 LLM,不自动改)

## 0.4.0 (2026-06-30)

- `left-skills lint`:静态质量检查 SKILL.md(对齐 skills-ref:name kebab/dir-match/description;补深度:metadata/argument-hint/token,0-100 分)

## 0.3.0 (2026-06-30)

- `left-skills doctor`:诊断安装/hook 配置(5 项深 self-check:binary/hook/usage/hook 能跑/node,✓/✗ + 建议)
- `left-skills report --markdown`:导出 usage 报告 markdown(> report.md 分享)

## 0.2.0 (2026-06-30)

- `left-skills uninstall`:删 `~/.claude/settings.json` 的 left-skills hook(对偶 `install --write`,备份 `.bak`),干净卸载

## 0.1.9 (2026-06-30)

- `left-skills install --write`:自动写 hook 到 `~/.claude/settings.json`(合并去重 + 备份 `.bak`),不用手抄 JSON

## 0.1.8 (2026-06-30)

- 修 `--version` 硬编码(动态读 package.json)

## 0.1.7 (2026-06-30)

- 升 node 24 / npm 11(Trusted Publishing 要 npm 11.5.1+,之前 npm 10.9 不支持)

## 0.1.6 (2026-06-29)

- npm publish --provenance(显式触发 OIDC)

## 0.1.5 (2026-06-29)

- workflow 用 $NPM_CONFIG_USERCONFIG 路径删 _authToken(之前操作 cwd .npmrc 错)

## 0.1.4 (2026-06-29)

- workflow 强制 OIDC(unset NODE_AUTH_TOKEN + 删 .npmrc _authToken)+ debug env

## 0.1.3 (2026-06-29)

- OIDC Trusted Publishing(删 NPM_TOKEN secret,npm 纯 OIDC)

## 0.1.2 (2026-06-29)

- 修 repository.url 格式(git+https,Trusted Publisher exact match)

## 0.1.1 (2026-06-29)

- CI 改 OIDC Trusted Publishing(无 NPM_TOKEN,更安全)

## 0.1.0 (2026-06-29)

MVP:skill 调用使用统计(usage)。

- hook 三数据源埋点(手动 `/slash` + AI 调 Skill 工具 + 自然语言提及)
- JSON 存储(`~/.left-skills/usage.json`)
- `left-skills usage` 报告(人看 + `--json`)
- `left-skills install` 输出 hook 配置片段
- 只 Claude Code(Cursor/Codex 后扩)
