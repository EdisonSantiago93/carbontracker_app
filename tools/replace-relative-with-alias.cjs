const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const srcRoot = path.join(repoRoot, 'src');

function posixPath(p) {
  return p.split(path.sep).join('/');
}

function isInsideSrc(resolved) {
  const rel = path.relative(srcRoot, resolved);
  return !rel.startsWith('..') && !path.isAbsolute(rel) ? rel : null;
}

function processFile(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const importRegex = /(import\s+[\s\S]+?\s+from\s+['"])([^'"\n]+)(['"])/g;
  const exportRegex = /(export\s+[\s\S]+?\s+from\s+['"])([^'"\n]+)(['"])/g;
  let changed = false;
  let newText = text.replace(importRegex, (m, p1, p2, p3) => {
    if (!p2.startsWith('.')) return m; // skip absolute or package imports
    const resolved = path.resolve(path.dirname(filePath), p2);
    const relToSrc = isInsideSrc(resolved);
    if (relToSrc !== null) {
      // build alias path without extensions
      let relPosix = posixPath(relToSrc);
      // remove any .ts/.tsx/.js/.jsx extension
      relPosix = relPosix.replace(/\.(ts|tsx|js|jsx)$/, '');
      changed = true;
      return p1 + `@/${relPosix}` + p3;
    }
    return m;
  });
  newText = newText.replace(exportRegex, (m, p1, p2, p3) => {
    if (!p2.startsWith('.')) return m;
    const resolved = path.resolve(path.dirname(filePath), p2);
    const relToSrc = isInsideSrc(resolved);
    if (relToSrc !== null) {
      let relPosix = posixPath(relToSrc);
      relPosix = relPosix.replace(/\.(ts|tsx|js|jsx)$/, '');
      changed = true;
      return p1 + `@/${relPosix}` + p3;
    }
    return m;
  });

  if (changed) {
    fs.writeFileSync(filePath, newText, 'utf8');
    console.log('Updated', filePath);
  }
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === 'node_modules' || ent.name === '.git') continue;
      walk(full);
    } else if (ent.isFile()) {
      if (/\.(js|jsx|ts|tsx)$/.test(ent.name)) {
        processFile(full);
      }
    }
  }
}

console.log('Running codemod: replace relative imports that resolve into src/ with @/...');
walk(srcRoot);
console.log('Done.');
