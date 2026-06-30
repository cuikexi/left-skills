// BDD fixture 测试:hook 三数据源解析 + 聚合 + 报告
// 跑: npm test
import { test } from 'node:test';
import assert from 'node:assert';
import { mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { handleUserPromptExpansion, handlePreToolUse } from '../src/hooks.js';
import { readRecords, aggregate } from '../src/store.js';
import { buildReport } from '../src/report.js';

// 测试隔离:临时 store(在调 store 函数前设 env)
const tmp = mkdtempSync(join(tmpdir(), 'left-skills-test-'));
process.env.LEFT_SKILLS_STORE = join(tmp, 'usage.json');

test('manual: UserPromptExpansion → 记 manual', () => {
  handleUserPromptExpansion({ command_name: 'pdf', session_id: 's1' });
  const r = readRecords();
  assert.equal(r.length, 1);
  assert.equal(r[0].skill, 'pdf');
  assert.equal(r[0].trigger, 'manual');
});

test('ai: PreToolUse(Skill) → 记 ai', () => {
  handlePreToolUse({ tool_name: 'Skill', tool_input: { skill: 'code-review' }, session_id: 's1' });
  const r = readRecords();
  assert.ok(r.some((x) => x.skill === 'code-review' && x.trigger === 'ai'));
});

test('aggregate: 按 skill + trigger 聚合', () => {
  const stats = aggregate(30);
  const pdf = stats.find((s) => s.name === 'pdf');
  assert.equal(pdf?.manual, 1);
  const cr = stats.find((s) => s.name === 'code-review');
  assert.equal(cr?.ai, 1);
});

test('buildReport: 含有记录的 skill', () => {
  const report = buildReport(30);
  assert.ok(report.skills.some((s) => s.name === 'pdf'));
  assert.ok(report.skills.some((s) => s.name === 'code-review'));
});

// 清理临时 store
process.on('exit', () => rmSync(tmp, { recursive: true, force: true }));
