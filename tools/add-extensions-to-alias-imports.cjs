const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const srcRoot = path.join(repoRoot, 'src');

function posixPath(p) {
  return p.split(path.sep).join('/');
}

function findExisting(pathWithoutExt) {
  const exts = ['.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx', '/index.js', '/index.jsx'];
  for (const e of exts) {
    const candidate = path.join(srcRoot, pathWithoutExt + e);
    if (fs.existsSync(candidate)) return e.startsWith('/') ? e.slice(1) : e; // return extension or 'index.ts'
  }
  return null;
}

function processFile(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const importRegex = /(import\s+[\s\S]+?\s+from\s+['"])(@\/[^'"\n]+)(['"])/g;
  const exportRegex = /(export\s+[\s\S]+?\s+from\s+['"])(@\/[^'"\n]+)(['"])/g;
  let changed = false;
  let newText = text.replace(importRegex, (m, p1, p2, p3) => {
    const withoutAt = p2.replace(/^@\//, '');
    const ext = findExisting(withoutAt);
    if (ext) {
      changed = true;
      // if ext is 'index.ts', convert to '/index.ts' then remove '/index' to point to directory? Keep explicit file
      if (ext.startsWith('index')) {
        return p1 + `@/${withoutAt}/${ext}` + p3;
      }
      return p1 + `@/${withoutAt}${ext}` + p3;
    }
    return m;
  });
  newText = newText.replace(exportRegex, (m, p1, p2, p3) => {
    const withoutAt = p2.replace(/^@\//, '');
    const ext = findExisting(withoutAt);
    if (ext) {
      changed = true;
      if (ext.startsWith('index')) {
        return p1 + `@/${withoutAt}/${ext}` + p3;
      }
      return p1 + `@/${withoutAt}${ext}` + p3;
    }
    return m;
  });
  if (changed) {
    fs.writeFileSync(filePath, newText, 'utf8');
    console.log('Patched', filePath);
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

console.log('Adding explicit extensions to @/ imports where matching files exist');
walk(srcRoot);
console.log('Done.');
