const fs = require('fs');
const path = require('path');

// Directory containing the localization files
const dir = __dirname;

// Find all .json files in the directory
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
if (!files.includes('en.json')) {
  console.error('en.json not found in the directory.');
  process.exit(1);
}

// Load all language files
const languages = files.map(f => ({
  code: path.basename(f, '.json'),
  data: JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))
}));

// Use en.json as the master key list
const en = languages.find(l => l.code === 'en');
const keys = Object.keys(en.data);

// Prepare CSV header
const header = ['key', ...languages.map(l => l.code)];
const rows = [header];

// Prepare each row
for (const key of keys) {
  const row = [key];
  for (const lang of languages) {
    row.push(lang.data[key] !== undefined ? lang.data[key] : '');
  }
  rows.push(row);
}

// Escape CSV values
function escapeCsv(val) {
  if (typeof val !== 'string') val = String(val);
  if (val.includes('"') || val.includes(',') || val.includes('\n')) {
    return '"' + val.replace(/"/g, '""') + '"';
  }
  return val;
}

// Write CSV
const csv = rows.map(row => row.map(escapeCsv).join(',')).join('\n');
fs.writeFileSync(path.join(dir, 'localizations.csv'), csv, 'utf8');
console.log('localizations.csv generated successfully.');
