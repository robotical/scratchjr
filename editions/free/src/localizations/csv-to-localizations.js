const fs = require('fs');
const path = require('path');
const parse = require('csv-parse/sync').parse;

const dir = __dirname;
const csvPath = path.join(dir, 'localizations.csv');
if (!fs.existsSync(csvPath)) {
  console.error('localizations.csv not found.');
  process.exit(1);
}

const csv = fs.readFileSync(csvPath, 'utf8');
const records = parse(csv, { columns: true, skip_empty_lines: true });

// Load the original en.json keys
const enJsonPath = path.join(dir, 'en.json');
const enJson = JSON.parse(fs.readFileSync(enJsonPath, 'utf8'));
const allowedKeys = new Set(Object.keys(enJson));

// Get language codes from header (excluding 'key')
const header = Object.keys(records[0]);
const langCodes = header.filter(h => h !== 'key');

// Build language objects
const langObjs = {};
for (const code of langCodes) {
  langObjs[code] = {};
}

for (const row of records) {
  const key = row['key'];
  if (!allowedKeys.has(key)) continue;
  for (const code of langCodes) {
    langObjs[code][key] = row[code] !== undefined ? row[code] : '';
  }
}

// Write out each language file
for (const code of langCodes) {
  const outPath = path.join(dir, code + '.json');
  fs.writeFileSync(outPath, JSON.stringify(langObjs[code], null, 2), 'utf8');
  console.log(`Wrote ${outPath}`);
}
