#!/usr/bin/env node

const { program } = require('commander');
const path = require('path');
const GitScanner = require('./scanner');
const HTMLReporter = require('./reporter');
const Utils = require('./utils');

program
  .version('0.1.0')
  .description('Git repository statistics analyzer')
  .argument('<path>', 'path to git repository')
  .option('-o, --output <file>', 'output file path')
  .option('-f, --format <format>', 'output format (json|text|html)', 'text')
  .action(async (repoPath, options) => {
    try {
      // Validate repository path
      const absolutePath = path.resolve(repoPath);
      if (!Utils.validateGitRepository(absolutePath)) {
        console.error(`❌ Error: "${repoPath}" is not a valid Git repository`);
        console.error('Please ensure the path points to a directory containing a .git folder');
        process.exit(1);
      }

      console.log(`🔍 Analyzing repository: ${absolutePath}`);
      const scanner = new GitScanner(absolutePath);
      const stats = await scanner.analyze();
      
      if (options.format === 'json') {
        const output = JSON.stringify(stats, null, 2);
        if (options.output) {
          require('fs').writeFileSync(options.output, output);
          console.log(`📊 JSON stats saved to ${options.output}`);
        } else {
          console.log(output);
        }
      } else if (options.format === 'html') {
        const outputPath = options.output || 'gitstats-report.html';
        const reportPath = HTMLReporter.generateReport(stats, outputPath);
        console.log(`📈 HTML report generated: ${reportPath}`);
        console.log(`Open ${reportPath} in your browser to view the report`);
      } else {
        scanner.printStats(stats);
      }
    } catch (error) {
      if (error.message.includes('Not a git repository')) {
        console.error('❌ Error: The specified path is not a Git repository');
        console.error('Make sure you\'re pointing to a directory that contains a .git folder');
      } else if (error.code === 'ENOENT') {
        console.error('❌ Error: Path not found');
        console.error('Please check that the specified path exists');
      } else {
        console.error('❌ Error:', error.message);
      }
      process.exit(1);
    }
  });

program.parse();