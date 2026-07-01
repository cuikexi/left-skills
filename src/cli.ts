#!/usr/bin/env node
// left-skills CLI 入口(数据工具箱,不调 LLM)
import { Command } from 'commander';
import { readStdinPayload, handleUserPromptExpansion, handlePreToolUse, handleUserPromptSubmit, listInstalledSkills } from './hooks.js';
import { buildReport, formatHuman, formatMarkdown } from './report.js';
import { hookSnippet, writeHooksToSettings, removeHooksFromSettings, globalSettingsPath, writeSkillWrapper, removeSkillWrapper } from './install.js';
import { runDoctor } from './doctor.js';
import { lintAll, formatLintHuman, formatLintJson } from './lint.js';
import { scan } from './scan.js';
import pkg from '../package.json';

const program = new Command();

program
  .name('left-skills')
  .description('给 AI 用的 skill 生命周期管理工具(数据工具箱,skill 入口 + AI 分析)')
  .version(pkg.version);

// usage:skill 调用使用报告
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

// scan:扫会话找重复命令 + tool 序列(数据,给 AI)
program
  .command('scan')
  .description('扫会话找重复 Bash 命令 + tool 序列(数据采集,不 LLM)')
  .option('--json', '输出 JSON(AI 用)')
  .option('--since <days>', '时间窗口(天,默认 30)', '30')
  .action((opts) => {
    const since = parseInt(opts.since, 10) || 30;
    const result = scan(since);
    if (opts.json) {
      console.log(JSON.stringify(result));
    } else {
      console.log(`scan 报告(${result.candidates.length} 候选 + ${result.tool_sequences.length} 序列)`);
      for (const c of result.candidates) console.log(`  ${c.count}  ${c.skeleton}`);
      for (const s of result.tool_sequences) console.log(`  ${s.count}  ${s.sequence}`);
    }
  });

// list-skills:列已装 skill(数据,给 AI)
program
  .command('list-skills')
  .description('列已装 skill(.claude/skills + .codex/skills)')
  .option('--json', '输出 JSON(AI 用)')
  .action((opts) => {
    const skills = listInstalledSkills();
    if (opts.json) {
      console.log(JSON.stringify({ skills }));
    } else {
      for (const s of skills) console.log(s);
    }
  });

// lint:静态质量检查(数据,加 --json)
program
  .command('lint')
  .description('静态质量检查 SKILL.md(0-100 分)')
  .option('--json', '输出 JSON(AI 用)')
  .action((opts) => {
    const results = lintAll();
    if (opts.json) {
      console.log(formatLintJson(results));
    } else {
      console.log(formatLintHuman(results));
    }
  });

// report:导出 usage 报告 markdown
program
  .command('report')
  .description('导出 usage 报告 markdown(可 > report.md)')
  .option('--markdown', '输出 markdown(默认)')
  .option('--since <days>', '时间窗口(天,默认 30)', '30')
  .action((opts) => {
    const since = parseInt(opts.since, 10) || 30;
    const report = buildReport(since);
    console.log(formatMarkdown(report));
  });

// doctor:诊断安装/hook
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

// install:配 hook + 放 SKILL.md wrapper
program
  .command('install')
  .description('输出 hook 片段(默认)或 --write 配 hook + 放 SKILL.md')
  .option('--write', '自动写 hook + 放 SKILL.md(备份 .bak)', false)
  .action((opts) => {
    if (opts.write) {
      const path = globalSettingsPath();
      writeHooksToSettings(path);
      writeSkillWrapper();
      console.log(`✓ hook 已写入 ${path}(备份 .bak)`);
      console.log(`✓ SKILL.md 已放 ~/.claude/skills/left-skills/(/left-skills slash 触发)`);
    } else {
      console.log(JSON.stringify(hookSnippet(), null, 2));
    }
  });

// uninstall:删 hook + SKILL.md
program
  .command('uninstall')
  .description('删 hook + SKILL.md(干净卸载)')
  .action(() => {
    const path = globalSettingsPath();
    removeHooksFromSettings(path);
    removeSkillWrapper();
    console.log(`✓ hook 已删 ${path}(备份 .bak)`);
    console.log(`✓ SKILL.md 已删`);
  });

// hook:埋点(内部)
program
  .command('hook <event>')
  .description('hook 入口(读 stdin payload)')
  .action(async (event) => {
    const payload = await readStdinPayload();
    if (!payload) return;
    switch (event) {
      case 'UserPromptExpansion': handleUserPromptExpansion(payload); break;
      case 'PreToolUse': handlePreToolUse(payload); break;
      case 'UserPromptSubmit': handleUserPromptSubmit(payload); break;
      default: break;
    }
  });

program.parse();
