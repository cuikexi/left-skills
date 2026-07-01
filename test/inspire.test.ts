// inspire 测试:hybrid + all tools + 序列 + OBSERVE + test 指令
import { test } from 'node:test';
import assert from 'node:assert';
import { inspirePrompt, skeletonize, isNoise } from '../src/inspire.js';

test('skeletonize: 去引号 + 路径 → 骨架', () => {
  assert.equal(skeletonize('git commit -m "fix bug"'), 'git commit -m *');
  assert.equal(skeletonize('curl -s /Users/mbj0599/code/path'), 'curl -s /*');
});

test('isNoise: 简单命令过滤', () => {
  assert.ok(isNoise('echo *'));
  assert.ok(isNoise('ls'));
  assert.ok(!isNoise('git commit -m *'));
});

test('inspire prompt 含 Bash 骨架 + tool 序列 + OBSERVE + 人审', async () => {
  const prompt = await inspirePrompt(30);
  // 有候选 → 含"候选";无 → 含"无重复"
  assert.ok(prompt.includes('候选') || prompt.includes('无重复'), '含候选或无重复');
  // tool 序列(all tools)
  assert.ok(prompt.includes('tool 序列') || prompt.includes('无重复'), '含 tool 序列');
  // OBSERVE
  assert.ok(prompt.includes('已装') || prompt.includes('OBSERVE'), '含 OBSERVE');
  // 人审
  assert.ok(prompt.includes('审过后') || prompt.includes('不自动'), '含人审');
});

test('inspire prompt 含 test cases 指令(quality+test)', async () => {
  const prompt = await inspirePrompt(30);
  // 有 LLM → 含"test cases";无 LLM 降级 → 含"test cases"(降级 prompt 也含)
  assert.ok(prompt.includes('test cases') || prompt.includes('Happy'), '含 test 指令');
});
