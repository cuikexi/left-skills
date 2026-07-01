// scan:扫会话日志找重复 Bash command + tool 序列(数据采集,不 LLM)
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

function scanSessions(sinceDays = 30): {
  cmdCount: Map<string, number>;
  seqCount: Map<string, number>;
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
        const toolNames: string[] = [];
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
        for (let i = 0; i + 2 < toolNames.length; i++) {
          const seq = toolNames.slice(i, i + 3).join(',');
          seqCount.set(seq, (seqCount.get(seq) || 0) + 1);
        }
      } catch {}
    }
  }
  return { cmdCount, seqCount };
}

export function skeletonize(cmd: string): string {
  return cmd
    .replace(/"[^"]*"/g, '*')
    .replace(/'[^']*'/g, '*')
    .replace(/\/[^\s"']+/g, '/*')
    .replace(/\s+/g, ' ')
    .trim();
}

export function isNoise(skeleton: string): boolean {
  const simple = /^(echo|ls|cat|cd|pwd|clear|exit|which|whoami|date|uptime)\b/i;
  return simple.test(skeleton) || skeleton.length < 10;
}

function isSeqNoise(seq: string): boolean {
  const parts = seq.split(',');
  if (parts.every((p) => p === parts[0])) return true;
  return false;
}

export interface ScanResult {
  candidates: { skeleton: string; count: number; examples: string[] }[];
  tool_sequences: { sequence: string; count: number }[];
}

export function scan(sinceDays = 30): ScanResult {
  const { cmdCount, seqCount } = scanSessions(sinceDays);
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
  const candidates = [...skeletonCount.entries()]
    .filter(([, info]) => info.count >= 3)
    .sort((a, b) => b[1].count - a[1].count)
    .map(([skeleton, info]) => ({ skeleton, count: info.count, examples: info.examples }));
  const tool_sequences = [...seqCount.entries()]
    .filter(([seq, count]) => count >= 3 && !isSeqNoise(seq))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([sequence, count]) => ({ sequence, count }));
  return { candidates, tool_sequences };
}
