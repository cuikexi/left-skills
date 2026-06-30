// evolve 测试:prompt 含 usage + lint 信号 + 改进指令
import { test } from 'node:test';
import assert from 'node:assert';
import { evolvePrompt } from '../src/evolve.js';

test('evolve prompt 含 usage + lint 信号 + 指令', () => {
  const prompt = evolvePrompt('nonexistent-skill-xyz');
  assert.ok(prompt.includes('改进 skill'), '含 "改进 skill"');
  assert.ok(prompt.includes('usage 信号'), '含 usage 信号');
  assert.ok(prompt.includes('lint 信号'), '含 lint 信号');
  assert.ok(prompt.includes('改进指令'), '含改进指令');
  // 不存在的 skill: usage 从未调用 + lint 找不到
  assert.ok(prompt.includes('从未调用'), 'usage 从未调用');
  assert.ok(prompt.includes('找不到'), 'lint skill 找不到');
});

test('evolve prompt 不自动改(人审)', () => {
  const prompt = evolvePrompt('nonexistent-skill-xyz');
  assert.ok(prompt.includes('审过后应用'), '含人审(不自动改)');
});
