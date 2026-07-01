#!/usr/bin/env node
// left-skills CLI 入口
import { Command } from 'commander';
import { readStdinPayload, handleUserPromptExpansion, handlePreToolUse, handleUserPromptSubmit } from './hooks.js';
import { buildReport, formatHuman, formatMarkdown } from './report.js';
import { hookSnippet, writeHooksToSettings, removeHooksFromSettings, globalSettingsPath } from './install.js';
import { runDoctor } from './doctor.js';
import { lintAll, formatLintHuman } from './lint.js';
import { evolvePrompt } from './evolve.js';
import { inspirePrompt } from './inspire.js';
import pkg from '../package.json';

const program = new Command();

program
  .name('left-skills')
  .description('给 AI 用的 skill 生命周期管理工具 — skill 调用使用统计')
  .version(pkg.version);

// usage 子命令:skill 调用使用报告
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

// lint 子命令:静态质量检查(定义好坏,v1a)
program
  .command('lint')
  .description('静态质量检查 SKILL.md(对齐 skills-ref + 补深度,0-100 分)')
  .action(() => {
    const results = lintAll();
    console.log(formatLintHuman(results));
  });

// evolve 子命令:收集 usage+lint 信号 → 输出改进 prompt(给 AI,人审)
program
  .command('evolve <skill>')
  .description('收集 usage+lint 信号,输出改进 prompt(给 AI,人审,不自动改)')
  .action((skill) => {
    console.log(evolvePrompt(skill));
  });

// inspire 子命令:扫会话找重复命令 → 提议写 skill(给 AI,人审)
program
  .command('inspire')
  .description('扫会话找重复命令,提议写 skill(给 AI,人审,不自动创建)')
  .option('--since <days>', '时间窗口(天,默认 30)', '30')
  .action((opts) => {
    const since = parseInt(opts.since, 10) || 30;
    console.log(inspirePrompt(since));
  });

// report 子命令:导出 usage 报告 markdown(分享/贴图)
program
  .command('report')
  .description('导出 usage 报告 markdown(可 > report.md 分享)')
  .option('--markdown', '输出 markdown(默认即 markdown)')
  .option('--since <days>', '时间窗口(天,默认 30)', '30')
  .action((opts) => {
    const since = parseInt(opts.since, 10) || 30;
    const report = buildReport(since);
    console.log(formatMarkdown(report));
  });

// doctor 子命令:诊断安装/hook 配置
program
  .command('doctor')
  .description('诊断 left-skills 安装/hook 配置(✓/✗ + 修复建议)')
  .action(() => {
    const results = runDoctor();
    for (const r of results) {
      const mark = r.ok ? '✓' : '✗';
      console.log(`${mark} ${r.name}: ${r.detail}`);
      if (r.fix) console.log(`    → 修复: ${r.fix}`);
    }
  });

// install 子命令:输出 hook 片段(默认)或 --write 自动写(合并+备份)
program
  .command('install')
  .description('输出 hook 配置片段(默认)或 --write 自动写进 ~/.claude/settings.json(合并+备份 .bak)')
  .option('--write', '自动写 hook 到 settings.json(合并去重 + 备份 .bak)', false)
  .action((opts) => {
    if (opts.write) {
      const path = globalSettingsPath();
      writeHooksToSettings(path);
      console.log(`✓ hook 已写入 ${path}(已备份 .bak)`);
      console.log('  打 /skill 或 AI 调 skill 会自动记录,跑 left-skills usage 看报告');
    } else {
      console.log(JSON.stringify(hookSnippet(), null, 2));
      console.log('\n# 把上面片段加进 ~/.claude/settings.json 的 hooks 字段,或跑 left-skills install --write 自动写');
    }
  });

// uninstall 子命令:删 left-skills hook(干净卸载,对偶 install --write)
program
  .command('uninstall')
  .description('删 ~/.claude/settings.json 的 left-skills hook(干净卸载,备份 .bak)')
  .action(() => {
    const path = globalSettingsPath();
    removeHooksFromSettings(path);
    console.log(`✓ left-skills hook 已从 ${path} 删除(已备份 .bak)`);
    console.log('  再跑 npm uninstall -g left-skills 卸载 binary');
  });

// hook 子命令:读 stdin payload,按事件分发
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

program.parse();
