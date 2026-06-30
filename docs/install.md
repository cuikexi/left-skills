# 安装 left-skills

## 1. 装

全局(推荐,`left-skills` 进 PATH):
```bash
npm install -g left-skills
```

或免装用 npx:
```bash
npx left-skills usage
```

## 2. 加 hook 配置(必需,否则没数据)

```bash
left-skills install --write   # 自动配 hook 到 ~/.claude/settings.json(合并去重 + 备份 .bak)
```

> 不想自动写?`left-skills install` 输出片段,手动加进 `~/.claude/settings.json` 的 `hooks` 字段。

## 卸载

```bash
left-skills uninstall           # 删 hook(备份 .bak)
npm uninstall -g left-skills    # 卸 binary
```

## 3. 用

```bash
left-skills usage          # 人看报告
left-skills usage --json   # AI 用(JSON)
left-skills usage --since 7  # 近 7 天
```

hook 装好后,你打 `/skill` 或 AI 调 skill 会自动记录到 `~/.left-skills/usage.json`,`left-skills usage` 出报告。

## 边界

- 抓得到:用户手动 `/slash`、AI 调 Skill 工具、prompt 提及 skill 名
- 抓不到:AI 纯 progressive disclosure 自主激活(不走 Skill 工具,实证罕见)
- 只 Claude Code(Cursor/Codex 后扩)
