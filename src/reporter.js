const fs = require('fs');
const path = require('path');

class HTMLReporter {
  
  static generateReport(stats, outputPath) {
    const html = this.generateHTML(stats);
    
    // Ensure output directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, html);
    return outputPath;
  }

  static generateHTML(stats) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Git Repository Statistics</title>
    <style>
        ${this.getCSS()}
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🔍 GitStats Report</h1>
            <p class="subtitle">Repository Analysis for ${path.basename(stats.repository)}</p>
            <p class="timestamp">Generated on ${new Date(stats.analyzedAt).toLocaleDateString()}</p>
        </header>

        <div class="grid">
            ${this.generateCommitSection(stats)}
            ${this.generateContributorSection(stats)}
            ${this.generateFileSection(stats)}
            ${this.generateActivitySection(stats)}
        </div>
    </div>
</body>
</html>`;
  }

  static getCSS() {
    return `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh; padding: 20px;
        }
        .container { 
            max-width: 1200px; margin: 0 auto; 
            background: white; border-radius: 12px; 
            box-shadow: 0 20px 60px rgba(0,0,0,0.1); 
            overflow: hidden;
        }
        header { 
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
            color: white; padding: 30px; text-align: center; 
        }
        .subtitle { opacity: 0.9; margin-top: 10px; font-size: 1.1em; }
        .timestamp { opacity: 0.7; margin-top: 5px; font-size: 0.9em; }
        .grid { 
            display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
            gap: 20px; padding: 30px; 
        }
        .card { 
            background: #f8f9fa; border-radius: 8px; padding: 20px; 
            border-left: 4px solid #3498db; 
        }
        .card h3 { color: #2c3e50; margin-bottom: 15px; }
        .stat-item { 
            display: flex; justify-content: space-between; 
            margin-bottom: 10px; padding: 5px 0; 
        }
        .stat-value { font-weight: bold; color: #2980b9; }
        .languages { display: flex; flex-wrap: wrap; gap: 8px; }
        .language-tag { 
            background: #3498db; color: white; padding: 4px 8px; 
            border-radius: 15px; font-size: 0.85em; 
        }
        .activity-chart { 
            display: grid; grid-template-columns: repeat(auto-fit, minmax(60px, 1fr)); 
            gap: 5px; margin-top: 15px; 
        }
        .activity-bar { 
            text-align: center; font-size: 0.8em; 
        }
        .bar { 
            background: #3498db; margin: 5px 0; border-radius: 2px; 
            height: 20px; min-height: 3px; 
        }
    `;
  }

  static generateCommitSection(stats) {
    return `
        <div class="card">
            <h3>📊 Commit Statistics</h3>
            <div class="stat-item">
                <span>Total Commits:</span>
                <span class="stat-value">${stats.commits.total}</span>
            </div>
            ${stats.commits.latest ? `
            <div class="stat-item">
                <span>Latest Commit:</span>
                <span class="stat-value">${new Date(stats.commits.latest.date).toLocaleDateString()}</span>
            </div>
            ` : ''}
            ${stats.commits.messageAnalysis ? `
            <div class="stat-item">
                <span>Avg Message Length:</span>
                <span class="stat-value">${stats.commits.messageAnalysis.averageLength} chars</span>
            </div>
            ` : ''}
        </div>
    `;
  }

  static generateContributorSection(stats) {
    const contributors = stats.contributors.list || [];
    const topContributors = contributors.slice(0, 5);
    
    return `
        <div class="card">
            <h3>👥 Contributors</h3>
            <div class="stat-item">
                <span>Total Contributors:</span>
                <span class="stat-value">${stats.contributors.total}</span>
            </div>
            ${topContributors.map((contributor, i) => `
            <div class="stat-item">
                <span>${i + 1}. ${contributor.name}:</span>
                <span class="stat-value">${contributor.commits} commits</span>
            </div>
            `).join('')}
        </div>
    `;
  }

  static generateFileSection(stats) {
    if (!stats.files || stats.files.error) {
      return '<div class="card"><h3>📁 Files</h3><p>File analysis unavailable</p></div>';
    }

    const languages = Object.entries(stats.files.languages || {})
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8);

    return `
        <div class="card">
            <h3>📁 File Analysis</h3>
            <div class="stat-item">
                <span>Total Files:</span>
                <span class="stat-value">${stats.files.total}</span>
            </div>
            <div class="stat-item">
                <span>Total Lines:</span>
                <span class="stat-value">${stats.files.totalLines.toLocaleString()}</span>
            </div>
            <div style="margin-top: 15px;">
                <strong>Languages:</strong>
                <div class="languages">
                    ${languages.map(([lang, count]) => 
                        `<span class="language-tag">${lang} (${count})</span>`
                    ).join('')}
                </div>
            </div>
        </div>
    `;
  }

  static generateActivitySection(stats) {
    const months = Object.entries(stats.commits.byMonth || {})
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12);

    const maxCommits = Math.max(...months.map(([, count]) => count));

    return `
        <div class="card">
            <h3>📈 Commit Activity (Last 12 Months)</h3>
            <div class="activity-chart">
                ${months.map(([month, count]) => {
                  const height = maxCommits > 0 ? (count / maxCommits) * 100 : 0;
                  return `
                    <div class="activity-bar">
                        <div class="bar" style="height: ${Math.max(height, 5)}%"></div>
                        <div>${month.split('-')[1]}</div>
                        <div>${count}</div>
                    </div>
                  `;
                }).join('')}
            </div>
        </div>
    `;
  }
}

module.exports = HTMLReporter;