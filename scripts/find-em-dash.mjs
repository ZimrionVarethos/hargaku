import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      if (!full.includes('node_modules') && !full.includes('.next') && !full.includes('.git')) {
        results = results.concat(walk(full));
      }
    } else if (full.endsWith('.ts') || full.endsWith('.tsx') || full.endsWith('.js') || full.endsWith('.mjs')) {
      results.push(full);
    }
  });
  return results;
}

const files = walk('./src');
let totalMatches = 0;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('—')) {
    const lines = content.split('\n');
    lines.forEach((l, idx) => {
      if (l.includes('—')) {
        console.log(`${file}:${idx + 1}: ${l.trim().slice(0, 100)}`);
        totalMatches++;
      }
    });
  }
});

console.log('Total em-dash occurrences found:', totalMatches);

