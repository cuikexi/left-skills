// inspire:扫会话日志找重复 Bash command → hybrid(正则粗筛 + LLM 精提)→ 输出 prompt(人审,不自动创建)
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { llmAnalyze } from './llm.js';
import { listInstalledSkills } from './hooks.js';

// 扫 ~/.claude/projects/*/*.jsonl,提取 Bash tool_use command,计数(近 sinceDays 天)
function scanSessions(sinceDays = 30): Map<string, number> {
  const projectsDir = join(homedir(), '.claude', 'projects');
  const cmdCount = new Map<string, number>();
  if (!existsSync(projectsDir)) return cmdCount;
  const cutoff = Date.now() - sinceDays * 86400000;

  for (const project of readdirSync(projectsDir, { withFileTypes: true })) {
    if (!project.isDirectory()) continue;
    const projectDir = join(projectsDir, project.name);
    for (const file of readdirSync(projectDir)) {
      if (!file.endsWith('.jsonl')) continue;
      try {
        const content = readFileSync(join(projectDir, file), 'utf-8');
        for (const line of content.split('\n')) {
          if (!line.trim()) continue;
          try {
            const obj = JSON.parse(line);
            const ts = obj.timestamp;
            if (ts && new Date(ts).getTime() < cutoff) continue;
            const msg = obj.message;
            if (msg && msg.content && Array.isArray(msg.content)) {
              for (const block of msg.content) {
                if (block.type === 'tool_use' && block.name === 'Bash') {
                  const cmd = block.input?.command;
                  if (cmd && cmd.length >= 30) {
                    cmdCount.set(cmd, (cmdCount.get(cmd) || 0) + 1);
                  }
                }
              }
            }
          } catch {}
        }
      } catch {}
    }
  }
  return cmdCount;
}

// 正则去引号 + 路径 → 骨架(相似匹配,非精确)
export function skeletonize(cmd: string): string {
  return cmd
    .replace(/"[^"]*"/g, '*')
    .replace(/'[^']*'/g, '*')
    .replace(/\/[^\s"']+/g, '/*')
    .replace(/\s+/g, ' ')
    .trim();
}

// 去噪:简单命令(echo/ls/cat/cd/pwd 等)或骨架太短(<10 字符)
export function isNoise(skeleton: string): boolean {
  const simple = /^(echo|ls|cat|cd|pwd|clear|exit|which|whoami|date|uptime)\b/i;
  return simple.test(skeleton) || skeleton.length < 10;
}

// hybrid inspire:正则粗筛骨架 + 去噪 + LLM 精提候选 + OBSERVE 已装名单
export async function inspirePrompt(sinceDays = 30): Promise<string> {
  const cmdCount = scanSessions(sinceDays);

  // 正则粗筛:骨架化 + 计数
  const skeletonCount = new Map<string, { count: number; examples: string[] }>();
  for (const [cmd, count] of cmdCount) {
    const skeleton = skeletonize(cmd);
    if (isNoise(skeleton)) continue;
    const existing = skeletonCount.get(skeleton);
    if (existing) {
      existing.count += count;
      if (existing.examples.length < 2) existing.examples.push(cmd.slice(0, 80));
    } else {
      skeletonCount.set(skeleton, { count, examples: [cmd.slice(0, 80)] });
    }
  }

  // 候选(骨架重复 ≥3)
  const candidates = [...skeletonCount.entries()]
    .filter(([, info]) => info.count >= 3)
    .sort((a, b) => b[1].count - a[1].count);

  if (candidates.length === 0) {
    return '无重复模式(长命令 ≥30 字符,骨架重复 ≥3 次),暂不建议写 skill。\n(试更多天?left-skills inspire --since 90)';
  }

  // OBSERVE:扫已装 skill 名单
  const installed = listInstalledSkills();

  // LLM 精提(有 API key 时)
  const llmPrompt = `你反复跑这些命令(${candidates.length} 个候选,按次数排序):
${candidates.slice(0, 10).map(([sk, info]) => `- ${sk}(${info.count} 次,例: ${info.examples[0]})`).join('\n')}

已装 skill(避免重复提议):
${installed.length > 0 ? installed.map((s) => '- ' + s).join('\n') : '(无)'}

请判断:哪些候选该写 skill(自动化)?挑 1-2 个最频繁的,生成 SKILL.md 草稿指令(name/description/body)。不要提议已装 skill 重复的。`;

  const system = '你是 skill 架构师。从重复命令模式判断该不该写 skill,避免重复已装的。输出改进指令(给人审,不自动创建)。';
  const llmResult = await llmAnalyze(llmPrompt, system);

  // 输出 prompt
  const lines: string[] = [];
  lines.push('# inspire:你反复跑的命令(建议写 skill 自动化)');
  lines.push('');
  lines.push('## 候选(正则粗筛骨架重复 ≥3)');
  for (const [sk, info] of candidates) {
    lines.push(`- ${sk}(${info.count} 次)`);
  }
  lines.push('');
  lines.push('## 已装 skill(OBSERVE,避免重复)');
  if (installed.length > 0) {
    for (const s of installed) lines.push(`- ${s}`);
  } else {
    lines.push('(无)');
  }
  lines.push('');
  if (llmResult) {
    lines.push('## LLM 精提(该不该写 skill + 草稿指令)');
    lines.push(llmResult);
  } else {
    lines.push('## 改进指令(给 AI,无 LLM 降级纯正则)');
    lines.push('请基于以上候选,挑 1-2 个最频繁的,生成 SKILL.md 草稿(name/description/body)。');
    lines.push('- description 说明"何时用"(让 AI 自决触发)');
    lines.push('- body 含该命令序列(自动化)');
    lines.push('- 不要提议已装 skill 重复的');
  }
  lines.push('');
  lines.push('生成草稿,我审过后丢进 .claude/skills/(不自动创建)。');
  return lines.join('\n');
}
