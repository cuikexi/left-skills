// doctor:诊断 left-skills 安装/hook 配置(✓/✗ + 建议)
import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { execSync } from 'node:child_process';

export interface DiagResult {
  name: string;
  ok: boolean;
  detail: string;
  fix?: string;
}

// binary 在 PATH?
export function checkBinary(): DiagResult {
  try {
    const path = execSync('which left-skills', { encoding: 'utf-8' }).trim();
    return { name: 'binary in PATH', ok: true, detail: path };
  } catch {
    return { name: 'binary in PATH', ok: false, detail: 'left-skills 命令找不到', fix: 'npm i -g left-skills' };
  }
}

// settings.json 有 left-skills hook?
export function checkHook(): DiagResult {
  const settingsPath = join(homedir(), '.claude', 'settings.json');
  if (!existsSync(settingsPath)) {
    return { name: 'hook in settings', ok: false, detail: '~/.claude/settings.json 不存在', fix: 'left-skills install --write' };
  }
  try {
    const settings = JSON.parse(readFileSync(settingsPath, 'utf-8'));
    const hooks = settings.hooks || {};
    const hasLeft = Object.values(hooks).some((entries: any) =>
      entries.some((e: any) => (e.hooks || []).some((h: any) => h.command && h.command.includes('left-skills')))
    );
    return hasLeft
      ? { name: 'hook in settings', ok: true, detail: '~/.claude/settings.json 有 left-skills hook' }
      : { name: 'hook in settings', ok: false, detail: 'settings.json 无 left-skills hook', fix: 'left-skills install --write' };
  } catch {
    return { name: 'hook in settings', ok: false, detail: 'settings.json 解析失败', fix: '检查 ~/.claude/settings.json JSON' };
  }
}

// usage.json 存?
export function checkUsageFile(): DiagResult {
  const usagePath = join(homedir(), '.left-skills', 'usage.json');
  return existsSync(usagePath)
    ? { name: 'usage.json', ok: true, detail: '~/.left-skills/usage.json 存在' }
    : { name: 'usage.json', ok: false, detail: '~/.left-skills/usage.json 不存在(首次用后创建)', fix: '打 /skill 或 AI 调 skill 触发 hook 记录' };
}

// hook 命令能跑?(模拟 hook,看 binary 找到 + 不报错)
export function checkHookCanRun(): DiagResult {
  try {
    execSync('echo "{}" | left-skills hook UserPromptExpansion', { encoding: 'utf-8', stdio: 'pipe' });
    return { name: 'hook command runs', ok: true, detail: 'left-skills hook 能执行' };
  } catch {
    return { name: 'hook command runs', ok: false, detail: 'left-skills hook 命令执行失败', fix: '检查 left-skills binary / node' };
  }
}

// node 版本(left-skills 要 node 18+)
export function checkNodeVersion(): DiagResult {
  try {
    const ver = execSync('node --version', { encoding: 'utf-8' }).trim();
    const major = parseInt(ver.slice(1).split('.')[0], 10);
    return major >= 18
      ? { name: 'node version', ok: true, detail: `${ver} (≥18)` }
      : { name: 'node version', ok: false, detail: `${ver} (<18)`, fix: '升级 node 到 18+' };
  } catch {
    return { name: 'node version', ok: false, detail: 'node 命令找不到', fix: '装 node 18+' };
  }
}

// 全部诊断(5 项:binary/hook/usage/hook 能跑/node)
export function runDoctor(): DiagResult[] {
  return [checkBinary(), checkHook(), checkUsageFile(), checkHookCanRun(), checkNodeVersion()];
}
