// install/uninstall 测试:写 hook + 删 hook(不删别的)+ 备份
import { test } from 'node:test';
import assert from 'node:assert';
import { mkdtempSync, rmSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { writeHooksToSettings, removeHooksFromSettings } from '../src/install.js';

const tmp = mkdtempSync(join(tmpdir(), 'left-skills-install-test-'));
const settingsPath = join(tmp, 'settings.json');

test('install --write: 写 left-skills hook', () => {
  writeHooksToSettings(settingsPath);
  const after = JSON.parse(readFileSync(settingsPath, 'utf-8'));
  assert.ok(after.hooks?.UserPromptExpansion?.some((e: any) => e.hooks?.some((h: any) => h.command?.includes('left-skills'))));
});

test('uninstall: 删 left-skills hook(不删别的)+ 备份 .bak', () => {
  // 构造:left-skills hook + 别的 hook
  writeFileSync(settingsPath, JSON.stringify({
    hooks: {
      UserPromptExpansion: [
        { matcher: '.*', hooks: [{ type: 'command', command: 'left-skills hook UserPromptExpansion' }] },
      ],
      PostToolUse: [
        { matcher: 'Write', hooks: [{ type: 'command', command: 'other-tool hook' }] },
      ],
    },
  }));
  removeHooksFromSettings(settingsPath);
  const after = JSON.parse(readFileSync(settingsPath, 'utf-8'));
  // left-skills hook 删(UserPromptExpansion 删 key)
  assert.equal(after.hooks?.UserPromptExpansion, undefined);
  // 别的 hook 保留
  assert.ok(after.hooks?.PostToolUse?.some((e: any) => e.hooks?.some((h: any) => h.command === 'other-tool hook')));
  // 备份 .bak
  assert.ok(existsSync(settingsPath + '.bak'));
});

process.on('exit', () => rmSync(tmp, { recursive: true, force: true }));
