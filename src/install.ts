// install:输出/写 hook 配置 + SKILL.md wrapper 到 settings.json/skills(合并去重 + 备份)
import { existsSync, readFileSync, writeFileSync, copyFileSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

// left-skills hook 片段(三数据源)
export function hookSnippet() {
  const cmd = 'left-skills hook';
  return {
    hooks: {
      UserPromptExpansion: [
        { matcher: '.*', hooks: [{ type: 'command', command: `${cmd} UserPromptExpansion` }] },
      ],
      PreToolUse: [
        { matcher: 'Skill', hooks: [{ type: 'command', command: `${cmd} PreToolUse` }] },
      ],
      UserPromptSubmit: [
        { hooks: [{ type: 'command', command: `${cmd} UserPromptSubmit` }] },
      ],
    },
  };
}

// 写 hook 到 settings.json(合并去重 + 备份 .bak)
export function writeHooksToSettings(settingsPath: string): void {
  if (existsSync(settingsPath)) {
    copyFileSync(settingsPath, settingsPath + '.bak');
  }
  let settings: any = {};
  if (existsSync(settingsPath)) {
    try {
      settings = JSON.parse(readFileSync(settingsPath, 'utf-8'));
    } catch {
      settings = {};
    }
  }
  const snippet = hookSnippet();
  if (!settings.hooks) settings.hooks = {};
  for (const [event, entries] of Object.entries(snippet.hooks)) {
    if (!settings.hooks[event]) {
      settings.hooks[event] = entries;
    } else {
      for (const entry of entries as any[]) {
        const exists = settings.hooks[event].some((e: any) => JSON.stringify(e) === JSON.stringify(entry));
        if (!exists) settings.hooks[event].push(entry);
      }
    }
  }
  writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n', 'utf-8');
}

// 删 left-skills hook(command 含 "left-skills" 的 entry,备份 .bak)
export function removeHooksFromSettings(settingsPath: string): void {
  if (!existsSync(settingsPath)) return;
  copyFileSync(settingsPath, settingsPath + '.bak');
  let settings: any = {};
  try {
    settings = JSON.parse(readFileSync(settingsPath, 'utf-8'));
  } catch {
    return;
  }
  if (!settings.hooks) return;
  for (const event of Object.keys(settings.hooks)) {
    settings.hooks[event] = settings.hooks[event].filter((entry: any) => {
      entry.hooks = (entry.hooks || []).filter((h: any) => !(h.command && h.command.includes('left-skills')));
      return entry.hooks.length > 0;
    });
    if (settings.hooks[event].length === 0) delete settings.hooks[event];
  }
  if (Object.keys(settings.hooks).length === 0) delete settings.hooks;
  writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n', 'utf-8');
}

// 默认全局 settings 路径
export function globalSettingsPath(): string {
  return join(homedir(), '.claude', 'settings.json');
}

// SKILL.md wrapper 内容(/left-skills slash 触发,AI 跑 CLI --json + AI 分析)
const SKILL_MD_CONTENT = `---
name: left-skills
description: 管理 AI skill 生命周期。用户想检查/改进/发现 skill 时触发。
---

# left-skills

你是 skill 生命周期管理助手。通过 left-skills CLI 采集数据(--json),你做分析判断。

## 流程
1. 跑 \`left-skills <命令> --json\`(Bash,采集数据)
2. 读 JSON,你分析判断(语义)
3. 输出建议/草稿给用户审(不自动改)

## 入口 → CLI 组合

| 用户意图 | 跑什么 | 你做什么 |
|---|---|---|
| 检查质量 | \`left-skills lint --json\` | 读报告,建议怎么修 |
| 看用没用 | \`left-skills usage --json\` | 读报告,建议改/删 |
| 该写什么 | \`left-skills scan --json\` + \`left-skills list-skills --json\` | 读候选+名单,判断,生成草稿 |
| 改进 skill | \`left-skills usage --json\` + \`left-skills lint --json\`(过滤 skill) | 读信号,生成 diff |
| 诊断 | \`left-skills doctor\` | 输出给用户 |

## 红线
- 不自动改 skill(人审)
- 不自动创建 skill(人审)
`;

// 放 SKILL.md wrapper(让 /left-skills slash 触发)
export function writeSkillWrapper(): void {
  const skillDir = join(homedir(), '.claude', 'skills', 'left-skills');
  mkdirSync(skillDir, { recursive: true });
  writeFileSync(join(skillDir, 'SKILL.md'), SKILL_MD_CONTENT, 'utf-8');
}

// 删 SKILL.md wrapper(对偶 install)
export function removeSkillWrapper(): void {
  const skillDir = join(homedir(), '.claude', 'skills', 'left-skills');
  if (existsSync(skillDir)) {
    rmSync(skillDir, { recursive: true, force: true });
  }
}
