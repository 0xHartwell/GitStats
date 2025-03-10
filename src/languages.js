class LanguageDetector {
  
  static getLanguageConfig() {
    return {
      // Web Technologies
      '.js': { name: 'JavaScript', category: 'Web', color: '#f7df1e' },
      '.jsx': { name: 'React', category: 'Web', color: '#61dafb' },
      '.ts': { name: 'TypeScript', category: 'Web', color: '#3178c6' },
      '.tsx': { name: 'React TypeScript', category: 'Web', color: '#61dafb' },
      '.vue': { name: 'Vue.js', category: 'Web', color: '#4fc08d' },
      '.svelte': { name: 'Svelte', category: 'Web', color: '#ff3e00' },
      '.html': { name: 'HTML', category: 'Web', color: '#e34f26' },
      '.htm': { name: 'HTML', category: 'Web', color: '#e34f26' },
      '.css': { name: 'CSS', category: 'Web', color: '#1572b6' },
      '.scss': { name: 'SCSS', category: 'Web', color: '#cf649a' },
      '.sass': { name: 'Sass', category: 'Web', color: '#cf649a' },
      '.less': { name: 'LESS', category: 'Web', color: '#1d365d' },
      '.styl': { name: 'Stylus', category: 'Web', color: '#ff6347' },

      // Backend Languages
      '.py': { name: 'Python', category: 'Backend', color: '#3776ab' },
      '.java': { name: 'Java', category: 'Backend', color: '#ed8b00' },
      '.kt': { name: 'Kotlin', category: 'Backend', color: '#7f52ff' },
      '.scala': { name: 'Scala', category: 'Backend', color: '#dc322f' },
      '.rb': { name: 'Ruby', category: 'Backend', color: '#cc342d' },
      '.php': { name: 'PHP', category: 'Backend', color: '#777bb4' },
      '.go': { name: 'Go', category: 'Backend', color: '#00add8' },
      '.rs': { name: 'Rust', category: 'Backend', color: '#000000' },
      '.cs': { name: 'C#', category: 'Backend', color: '#239120' },
      '.fs': { name: 'F#', category: 'Backend', color: '#378bba' },
      '.vb': { name: 'Visual Basic', category: 'Backend', color: '#945db7' },

      // System Languages
      '.c': { name: 'C', category: 'System', color: '#a8b9cc' },
      '.cpp': { name: 'C++', category: 'System', color: '#00599c' },
      '.cc': { name: 'C++', category: 'System', color: '#00599c' },
      '.cxx': { name: 'C++', category: 'System', color: '#00599c' },
      '.h': { name: 'C/C++ Header', category: 'System', color: '#a8b9cc' },
      '.hpp': { name: 'C++ Header', category: 'System', color: '#00599c' },
      '.asm': { name: 'Assembly', category: 'System', color: '#6e4c13' },
      '.s': { name: 'Assembly', category: 'System', color: '#6e4c13' },

      // Functional Languages
      '.hs': { name: 'Haskell', category: 'Functional', color: '#5d4f85' },
      '.elm': { name: 'Elm', category: 'Functional', color: '#60b5cc' },
      '.clj': { name: 'Clojure', category: 'Functional', color: '#5881d8' },
      '.cljs': { name: 'ClojureScript', category: 'Functional', color: '#5881d8' },
      '.ml': { name: 'OCaml', category: 'Functional', color: '#3be133' },
      '.fs': { name: 'F#', category: 'Functional', color: '#378bba' },
      '.ex': { name: 'Elixir', category: 'Functional', color: '#6e4a7e' },
      '.exs': { name: 'Elixir', category: 'Functional', color: '#6e4a7e' },
      '.erl': { name: 'Erlang', category: 'Functional', color: '#b83998' },

      // Mobile
      '.swift': { name: 'Swift', category: 'Mobile', color: '#fa7343' },
      '.m': { name: 'Objective-C', category: 'Mobile', color: '#438eff' },
      '.mm': { name: 'Objective-C++', category: 'Mobile', color: '#438eff' },
      '.dart': { name: 'Dart', category: 'Mobile', color: '#0175c2' },

      // Scripting
      '.sh': { name: 'Shell Script', category: 'Scripting', color: '#89e051' },
      '.bash': { name: 'Bash', category: 'Scripting', color: '#89e051' },
      '.zsh': { name: 'Zsh', category: 'Scripting', color: '#89e051' },
      '.fish': { name: 'Fish', category: 'Scripting', color: '#89e051' },
      '.ps1': { name: 'PowerShell', category: 'Scripting', color: '#012456' },
      '.bat': { name: 'Batch', category: 'Scripting', color: '#c1f12e' },
      '.cmd': { name: 'Command Script', category: 'Scripting', color: '#c1f12e' },
      '.awk': { name: 'AWK', category: 'Scripting', color: '#c7aa06' },
      '.sed': { name: 'Sed', category: 'Scripting', color: '#64b970' },

      // Data & Config
      '.json': { name: 'JSON', category: 'Data', color: '#292929' },
      '.xml': { name: 'XML', category: 'Data', color: '#0060ac' },
      '.yaml': { name: 'YAML', category: 'Data', color: '#cb171e' },
      '.yml': { name: 'YAML', category: 'Data', color: '#cb171e' },
      '.toml': { name: 'TOML', category: 'Data', color: '#9c4221' },
      '.ini': { name: 'INI', category: 'Data', color: '#d1dae3' },
      '.conf': { name: 'Config', category: 'Data', color: '#d1dae3' },
      '.cfg': { name: 'Config', category: 'Data', color: '#d1dae3' },
      '.env': { name: 'Environment', category: 'Data', color: '#faf047' },

      // Database
      '.sql': { name: 'SQL', category: 'Database', color: '#e38c00' },
      '.psql': { name: 'PostgreSQL', category: 'Database', color: '#336791' },
      '.mysql': { name: 'MySQL', category: 'Database', color: '#4479a1' },

      // Documentation
      '.md': { name: 'Markdown', category: 'Documentation', color: '#083fa1' },
      '.mdx': { name: 'MDX', category: 'Documentation', color: '#1b1f24' },
      '.rst': { name: 'reStructuredText', category: 'Documentation', color: '#141414' },
      '.tex': { name: 'LaTeX', category: 'Documentation', color: '#3d6117' },
      '.adoc': { name: 'AsciiDoc', category: 'Documentation', color: '#73a83f' },

      // Build & Package
      'Dockerfile': { name: 'Docker', category: 'DevOps', color: '#0db7ed' },
      'Makefile': { name: 'Makefile', category: 'Build', color: '#427819' },
      'makefile': { name: 'Makefile', category: 'Build', color: '#427819' },
      'CMakeLists.txt': { name: 'CMake', category: 'Build', color: '#064f8c' },
      'package.json': { name: 'npm Package', category: 'Package', color: '#cb3837' },
      'Cargo.toml': { name: 'Cargo Package', category: 'Package', color: '#000000' },
      'requirements.txt': { name: 'Python Requirements', category: 'Package', color: '#3776ab' },
      'Gemfile': { name: 'Ruby Gem', category: 'Package', color: '#cc342d' },
      'composer.json': { name: 'Composer Package', category: 'Package', color: '#885630' },

      // Other
      '.r': { name: 'R', category: 'Data Science', color: '#198ce7' },
      '.R': { name: 'R', category: 'Data Science', color: '#198ce7' },
      '.jl': { name: 'Julia', category: 'Data Science', color: '#9558b2' },
      '.nb': { name: 'Mathematica', category: 'Data Science', color: '#dd1100' },
      '.m': { name: 'MATLAB', category: 'Data Science', color: '#e16737' },
      '.pl': { name: 'Perl', category: 'Scripting', color: '#0073e6' },
      '.lua': { name: 'Lua', category: 'Scripting', color: '#000080' },
      '.vim': { name: 'Vim Script', category: 'Config', color: '#019733' },
      '.zig': { name: 'Zig', category: 'System', color: '#ec915c' },
    };
  }

  static detectLanguage(filename) {
    const langConfig = this.getLanguageConfig();
    const ext = filename.toLowerCase();
    
    // Check exact filename matches first (like Dockerfile, Makefile)
    if (langConfig[filename]) {
      return langConfig[filename];
    }
    
    // Then check file extensions
    const dotIndex = filename.lastIndexOf('.');
    if (dotIndex !== -1) {
      const extension = filename.substring(dotIndex);
      if (langConfig[extension]) {
        return langConfig[extension];
      }
    }
    
    return null;
  }

  static getLanguageStats(files) {
    const stats = {
      byLanguage: {},
      byCategory: {},
      total: 0
    };

    files.forEach(file => {
      const lang = this.detectLanguage(file.name);
      if (lang) {
        stats.byLanguage[lang.name] = (stats.byLanguage[lang.name] || 0) + 1;
        stats.byCategory[lang.category] = (stats.byCategory[lang.category] || 0) + 1;
        stats.total++;
      }
    });

    return stats;
  }

  static getPopularLanguages() {
    return [
      'JavaScript', 'Python', 'Java', 'TypeScript', 'C++', 'C#', 'PHP', 'C',
      'Go', 'Rust', 'Ruby', 'Swift', 'Kotlin', 'Dart', 'Scala', 'HTML', 'CSS'
    ];
  }

  static isWebTechnology(language) {
    const webTechs = [
      'JavaScript', 'TypeScript', 'HTML', 'CSS', 'React', 'Vue.js', 'Svelte',
      'SCSS', 'Sass', 'LESS', 'Stylus', 'React TypeScript'
    ];
    return webTechs.includes(language);
  }

  static getLanguageColor(language) {
    const langConfig = this.getLanguageConfig();
    for (const [key, config] of Object.entries(langConfig)) {
      if (config.name === language) {
        return config.color;
      }
    }
    return '#666666'; // Default gray
  }
}

module.exports = LanguageDetector;