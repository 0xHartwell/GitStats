#!/usr/bin/env node

const { program } = require('commander');
const GitScanner = require('./scanner');
const HTMLReporter = require('./reporter');

program
  .version('0.1.0')
  .description('Git repository statistics analyzer')
  .argument('<path>', 'path to git repository')
  .option('-o, --output <file>', 'output file path')
  .option('-f, --format <format>', 'output format (json|text|html)', 'text')
  .action(async (path, options) => {
    try {
      const scanner = new GitScanner(path);
      const stats = await scanner.analyze();
      
      if (options.format === 'json') {
        const output = JSON.stringify(stats, null, 2);
        if (options.output) {
          require('fs').writeFileSync(options.output, output);
          console.log(`Stats saved to ${options.output}`);
        } else {
          console.log(output);
        }
      } else if (options.format === 'html') {
        const outputPath = options.output || 'gitstats-report.html';
        const reportPath = HTMLReporter.generateReport(stats, outputPath);
        console.log(`HTML report generated: ${reportPath}`);
      } else {
        scanner.printStats(stats);
      }
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  });

program.parse();