const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replacements = [
  { 
    search: 'bg-white dark:bg-zinc-800', 
    replace: 'bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl' 
  },
  {
    search: 'border border-zinc-100 dark:border-zinc-700 shadow-md shadow-black/5',
    replace: 'border border-zinc-200/50 dark:border-white/10 shadow-xl shadow-black/5'
  },
  {
    search: 'bg-white dark:bg-zinc-900/50',
    replace: 'bg-white/50 dark:bg-slate-800/50 backdrop-blur-md'
  },
  {
    search: 'bg-zinc-50 dark:bg-zinc-900/50',
    replace: 'bg-zinc-50/50 dark:bg-slate-800/40 backdrop-blur-md'
  },
  {
    search: 'bg-indigo-600',
    replace: 'bg-gradient-to-r from-violet-600 to-cyan-600'
  },
  {
    search: 'bg-violet-600',
    replace: 'bg-gradient-to-r from-violet-600 to-cyan-500'
  }
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      for (const { search, replace } of replacements) {
        if (content.includes(search)) {
          content = content.replace(new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replace);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Glassified: ${fullPath}`);
      }
    }
  }
}

processDirectory(srcDir);
console.log('Glassification complete');
