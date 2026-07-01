// inspire 测试:hybrid inspire(正则粗筛 + OBSERVE + LLM 降级)
import { test } from 'node:test';
import assert from 'node:assert';
import { inspirePrompt } from '../src/inspire.js';
import { skeletonize, isNoise } from '../src/inspire.js';

test('skeletonize: 去引号 + 路径 → 骨架', () => {
  assert.equal(skeletonize('git commit -m "fix bug"'), 'git commit -m *');
  assert.equal(skeletonize('curl -s /Users/mbj0599/code/path'), 'curl -s /*');
});

test('isNoise: 简单命令过滤', () => {
  assert.ok(isNoise('echo *'));
  assert.ok(isNoise('ls'));
  assert.ok(!isNoise('git commit -m *'));
});

test('inspire prompt 含候选 + OBSERVE + 人审', async () => {
  const prompt = await inspirePrompt(30);
  // 有候选 → 含"候选";无 → 含"无重复"
  assert.ok(prompt.includes('候选') || prompt.includes('无重复'), '含候选或无重复');
  // OBSERVE(已装 skill 名单)
  assert.ok(prompt.includes('已装') || prompt.includes('OBSERVE'), '含 OBSERVE 已装名单');
  // 人审(不自动创建)
  assert.ok(prompt.includes('审过后') || prompt.includes('不自动'), '含人审');
});
