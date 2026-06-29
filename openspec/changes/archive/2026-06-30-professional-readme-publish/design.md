## Context

当前 README 不专业:Install 让用户 clone 源码、没讲 hook 原理、没体现 `left-skills` 命名由来(shift-left)、没 badge、star 图在顶部(该底部)、没 Contributing。且没发布(`npm i -g` 不可用)。用户反馈"目前的实现非常悲哀"。

参考 cline / aider / skillshare README 结构后,补充:badge row、Contributing、Star History 放底部、How It Works 原理章节。

## Goals / Non-Goals

**Goals:**
- `npm i -g left-skills` 可用(不 clone 源码)
- README 专业开源水平(参考 cline/aider/skillshare):badge + logo+tagline + 命名由来 + How It Works 原理 + Install(`npm i -g`)+ Quick Start + Highlights + Contributing + Star History(底部)+ License
- CI 自动 publish(GitHub Actions,触发 tag,build + npm publish)
- README 体现命名由来(shift-left for skills)+ 原理章节 + Star 放最后

**Non-Goals:**
- 不改代码(`src/` 不变)
- 不改 skill-usage-tracking 行为
- 不发其他 registry(只 npm)
- 不做 demo GIF(MVP 期用代码块示例)

## Decisions

1. **README 结构**(综合参考 cline/aider/skillshare):
   ```
   centered logo + tagline
   badge row(npm version / license / star)
   一句话 + 命名由来(shift-left for skills)
   How It Works(原理:hook 三数据源 → 存储 → 报告 流程图)
   Installation(npm i -g left-skills + left-skills install 加 hook)
   Quick Start(usage 示例输出)
   Highlights(三数据源 + 报告 + 边界)
   Contributing(开源贡献指引)
   Star History(放最后/底部)
   License
   ```

2. **CI 自动 publish**(不用本地手动):
   - `.github/workflows/publish.yml`:触发 push tag `v*`,跑 `npm run build` + `npm publish`(用 `NPM_TOKEN` secret)
   - 用户在 npm 生成 access token,加到 GitHub repo Settings → Secrets(`NPM_TOKEN`)
   - 发版 = `git tag v0.1.0 && git push --tags`,CI 自动 publish
   - 理由:专业(参考 skillshare 有 GitHub Actions)、token 不落本地、可重复

3. **原理图**(How It Works 章节):
   ```
   打 /skill 或 AI 调 skill
        │ Claude Code hook 触发
        ▼
   left-skills hook(三数据源:UserPromptExpansion / PreToolUse / UserPromptSubmit)
        │ 解析 payload,取 skill 名
        ▼
   ~/.left-skills/usage.json(append 记录)
        │
        ▼
   left-skills usage 报告(手动/AI/提及 分开 + 从未调用 ⚠)
   ```

4. **命名由来**:`left-skills` = **shift-left for skills** —— 质量左移到"投入使用前",不等用户撞 bug。

5. **Star History 放最后**(底部):参考 skillshare(Star History 在 License 前/底部)。不放顶部(顶部给 badge + 一句话 + 命名由来)。

## Risks / Trade-offs

- [CI 要配 NPM_TOKEN secret] → 用户在 npm 生成 token + 加 GitHub Secrets;一次配,后续自动
- [CI publish 版本管理] → 发版前 `npm version patch/minor/major` bump + tag
- [README 参考要贴] → apply 时以本 design 结构为准(已综合参考)
- [publish 后 dist 要在] → CI workflow 先 build 再 publish;`files: ["dist/"]` 只发 dist
