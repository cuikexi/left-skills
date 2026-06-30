// install:输出/写 hook 配置到 settings.json(合并去重 + 备份)
import { existsSync, readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

// left-skills hook 片段(三数据源)
export function hookSnippet() {
  const cmd = 'left-skills hook';
  return {
    hooks: {
      UserPromptExpansion: [
        { matcher: '.*', hooks: [{ type: 'command', command: `${cmd} UserPromptExpansion` }] },
      ],
      PreToolUse: [
        { matcher: 'Skill', hooks: [{ type: 'command', command: `${cmd} PreToolUse` }] },
      ],
      UserPromptSubmit: [
        { hooks: [{ type: 'command', command: `${cmd} UserPromptSubmit` }] },
      ],
    },
  };
}

// 写 hook 到 settings.json(合并去重 + 备份 .bak)
export function writeHooksToSettings(settingsPath: string): void {
  // 备份原文件
  if (existsSync(settingsPath)) {
    copyFileSync(settingsPath, settingsPath + '.bak');
  }
  // 读现有 settings
  let settings: any = {};
  if (existsSync(settingsPath)) {
    try {
      settings = JSON.parse(readFileSync(settingsPath, 'utf-8'));
    } catch {
      settings = {};
    }
  }
  // 合并 hooks(去重:已含相同 entry 跳过,不重复加)
  const snippet = hookSnippet();
  if (!settings.hooks) settings.hooks = {};
  for (const [event, entries] of Object.entries(snippet.hooks)) {
    if (!settings.hooks[event]) {
      settings.hooks[event] = entries;
    } else {
      for (const entry of entries as any[]) {
        const exists = settings.hooks[event].some((e: any) => JSON.stringify(e) === JSON.stringify(entry));
        if (!exists) settings.hooks[event].push(entry);
      }
    }
  }
  // 写回
  writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n', 'utf-8');
}

// 删 left-skills hook(command 含 "left-skills" 的 entry,覆盖 "left-skills hook" + 绝对路径 "node /path/left-skills hook"),备份 .bak
export function removeHooksFromSettings(settingsPath: string): void {
  if (!existsSync(settingsPath)) return; // 无 settings,无需删
  copyFileSync(settingsPath, settingsPath + '.bak'); // 备份
  let settings: any = {};
  try {
    settings = JSON.parse(readFileSync(settingsPath, 'utf-8'));
  } catch {
    return;
  }
  if (!settings.hooks) return; // 无 hooks,无需删
  // 遍历各 event,删 command 含 "left-skills" 的 hook;entry.hooks 空则删 entry;event 空则删 key
  for (const event of Object.keys(settings.hooks)) {
    settings.hooks[event] = settings.hooks[event].filter((entry: any) => {
      entry.hooks = (entry.hooks || []).filter((h: any) => !(h.command && h.command.includes('left-skills')));
      return entry.hooks.length > 0;
    });
    if (settings.hooks[event].length === 0) delete settings.hooks[event];
  }
  if (Object.keys(settings.hooks).length === 0) delete settings.hooks; // hooks 空 删 key
  writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n', 'utf-8');
}

// 默认全局 settings 路径
export function globalSettingsPath(): string {
  return join(homedir(), '.claude', 'settings.json');
}
