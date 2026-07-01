// inspire:扫会话日志 → hybrid(正则粗筛 + LLM 精提)→ 输出 prompt(人审,不自动创建)
// 信号源:Bash command 骨架重复 + all tool_use name 序列重复(工作流)
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { llmAnalyze } from './llm.js';
import { listInstalledSkills } from './hooks.js';

// 扫 ~/.claude/projects/*/*.jsonl,提取 Bash command(骨架)+ all tool name 序列
function scanSessions(sinceDays = 30): {
  cmdCount: Map<string, number>; // Bash command 精确计数
  seqCount: Map<string, number>; // tool name 序列(3 连续)计数
} {
  const projectsDir = join(homedir(), '.claude', 'projects');
  const cmdCount = new Map<string, number>();
  const seqCount = new Map<string, number>();
  if (!existsSync(projectsDir)) return { cmdCount, seqCount };
  const cutoff = Date.now() - sinceDays * 86400000;

  for (const project of readdirSync(projectsDir, { withFileTypes: true })) {
    if (!project.isDirectory()) continue;
    const projectDir = join(projectsDir, project.name);
    for (const file of readdirSync(projectDir)) {
      if (!file.endsWith('.jsonl')) continue;
      try {
        const content = readFileSync(join(projectDir, file), 'utf-8');
        const toolNames: string[] = []; // 收集 tool name 序列
        for (const line of content.split('\n')) {
          if (!line.trim()) continue;
          try {
            const obj = JSON.parse(line);
            const ts = obj.timestamp;
            if (ts && new Date(ts).getTime() < cutoff) continue;
            const msg = obj.message;
            if (msg && msg.content && Array.isArray(msg.content)) {
              for (const block of msg.content) {
                if (block.type === 'tool_use') {
                  toolNames.push(block.name);
                  // Bash command 计数
                  if (block.name === 'Bash') {
                    const cmd = block.input?.command;
                    if (cmd && cmd.length >= 30) {
                      cmdCount.set(cmd, (cmdCount.get(cmd) || 0) + 1);
                    }
                  }
                }
              }
            }
          } catch {}
        }
        // tool name 序列(3 连续)计数
        for (let i = 0; i + 2 < toolNames.length; i++) {
          const seq = toolNames.slice(i, i + 3).join(',');
          seqCount.set(seq, (seqCount.get(seq) || 0) + 1);
        }
      } catch {}
    }
  }
  return { cmdCount, seqCount };
}

// 正则去引号 + 路径 → 骨架
export function skeletonize(cmd: string): string {
  return cmd
    .replace(/"[^"]*"/g, '*')
    .replace(/'[^']*'/g, '*')
    .replace(/\/[^\s"']+/g, '/*')
    .replace(/\s+/g, ' ')
    .trim();
}

// 去噪:简单命令或骨架太短(<10 字符)
export function isNoise(skeleton: string): boolean {
  const simple = /^(echo|ls|cat|cd|pwd|clear|exit|which|whoami|date|uptime)\b/i;
  return simple.test(skeleton) || skeleton.length < 10;
}

// 去噪:tool 序列(纯 Read/纯 Bash 等单 tool 不算工作流)
function isSeqNoise(seq: string): boolean {
  const parts = seq.split(',');
  // 全同(Read,Read,Read)不算工作流
  if (parts.every((p) => p === parts[0])) return true;
  return false;
}

// hybrid inspire:Bash 骨架候选 + tool 序列候选 + OBSERVE + LLM 精提(含 test 指令)
export async function inspirePrompt(sinceDays = 30): Promise<string> {
  const { cmdCount, seqCount } = scanSessions(sinceDays);

  // Bash 骨架候选(现有)
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
  const cmdCandidates = [...skeletonCount.entries()]
    .filter(([, info]) => info.count >= 3)
    .sort((a, b) => b[1].count - a[1].count);

  // tool 序列候选(all tools,工作流重复)
  const seqCandidates = [...seqCount.entries()]
    .filter(([seq, count]) => count >= 3 && !isSeqNoise(seq))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  if (cmdCandidates.length === 0 && seqCandidates.length === 0) {
    return '无重复模式(Bash 骨架 ≥3 或 tool 序列 ≥3),暂不建议写 skill。\n(试更多天?left-skills inspire --since 90)';
  }

  // OBSERVE:已装 skill 名单
  const installed = listInstalledSkills();

  // LLM 精提(有 API key 时,含 test 指令)
  const llmPrompt = `你反复跑这些(${cmdCandidates.length} 个 Bash 骨架 + ${seqCandidates.length} 个 tool 序列):

## Bash 骨架候选
${cmdCandidates.slice(0, 10).map(([sk, info]) => `- ${sk}(${info.count} 次,例: ${info.examples[0]})`).join('\n') || '(无)'}

## tool 序列候选(all tools,工作流)
${seqCandidates.map(([seq, count]) => `- ${seq}(${count} 次)`).join('\n') || '(无)'}

已装 skill(避免重复提议):
${installed.length > 0 ? installed.map((s) => '- ' + s).join('\n') : '(无)'}

请判断:哪些该写 skill(自动化)?挑 1-2 个最频繁的,生成 SKILL.md 草稿指令。
- description 说明"何时用"(让 AI 自决触发)
- body 含该命令/工作流(自动化)
- **含 test cases(Happy/Edge/Error 3 场景)**(给人审验)
- 不要提议已装 skill 重复的`;

  const system = '你是 skill 架构师。从重复命令/工作流判断该不该写 skill,避免重复已装的。输出含 test cases 的改进指令(给人审,不自动创建)。';
  const llmResult = await llmAnalyze(llmPrompt, system);

  // 输出 prompt
  const lines: string[] = [];
  lines.push('# inspire:你反复跑的命令 + 工作流(建议写 skill 自动化)');
  lines.push('');
  lines.push('## Bash 骨架候选(正则粗筛 ≥3)');
  if (cmdCandidates.length > 0) {
    for (const [sk, info] of cmdCandidates) lines.push(`- ${sk}(${info.count} 次)`);
  } else {
    lines.push('(无)');
  }
  lines.push('');
  lines.push('## tool 序列候选(all tools,工作流 ≥3)');
  if (seqCandidates.length > 0) {
    for (const [seq, count] of seqCandidates) lines.push(`- ${seq}(${count} 次)`);
  } else {
    lines.push('(无)');
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
    lines.push('## LLM 精提(含 test cases 指令,人审)');
    lines.push(llmResult);
  } else {
    lines.push('## 改进指令(给 AI,无 LLM 降级纯正则)');
    lines.push('请基于以上候选,挑 1-2 个最频繁的,生成 SKILL.md 草稿:');
    lines.push('- description 说明"何时用"');
    lines.push('- body 含该命令/工作流');
    lines.push('- **含 test cases(Happy/Edge/Error)**');
    lines.push('- 不要提议已装 skill 重复的');
  }
  lines.push('');
  lines.push('生成草稿,我审过后丢进 .claude/skills/(不自动创建)。');
  return lines.join('\n');
}
