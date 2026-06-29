// hook payload 解析:三数据源 → appendRecord
import { appendRecord } from './store.js';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

// 从 stdin 读 hook payload(JSON)
export async function readStdinPayload(): Promise<any> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(chunk as Buffer);
  const text = Buffer.concat(chunks).toString('utf-8').trim();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// 2.1 UserPromptExpansion:取 command_name → manual
export function handleUserPromptExpansion(payload: any): void {
  const skill = payload?.command_name;
  if (!skill || typeof skill !== 'string') return;
  appendRecord({
    skill,
    trigger: 'manual',
    timestamp: new Date().toISOString(),
    session_id: payload?.session_id,
  });
}

// 2.2 PreToolUse(matcher=Skill):取 tool_input.skill → ai
export function handlePreToolUse(payload: any): void {
  if (payload?.tool_name !== 'Skill') return;
  const skill = payload?.tool_input?.skill;
  if (!skill || typeof skill !== 'string') return;
  appendRecord({
    skill,
    trigger: 'ai',
    timestamp: new Date().toISOString(),
    session_id: payload?.session_id,
  });
}

// 2.3 UserPromptSubmit:prompt 文本匹配已装 skill 名 → mention
export function handleUserPromptSubmit(payload: any): void {
  const prompt: string = payload?.prompt ?? '';
  if (!prompt) return;
  // slash 命令(/开头)已由 UserPromptExpansion 记 manual,跳过避免重复
  if (prompt.trimStart().startsWith('/')) return;
  const skills = listInstalledSkills();
  for (const name of skills) {
    if (matchSkillName(prompt, name)) {
      appendRecord({
        skill: name,
        trigger: 'mention',
        timestamp: new Date().toISOString(),
        session_id: payload?.session_id,
      });
    }
  }
}

// 精确匹配 prompt 含 skill 名(词边界,避免子串误判,如 data 不匹配 data-analysis 的 data)
function matchSkillName(prompt: string, name: string): boolean {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(^|[^a-z0-9-])${escaped}([^a-z0-9-]|$)`, 'i');
  return re.test(prompt);
}

// 列已装 skill 名(.claude/skills/ + .codex/skills/,项目 + 全局)
export function listInstalledSkills(): string[] {
  const names = new Set<string>();
  const dirs = [
    join(process.cwd(), '.claude/skills'),
    join(process.cwd(), '.codex/skills'),
    join(homedir(), '.claude/skills'),
    join(homedir(), '.codex/skills'),
  ];
  for (const d of dirs) {
    if (!existsSync(d)) continue;
    for (const entry of readdirSync(d, { withFileTypes: true })) {
      if (entry.isDirectory()) names.add(entry.name);
    }
  }
  return [...names];
}
