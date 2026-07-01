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

// SKILL.md wrapper 内容(/left-skills slash 触发,body 调 binary)
const SKILL_MD_CONTENT = `---
name: left-skills
description: 管理 AI skill 生命周期(lint 检查质量 / usage 统计用频 / evolve 改进 / inspire 发现新 skill)。用户想管 skill 质量时触发。
---

# left-skills

left-skills 是 skill 生命周期管理 CLI。通过这个 skill,你可以在对话里触发 left-skills 命令。

## 子命令

- \`left-skills lint\` — 静态质量检查 SKILL.md(0-100 分)
- \`left-skills usage\` — skill 调用使用报告
- \`left-skills evolve <skill>\` — 收集 usage+lint 信号,输出改进 prompt(给 AI,人审)
- \`left-skills inspire\` — 扫会话找重复命令,提议写 skill
- \`left-skills doctor\` — 诊断安装/hook 配置
- \`left-skills report --markdown\` — 导出 usage 报告
- \`left-skills install --write\` — 配 hook + 放这个 skill
- \`left-skills uninstall\` — 删 hook + 删这个 skill

## 怎么用

用户想管 skill 质量时,跑对应 \`left-skills <命令>\`(用 Bash 工具),把输出给用户。不知道哪个命令时跑 \`left-skills --help\`。

跑完输出是 prompt/报告,人审后应用(不自动改 skill)。
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
