#!/usr/bin/env node
// left-skills CLI 入口
import { Command } from 'commander';
import { readStdinPayload, handleUserPromptExpansion, handlePreToolUse, handleUserPromptSubmit } from './hooks.js';
import { buildReport, formatHuman } from './report.js';
import pkg from '../package.json';

const program = new Command();

program
  .name('left-skills')
  .description('给 AI 用的 skill 生命周期管理工具 — MVP: skill 调用使用统计')
  .version(pkg.version);

// usage 子命令(group 4):skill 调用使用报告
program
  .command('usage')
  .description('skill 调用使用报告')
  .option('--json', '输出 JSON(AI 用)')
  .option('--since <days>', '时间窗口(天,默认 30)', '30')
  .action((opts) => {
    const since = parseInt(opts.since, 10) || 30;
    const report = buildReport(since);
    if (opts.json) {
      console.log(JSON.stringify(report));
    } else {
      console.log(formatHuman(report));
    }
  });

// hook 子命令(group 2):读 stdin payload,按事件分发
program
  .command('hook <event>')
  .description('hook 入口(读 stdin payload)')
  .action(async (event) => {
    const payload = await readStdinPayload();
    if (!payload) return;
    switch (event) {
      case 'UserPromptExpansion':
        handleUserPromptExpansion(payload);
        break;
      case 'PreToolUse':
        handlePreToolUse(payload);
        break;
      case 'UserPromptSubmit':
        handleUserPromptSubmit(payload);
        break;
      default:
        break;
    }
  });

// install 子命令(group 5):输出 hook 配置片段,用户复制进 settings.json
program
  .command('install')
  .description('输出 hook 配置片段(加进 ~/.claude/settings.json 的 hooks 字段)')
  .action(() => {
    const cmd = 'left-skills hook';
    console.log(JSON.stringify({
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
    }, null, 2));
  });

program.parse();
