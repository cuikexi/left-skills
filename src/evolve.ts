// evolve:收集 usage+lint 信号 → 输出改进 prompt(不 LLM,人审)
import { aggregate } from './store.js';
import { lintSkill } from './lint.js';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

// 找 skill 目录(.claude/skills + .codex/skills,项目 + 全局)
function findSkillDir(skillName: string): string | null {
  const dirs = [
    join(process.cwd(), '.claude/skills'),
    join(process.cwd(), '.codex/skills'),
    join(homedir(), '.claude/skills'),
    join(homedir(), '.codex/skills'),
  ];
  for (const d of dirs) {
    if (!existsSync(d)) continue;
    const skillDir = join(d, skillName);
    if (existsSync(skillDir)) return skillDir;
  }
  return null;
}

// 收集信号 + 输出改进 prompt(给 AI 的指令,不 LLM)
export function evolvePrompt(skillName: string): string {
  const lines: string[] = [];
  lines.push(`# 改进 skill: ${skillName}`);
  lines.push('');

  // usage 信号
  const stats = aggregate(30);
  const stat = stats.find((s) => s.name === skillName);
  const total = stat ? stat.manual + stat.ai + stat.mention : 0;
  lines.push(`## usage 信号`);
  if (!stat || total === 0) {
    lines.push(`- ⚠ 近 30 天从未调用(写了没用?description 没说清 trigger → AI 不触发)`);
  } else {
    lines.push(`- 调用 ${total} 次(手动 ${stat.manual} + AI ${stat.ai} + 提及 ${stat.mention})`);
    if (stat.ai === 0) lines.push(`- ⚠ AI 从不主动调用(只手动,description 可能没让 AI 触发)`);
  }

  // lint 信号
  const skillDir = findSkillDir(skillName);
  lines.push('');
  lines.push(`## lint 信号`);
  let lint = null;
  if (!skillDir) {
    lines.push(`- ⚠ skill 目录找不到(${skillName} 未装?)`);
  } else {
    lint = lintSkill(skillDir);
    if (lint.issues.length === 0) {
      lines.push(`- ✓ 静态质量合规(0 issue)`);
    } else {
      for (const issue of lint.issues) {
        lines.push(`- ${issue.severity}  ${issue.rule}: ${issue.message}`);
      }
    }
  }

  // 改进指令(给 AI)
  lines.push('');
  lines.push(`## 改进指令(给 AI)`);
  lines.push(`请基于以上信号,改进 skill \`${skillName}\` 的 SKILL.md:`);
  if (!stat || total === 0) {
    lines.push(`- description 没让 AI 触发 → 改 description,加 "Use when..." 触发场景(说明能力 + 何时用)`);
  }
  if (stat && stat.ai === 0) {
    lines.push(`- AI 不主动调用 → description 补 trigger 关键词(让 AI 自决触发)`);
  }
  if (lint) {
    for (const issue of lint.issues) {
      if (issue.severity === 'ERROR') {
        if (issue.rule === 'name-kebab') lines.push(`- name 不合规 → 改 name 为 kebab-case(小写+连字符)`);
        if (issue.rule === 'name-dir-match') lines.push(`- name≠目录 → 改 name 或目录名(一致)`);
        if (issue.rule === 'description-present') lines.push(`- description 缺 → 加 description(说明能力+触发)`);
      }
      if (issue.severity === 'WARN' && issue.rule === 'description-len') lines.push(`- description 长度 → 调到 20-300 字符`);
      if (issue.severity === 'WARN' && issue.rule === 'token-budget') lines.push(`- body 太长 → 拆 references/`);
    }
  }
  lines.push('');
  lines.push(`生成改进 diff,我审过后应用(不自动改)。`);
  return lines.join('\n');
}
