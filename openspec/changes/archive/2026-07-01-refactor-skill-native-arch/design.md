## Context

left-skills 0.8.0 有 llm.ts(调 Anthropic API,token/代理/模型名问题)。定位"skill 中运行"→ Claude Code 本身是 LLM → 删 llm.ts。CLI 是数据工具箱(小命令,不 LLM),skill 是入口(AI 组合 CLI + AI 分析)。

## Goals / Non-Goals

**Goals:**
- 删 llm.ts(不调 LLM,不 token)
- 删 inspire/evolve CLI(LLM 含义名,CLI 不做 LLM)
- 加 scan(扫 jsonl,bash+sequences 合并)+ list-skills(列已装)+ lint --json
- SKILL.md 是推荐入口(/left-skills → AI 跑 CLI --json → AI 分析 → 人审)

**Non-Goals:**
- 不删 CLI(保留,数据工具箱 + hook 埋点)
- 不自动改 skill(人审红线)

## Decisions

1. **三层架构**:
   - 入口层:SKILL.md(/left-skills slash,推荐用户用)
   - 逻辑层:CLI(数据工具箱,小命令,不 LLM)
   - 智能层:AI(Claude Code LLM,读 JSON 分析)
2. **CLI 数据工具箱**(按数据源拆,不按输出拆):
   - `scan --json` — 扫 jsonl 一次,出 Bash 重复 + tool 序列(同源合并)
   - `list-skills --json` — 扫 .claude/skills(独立)
   - `usage --json` — 已有(全局)
   - `lint --json` — 已有加 --json(全局)
   - doctor/report/install/uninstall/hook — 已有(不变)
3. **删 inspire/evolve/llm.ts**:
   - inspire → AI 组合 scan + list-skills(数据)+ AI 判断
   - evolve → AI 组合 usage + lint(全局,AI 过滤 skill)+ AI 判断
4. **SKILL.md body 写死组合**(AI 按表跑,不"AI 自选"):
   - /left-skills inspire → AI 跑 scan + list-skills --json
   - /left-skills evolve → AI 跑 usage + lint --json(过滤 skill)
   - /left-skills lint → AI 跑 lint --json
   - /left-skills usage → AI 跑 usage --json

## Risks / Trade-offs

- [AI 跑多个 CLI] → scan + list-skills(2 次,可接受;同源合并 scan,不重复 I/O)
- [全局 usage/lint + AI 过滤] → 数据小(15 skill),AI 读全局过滤单个,够
- [SKILL.md 写死组合] → 清晰(AI 按表跑),但 binary 加命令后 SKILL.md 要跟(后维护)
