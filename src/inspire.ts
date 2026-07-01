// inspire:扫会话日志找重复 Bash command → 输出 prompt(不 LLM,人审)
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

// 扫 ~/.claude/projects/*/*.jsonl,提取 Bash tool_use command,计数(近 sinceDays 天)
function scanSessions(sinceDays = 30): Map<string, number> {
  const projectsDir = join(homedir(), '.claude', 'projects');
  const cmdCount = new Map<string, number>();
  if (!existsSync(projectsDir)) return cmdCount;
  const cutoff = Date.now() - sinceDays * 86400000; // 时间过滤

  for (const project of readdirSync(projectsDir, { withFileTypes: true })) {
    if (!project.isDirectory()) continue;
    const projectDir = join(projectsDir, project.name);
    for (const file of readdirSync(projectDir)) {
      if (!file.endsWith('.jsonl')) continue;
      const filePath = join(projectDir, file);
      try {
        const content = readFileSync(filePath, 'utf-8');
        for (const line of content.split('\n')) {
          if (!line.trim()) continue;
          try {
            const obj = JSON.parse(line);
            // 时间过滤(有 timestamp 且早于 cutoff 跳过)
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
          } catch {
            // 跳过无效行
          }
        }
      } catch {
        // 跳过无法读的文件
      }
    }
  }
  return cmdCount;
}

// 找重复(≥3 次),输出 prompt
export function inspirePrompt(sinceDays = 30): string {
  const cmdCount = scanSessions(sinceDays);
  const repeated = [...cmdCount.entries()]
    .filter(([, count]) => count >= 3)
    .sort((a, b) => b[1] - a[1]);

  if (repeated.length === 0) {
    return '无重复模式(长命令 ≥30 字符,重复 ≥3 次),暂不建议写 skill。\n(试更多天?left-skills inspire --since 90)';
  }

  const lines: string[] = [];
  lines.push('# inspire:你反复跑的命令(建议写 skill 自动化)');
  lines.push('');
  lines.push('## 重复命令(长命令 ≥30 字符,重复 ≥3 次)');
  for (const [cmd, count] of repeated) {
    lines.push(`- \`${cmd}\`(${count} 次)`);
  }
  lines.push('');
  lines.push('## 改进指令(给 AI)');
  lines.push('请基于以上重复命令,生成 SKILL.md 草稿:');
  lines.push('- 挑 1-2 个最频繁的命令序列,设计 skill(name / description / body)');
  lines.push('- description 说明"何时用"(让 AI 自决触发)');
  lines.push('- body 含该命令序列(自动化)');
  lines.push('');
  lines.push('生成草稿,我审过后丢进 .claude/skills/(不自动创建)。');
  return lines.join('\n');
}
