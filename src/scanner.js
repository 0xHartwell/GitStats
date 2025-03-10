const simpleGit = require('simple-git');
const path = require('path');
const fs = require('fs');
const StatsCalculator = require('./stats');
const LanguageDetector = require('./languages');

class GitScanner {
  constructor(repoPath) {
    this.repoPath = path.resolve(repoPath);
    this.git = simpleGit(this.repoPath);
  }

  async analyze() {
    // Check if it's a git repository
    const isRepo = await this.git.checkIsRepo();
    if (!isRepo) {
      throw new Error('Not a git repository');
    }

    const stats = {
      repository: this.repoPath,
      analyzedAt: new Date().toISOString(),
      commits: {},
      contributors: {},
      files: {}
    };

    // Get commit history
    const log = await this.git.log();
    stats.commits.total = log.total;
    stats.commits.latest = log.latest;

    // Analyze contributors
    const contributorMap = new Map();
    log.all.forEach(commit => {
      const author = commit.author_name;
      if (contributorMap.has(author)) {
        contributorMap.get(author).commits++;
      } else {
        contributorMap.set(author, {
          name: author,
          email: commit.author_email,
          commits: 1,
          firstCommit: commit.date,
          lastCommit: commit.date
        });
      }
    });

    stats.contributors.total = contributorMap.size;
    stats.contributors.list = Array.from(contributorMap.values())
      .sort((a, b) => b.commits - a.commits);

    // Commit frequency analysis
    const commitsByMonth = {};
    log.all.forEach(commit => {
      const month = commit.date.substring(0, 7); // YYYY-MM
      commitsByMonth[month] = (commitsByMonth[month] || 0) + 1;
    });
    stats.commits.byMonth = commitsByMonth;

    // Enhanced statistics using StatsCalculator
    stats.commits.frequency = StatsCalculator.calculateCommitFrequency(log.all);
    stats.contributors.metrics = StatsCalculator.calculateContributorMetrics(stats.contributors.list);
    stats.commits.messageAnalysis = StatsCalculator.analyzeCommitMessages(log.all);

    // File analysis
    try {
      stats.files = await this.analyzeFiles();
    } catch (error) {
      stats.files = { error: 'Failed to analyze files' };
    }

    return stats;
  }

  async analyzeFiles() {
    const fileStats = {
      total: 0,
      byExtension: {},
      totalLines: 0,
      languages: {}
    };

    // Get all tracked files
    const files = await this.git.raw(['ls-tree', '-r', '--name-only', 'HEAD']);
    const fileList = files.trim().split('\n').filter(f => f.length > 0);
    
    fileStats.total = fileList.length;

    // Analyze file extensions and count lines
    for (const file of fileList) {
      const ext = path.extname(file).toLowerCase() || 'no-extension';
      fileStats.byExtension[ext] = (fileStats.byExtension[ext] || 0) + 1;

      // Enhanced language detection
      const langInfo = LanguageDetector.detectLanguage(file);
      if (langInfo) {
        fileStats.languages[langInfo.name] = (fileStats.languages[langInfo.name] || 0) + 1;
        
        // Track by category too
        if (!fileStats.categories) fileStats.categories = {};
        fileStats.categories[langInfo.category] = (fileStats.categories[langInfo.category] || 0) + 1;
      }

      // Count lines (for text files only)
      try {
        if (this.isTextFile(ext)) {
          const filePath = path.join(this.repoPath, file);
          if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            const lines = content.split('\n').length;
            fileStats.totalLines += lines;
          }
        }
      } catch (error) {
        // Skip files that can't be read
      }
    }

    return fileStats;
  }

  getLanguageFromExtension(ext) {
    const langMap = {
      '.js': 'JavaScript',
      '.ts': 'TypeScript',
      '.py': 'Python',
      '.java': 'Java',
      '.cpp': 'C++',
      '.c': 'C',
      '.go': 'Go',
      '.rs': 'Rust',
      '.php': 'PHP',
      '.rb': 'Ruby',
      '.swift': 'Swift',
      '.kt': 'Kotlin',
      '.cs': 'C#',
      '.html': 'HTML',
      '.css': 'CSS',
      '.scss': 'SCSS',
      '.less': 'LESS',
      '.vue': 'Vue',
      '.jsx': 'React',
      '.tsx': 'React/TypeScript',
      '.md': 'Markdown',
      '.json': 'JSON',
      '.xml': 'XML',
      '.yaml': 'YAML',
      '.yml': 'YAML',
      '.sql': 'SQL'
    };
    return langMap[ext];
  }

  isTextFile(ext) {
    const textExtensions = [
      '.js', '.ts', '.py', '.java', '.cpp', '.c', '.go', '.rs', '.php', '.rb',
      '.swift', '.kt', '.cs', '.html', '.css', '.scss', '.less', '.vue', '.jsx',
      '.tsx', '.md', '.json', '.xml', '.yaml', '.yml', '.sql', '.txt', '.sh',
      '.bat', '.ps1', '.config', '.ini', '.conf', '.lock'
    ];
    return textExtensions.includes(ext) || ext === 'no-extension';
  }

  printStats(stats) {
    console.log('\n=== Git Repository Statistics ===');
    console.log(`Repository: ${stats.repository}`);
    console.log(`Analyzed at: ${stats.analyzedAt}`);
    
    console.log(`\nCommits:`);
    console.log(`  Total: ${stats.commits.total}`);
    if (stats.commits.latest) {
      console.log(`  Latest: ${stats.commits.latest.date} - ${stats.commits.latest.message}`);
    }

    console.log(`\nContributors:`);
    console.log(`  Total: ${stats.contributors.total}`);
    if (stats.contributors.list.length > 0) {
      console.log('  Top contributors:');
      stats.contributors.list.slice(0, 5).forEach((contributor, i) => {
        console.log(`    ${i + 1}. ${contributor.name} (${contributor.commits} commits)`);
      });
    }

    console.log(`\nCommit Activity:`);
    const months = Object.keys(stats.commits.byMonth).sort();
    if (months.length > 0) {
      console.log('  Recent months:');
      months.slice(-6).forEach(month => {
        console.log(`    ${month}: ${stats.commits.byMonth[month]} commits`);
      });
    }

    if (stats.files && !stats.files.error) {
      console.log(`\nFiles:`);
      console.log(`  Total files: ${stats.files.total}`);
      console.log(`  Total lines: ${stats.files.totalLines}`);
      
      if (Object.keys(stats.files.languages).length > 0) {
        console.log('  Languages:');
        Object.entries(stats.files.languages)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .forEach(([lang, count]) => {
            console.log(`    ${lang}: ${count} files`);
          });
      }
    }
  }
}

module.exports = GitScanner;