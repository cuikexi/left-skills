// LLM 基础设施:Anthropic API 调用(复用 ANTHROPIC_API_KEY,只分析不 apply,人审红线)
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

// 复用 ANTHROPIC_API_KEY(环境变量 或 ~/.claude/settings.json env);无 key 返回 null(降级纯正则)
export function getApiKey(): string | null {
  // 环境变量
  const env = process.env.ANTHROPIC_API_KEY;
  if (env) return env;
  // 或 Claude Code 配置(读 ~/.claude/settings.json env)
  try {
    const settings = JSON.parse(readFileSync(join(homedir(), '.claude', 'settings.json'), 'utf-8'));
    return settings.env?.ANTHROPIC_API_KEY || null;
  } catch {
    return null;
  }
}

// 调 Anthropic API(messages),LLM 只分析(不 apply,人审红线)。无 key / 错误返回 null(降级)
export async function llmAnalyze(prompt: string, system: string): Promise<string | null> {
  const apiKey = getApiKey();
  if (!apiKey) return null; // 无 key,降级(调用方 fallback 纯正则)

  const model = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6';

  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: 1024,
        system,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    if (!response.ok) return null; // API 错误,降级
    const data: any = await response.json();
    return data.content?.[0]?.text || null;
  } catch {
    return null; // 网络错误,降级
  }
}
