// inspire 测试:prompt 含重复命令 或 无重复提示
import { test } from 'node:test';
import assert from 'node:assert';
import { inspirePrompt } from '../src/inspire.js';

test('inspire prompt 含 重复 或 无重复提示', () => {
  const prompt = inspirePrompt(30);
  // 有重复 → 含 "重复命令";无 → 含 "无重复"
  assert.ok(
    prompt.includes('重复命令') || prompt.includes('无重复'),
    'prompt 应含重复命令或无重复提示'
  );
});

test('inspire prompt 不自动创建(人审)', () => {
  const prompt = inspirePrompt(30);
  // 有重复 → 含"审过后"(人审);无重复 → 含"无重复"(也不自动创建)
  assert.ok(prompt.includes('审过后') || prompt.includes('无重复'), '含人审或无重复(不自动创建)');
});
