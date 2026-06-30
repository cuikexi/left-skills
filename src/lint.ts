// lint:静态质量检查(对齐 skills-ref + 补深度,0-100 分)
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import matter from 'gray-matter';

export type Severity = 'ERROR' | 'WARN' | 'INFO';

export interface LintIssue {
  rule: string;
  severity: Severity;
  message: string;
}

export interface LintResult {
  skill: string;
  dir: string;
  issues: LintIssue[];
  score: number; // 0-100
}

// 规则检查(对齐 skills-ref + 补深度)
export function lintSkill(skillDir: string): LintResult {
  const skillMdPath = join(skillDir, 'SKILL.md');
  const issues: LintIssue[] = [];
  const dirName = skillDir.split('/').pop() || '';

  if (!existsSync(skillMdPath)) {
    issues.push({ rule: 'skill-md-present', severity: 'ERROR', message: 'SKILL.md 不存在' });
    return { skill: dirName, dir: skillDir, issues, score: 0 };
  }

  const { data: fm, content: body } = matter(readFileSync(skillMdPath, 'utf-8'));
  const name = fm.name || '';
  const description = fm.description || '';

  // name-kebab(ERROR):name kebab-case(小写+连字符,不首尾/连续连字符)
  if (!name) {
    issues.push({ rule: 'name-kebab', severity: 'ERROR', message: 'name 缺失' });
  } else {
    if (name !== name.toLowerCase()) issues.push({ rule: 'name-kebab', severity: 'ERROR', message: `name 含大写: ${name}` });
    if (name.startsWith('-') || name.endsWith('-')) issues.push({ rule: 'name-kebab', severity: 'ERROR', message: 'name 首尾连字符' });
    if (name.includes('--')) issues.push({ rule: 'name-kebab', severity: 'ERROR', message: 'name 连续连字符' });
    if (!/^[a-z0-9-]+$/.test(name)) issues.push({ rule: 'name-kebab', severity: 'ERROR', message: `name 非法字符: ${name}` });
  }

  // name-dir-match(ERROR):name = 目录名
  if (name && name !== dirName) {
    issues.push({ rule: 'name-dir-match', severity: 'ERROR', message: `name(${name})≠目录(${dirName})` });
  }

  // description-present(ERROR)
  if (!description) {
    issues.push({ rule: 'description-present', severity: 'ERROR', message: 'description 缺失' });
  }

  // description-len(WARN):20-300 字符
  if (description) {
    const len = description.length;
    if (len < 20) issues.push({ rule: 'description-len', severity: 'WARN', message: `description 太短(${len}<20)` });
    if (len > 300) issues.push({ rule: 'description-len', severity: 'WARN', message: `description 太长(${len}>300)` });
  }

  // metadata-targets(INFO)
  if (!fm.metadata?.targets) {
    issues.push({ rule: 'metadata-targets', severity: 'INFO', message: '无 metadata.targets(分发用)' });
  }

  // argument-hint(INFO):body 用 $ARGUMENTS 但无 argument-hint
  if (body.includes('$ARGUMENTS') && !fm['argument-hint']) {
    issues.push({ rule: 'argument-hint', severity: 'INFO', message: 'body 用 $ARGUMENTS 但无 argument-hint' });
  }

  // token-budget(WARN):body < 500 行(粗估 token)
  const lines = body.split('\n').length;
  if (lines > 500) {
    issues.push({ rule: 'token-budget', severity: 'WARN', message: `body ${lines} 行(>500,token 预算风险)` });
  }

  // 0-100 分(基础 100,ERROR -20 / WARN -5 / INFO 不扣,clamp)
  let score = 100;
  for (const issue of issues) {
    if (issue.severity === 'ERROR') score -= 20;
    if (issue.severity === 'WARN') score -= 5;
  }
  score = Math.max(0, score);

  return { skill: name || dirName, dir: skillDir, issues, score };
}

// 扫所有 skill(.claude/skills + .codex/skills,项目 + 全局)
export function lintAll(): LintResult[] {
  const dirs = [
    join(process.cwd(), '.claude/skills'),
    join(process.cwd(), '.codex/skills'),
    join(homedir(), '.claude/skills'),
    join(homedir(), '.codex/skills'),
  ];
  const results: LintResult[] = [];
  const seen = new Set<string>();
  for (const d of dirs) {
    if (!existsSync(d)) continue;
    for (const entry of readdirSync(d, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const skillDir = join(d, entry.name);
      if (seen.has(skillDir)) continue;
      seen.add(skillDir);
      results.push(lintSkill(skillDir));
    }
  }
  return results;
}

// 格式化人看
export function formatLintHuman(results: LintResult[]): string {
  const lines: string[] = [];
  lines.push(`lint 报告(${results.length} 个 skill)`);
  lines.push('─'.repeat(60));
  for (const r of results) {
    lines.push(`  ${r.score}  ${r.skill}  (${r.issues.length} issue)`);
    for (const issue of r.issues) {
      lines.push(`       ${issue.severity}  ${issue.rule}: ${issue.message}`);
    }
  }
  return lines.join('\n');
}
