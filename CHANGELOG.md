# Changelog

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
