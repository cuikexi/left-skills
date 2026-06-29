## 1. CI 自动 publish

- [x] 1.1 `.github/workflows/publish.yml`(触发 push tag `v*`,跑 `npm run build` + `npm publish`,用 `NPM_TOKEN` secret)
- [x] 1.2 npm 生成 access token(publish 权限),加到 GitHub repo Settings → Secrets(`NPM_TOKEN`)—— 用户做
- [x] 1.3 `package.json` 完善(`files: ["dist/"]` / `bin` / `author` / `license: MIT` / `repository` / `keywords` / `description` / `version`)
- [x] 1.4 `git tag v0.1.0 && git push --tags` 触发 CI publish,验 `npm i -g left-skills` 可用

## 2. README 重写(参考 cline / aider / skillshare)

- [x] 2.1 centered logo + tagline + badge row(npm version / license / star)
- [x] 2.2 一句话 + 命名由来(`left-skills` = shift-left for skills,投入使用前度量/检查)
- [x] 2.3 How It Works 原理(hook 三数据源 → `~/.left-skills/usage.json` → `left-skills usage` 报告,流程图)
- [x] 2.4 Installation(`npm i -g left-skills` + `left-skills install` 加 hook,不 clone)
- [x] 2.5 Quick Start(`left-skills usage` / `--json` / `--since` + 示例输出)
- [x] 2.6 Highlights(三数据源 + 报告 + 边界)
- [x] 2.7 Contributing(开源贡献指引,参考 cline/aider/skillshare)
- [x] 2.8 Star History 放最后(底部)
- [x] 2.9 License(MIT)

## 3. 验

- [x] 3.1 `npm i -g left-skills` 在干净环境装(不 clone 源码)
- [x] 3.2 跑 `left-skills usage`(装后能用)
- [x] 3.3 README 验:badge / 命名由来 / 原理 / Install npm i-g / Contributing / Star 底部 / 结构齐全
