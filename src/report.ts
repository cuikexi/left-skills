// usage 报告:聚合 + 已装但从未调用 + 人看 / --json
import { aggregate, SkillStat } from './store.js';
import { listInstalledSkills } from './hooks.js';

// 构建报告:有调用记录的 + 已装但从未调用的,按总次数降序
export function buildReport(sinceDays = 30): { skills: SkillStat[]; generated_at: string } {
  const stats = aggregate(sinceDays);
  const statMap = new Map(stats.map((s) => [s.name, s]));
  // 已装但从未调用(aggregate 里没有的)
  for (const name of listInstalledSkills()) {
    if (!statMap.has(name)) {
      const zero: SkillStat = { name, manual: 0, ai: 0, mention: 0, last_used: null };
      stats.push(zero);
      statMap.set(name, zero);
    }
  }
  // 排序:有调用的按 total 降序,从未调用(0)沉底
  stats.sort((a, b) => (b.manual + b.ai + b.mention) - (a.manual + a.ai + a.mention));
  return { skills: stats, generated_at: new Date().toISOString() };
}

// 人看格式:分开标 manual/ai/mention,不混"调用次数";从未调用标 ⚠
export function formatHuman(report: ReturnType<typeof buildReport>): string {
  const lines: string[] = [];
  lines.push(`skill 调用报告(${report.skills.length} 个 skill,生成于 ${report.generated_at})`);
  lines.push('─'.repeat(60));
  for (const s of report.skills) {
    const total = s.manual + s.ai + s.mention;
    if (total === 0) {
      lines.push(`  0  ${s.name}  ⚠ 从未调用`);
    } else {
      const last = s.last_used ? relativeTime(s.last_used) : '?';
      lines.push(`  ${total}  ${s.name}  (手动${s.manual} + AI${s.ai} + 提及${s.mention},最近 ${last})`);
    }
  }
  return lines.join('\n');
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days <= 0) return '今天';
  if (days === 1) return '1 天前';
  return `${days} 天前`;
}

// 导出 usage 报告 markdown(分享/贴图/团队)
export function formatMarkdown(report: ReturnType<typeof buildReport>): string {
  const lines: string[] = [];
  lines.push(`# left-skills usage report`);
  lines.push('');
  lines.push(`Generated: ${report.generated_at}  |  Skills: ${report.skills.length}`);
  lines.push('');
  lines.push('| skill | manual | AI | mention | total | last |');
  lines.push('|---|---|---|---|---|---|');
  for (const s of report.skills) {
    const total = s.manual + s.ai + s.mention;
    const last = s.last_used ? relativeTime(s.last_used) : '-';
    const mark = total === 0 ? ' ⚠' : '';
    lines.push(`| ${s.name}${mark} | ${s.manual} | ${s.ai} | ${s.mention} | ${total} | ${last} |`);
  }
  return lines.join('\n');
}
