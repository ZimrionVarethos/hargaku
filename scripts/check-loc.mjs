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
    } else if (full.endsWith('.ts') || full.endsWith('.tsx') || full.endsWith('.css')) {
      results.push(full);
    }
  });
  return results;
}

const files = walk('./src');
let over300 = [];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n').length;
  if (lines > 300) {
    over300.push({ file, lines });
  }
});

console.log('Total files checked:', files.length);
if (over300.length > 0) {
  console.log('Files over 300 LOC:', over300);
} else {
  console.log('ALL files in src/ are <= 300 LOC! PASS!');
}

