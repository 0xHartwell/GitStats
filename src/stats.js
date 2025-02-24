class StatsCalculator {
  
  static calculateCommitFrequency(commits) {
    if (!commits || commits.length === 0) return {};
    
    const frequency = {
      daily: {},
      weekly: {},
      hourly: {}
    };

    commits.forEach(commit => {
      const date = new Date(commit.date);
      
      // Daily frequency
      const day = date.toISOString().split('T')[0];
      frequency.daily[day] = (frequency.daily[day] || 0) + 1;
      
      // Weekly frequency (by day of week)
      const dayOfWeek = date.getDay();
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayName = dayNames[dayOfWeek];
      frequency.weekly[dayName] = (frequency.weekly[dayName] || 0) + 1;
      
      // Hourly frequency
      const hour = date.getHours();
      frequency.hourly[hour] = (frequency.hourly[hour] || 0) + 1;
    });

    return frequency;
  }

  static calculateContributorMetrics(contributors) {
    if (!contributors || contributors.length === 0) return {};
    
    const totalCommits = contributors.reduce((sum, c) => sum + c.commits, 0);
    const avgCommitsPerContributor = totalCommits / contributors.length;
    
    return {
      total: contributors.length,
      totalCommits,
      averageCommitsPerContributor: Math.round(avgCommitsPerContributor * 100) / 100,
      mostActive: contributors[0],
      distribution: this.calculateContributorDistribution(contributors)
    };
  }

  static calculateContributorDistribution(contributors) {
    const totalCommits = contributors.reduce((sum, c) => sum + c.commits, 0);
    
    return contributors.map(contributor => ({
      ...contributor,
      percentage: Math.round((contributor.commits / totalCommits) * 10000) / 100
    }));
  }

  static analyzeCommitMessages(commits) {
    if (!commits || commits.length === 0) return {};
    
    const messages = commits.map(c => c.message);
    const avgLength = messages.reduce((sum, msg) => sum + msg.length, 0) / messages.length;
    
    // Common words analysis (simple)
    const words = messages
      .join(' ')
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2);
    
    const wordCount = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
    
    const sortedWords = Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);
    
    return {
      averageLength: Math.round(avgLength * 100) / 100,
      totalMessages: messages.length,
      commonWords: sortedWords.map(([word, count]) => ({ word, count }))
    };
  }
}

module.exports = StatsCalculator;