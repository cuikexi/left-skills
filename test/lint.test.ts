// lint 测试:合规 skill 全 ✓ + 违规 skill 规则触发
import { test } from 'node:test';
import assert from 'node:assert';
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { lintSkill } from '../src/lint.js';

const tmp = mkdtempSync(join(tmpdir(), 'left-skills-lint-test-'));

test('lint 合规 skill: 高分 + 无 ERROR', () => {
  const skillDir = join(tmp, 'good-skill');
  mkdirSync(skillDir, { recursive: true });
  writeFileSync(join(skillDir, 'SKILL.md'), `---
name: good-skill
description: 这是一个合规的 skill 用于测试,说明能力和。
metadata:
  targets: [claude]
---

# Good Skill
body content`);
  const result = lintSkill(skillDir);
  assert.equal(result.skill, 'good-skill');
  assert.ok(result.score >= 90, `score ${result.score} 应高(≥90)`);
  assert.ok(!result.issues.some(i => i.severity === 'ERROR'), '不应有 ERROR');
});

test('lint 违规 skill: name 大写 + name≠目录 + description 太短', () => {
  const skillDir = join(tmp, 'bad-dir');
  mkdirSync(skillDir, { recursive: true });
  writeFileSync(join(skillDir, 'SKILL.md'), `---
name: BadName
description: short
---
body`);
  const result = lintSkill(skillDir);
  // name 大写(name-kebab)
  assert.ok(result.issues.some(i => i.rule === 'name-kebab' && i.severity === 'ERROR'));
  // name≠目录(name-dir-match)
  assert.ok(result.issues.some(i => i.rule === 'name-dir-match' && i.severity === 'ERROR'));
  // description 太短(description-len WARN)
  assert.ok(result.issues.some(i => i.rule === 'description-len' && i.severity === 'WARN'));
  assert.ok(result.score < 90, `score ${result.score} 应低(<90)`);
});

process.on('exit', () => rmSync(tmp, { recursive: true, force: true }));
