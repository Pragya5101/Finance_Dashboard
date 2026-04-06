const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replacements = [
  { search: /slate-/g, replace: 'zinc-' },
  { search: /indigo-/g, replace: 'violet-' },
  { search: /emerald-/g, replace: 'teal-' },
  { search: /rose-/g, replace: 'orange-' },
  { search: /rounded-2xl/g, replace: 'rounded-[2rem]' },
  { search: /rounded-xl/g, replace: 'rounded-2xl' },
  { search: /shadow-sm/g, replace: 'shadow-md shadow-black/5' },
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.css') || file.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      for (const { search, replace } of replacements) {
        if (content.match(search)) {
          content = content.replace(search, replace);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

processDirectory(srcDir);
console.log('Reskin complete');
