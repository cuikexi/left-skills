// 本地 JSON 存储:skill 调用记录(append-only)
// 存储路径 ~/.left-skills/usage.json,无依赖,随 skill 生态分发
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { homedir } from 'node:os';

export type TriggerType = 'manual' | 'ai' | 'mention';

export interface UsageRecord {
  skill: string;
  trigger: TriggerType;
  timestamp: string; // ISO 字符串
  session_id?: string;
}

// 存储路径:~/.left-skills/usage.json
const STORE_PATH = join(homedir(), '.left-skills', 'usage.json');

function ensureStore(): void {
  const dir = dirname(STORE_PATH);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  if (!existsSync(STORE_PATH)) writeFileSync(STORE_PATH, '[]', 'utf-8');
}

// 3.2 append 一条记录(append-only,串行写)
export function appendRecord(record: UsageRecord): void {
  ensureStore();
  const records = readRecords();
  records.push(record);
  writeFileSync(STORE_PATH, JSON.stringify(records, null, 2), 'utf-8');
}

// 3.3 读取全部记录
export function readRecords(): UsageRecord[] {
  ensureStore();
  try {
    return JSON.parse(readFileSync(STORE_PATH, 'utf-8')) as UsageRecord[];
  } catch {
    return [];
  }
}

// 3.3 聚合:按 skill + 触发方式 + 时间窗口
export interface SkillStat {
  name: string;
  manual: number;
  ai: number;
  mention: number;
  last_used: string | null;
}

export function aggregate(sinceDays = 30): SkillStat[] {
  const records = readRecords();
  const cutoff = Date.now() - sinceDays * 86400000;
  const map = new Map<string, SkillStat>();
  for (const r of records) {
    const ts = new Date(r.timestamp).getTime();
    if (ts < cutoff) continue;
    let s = map.get(r.skill);
    if (!s) {
      s = { name: r.skill, manual: 0, ai: 0, mention: 0, last_used: null };
      map.set(r.skill, s);
    }
    s[r.trigger] += 1;
    if (!s.last_used || ts > new Date(s.last_used).getTime()) {
      s.last_used = r.timestamp;
    }
  }
  return [...map.values()];
}
