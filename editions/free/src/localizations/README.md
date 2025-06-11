# Localization CSV Workflow

This project provides two Node.js scripts to simplify the translation process by converting between per-language JSON localization files and a flat CSV file:

- **localizations-to-csv.js**: Reads all language JSON files (e.g., `en.json`, `fr.json`, etc.) and writes out a single `localizations.csv` file.
- **csv-to-localizations.js**: Reads `localizations.csv` and reconstructs the per-language JSON files.

---

## Setup

Both scripts require Node.js. The `csv-to-localizations.js` script also requires the [`csv-parse`](https://www.npmjs.com/package/csv-parse) package.

Install dependencies (if needed):

```bash
npm install csv-parse
```

---

## 1. localizations-to-csv.js

Generates a flat `localizations.csv` from your per-language JSON files.

**Usage:**

```bash
node localizations-to-csv.js
```

- **Input:** All `*.json` localization files in the same directory (must include `en.json` as the master key list).
- **Output:** `localizations.csv`

The script will:

1. Read all JSON files in the directory.
2. Use `en.json` as the master list of keys.
3. For each key, collect the translation from each language file.
4. Write a CSV file with columns: `key`, and one column per language (e.g., `en`, `fr`, `de`).
5. Escape fields containing commas, quotes, or newlines.

**CSV Example:**

```csv
key,en,fr
MY_PROJECTS,My Projects,Mes Projets
ABOUT_SCRATCHJR,About ScratchJr,À propos de ScratchJr
```

---

## 2. csv-to-localizations.js

Reconstructs the per-language JSON files from `localizations.csv`.

**Usage:**

```bash
node csv-to-localizations.js
```

- **Input:** `localizations.csv` (must be in the same directory as `en.json`)
- **Output:** One JSON file per language (e.g., `en.json`, `fr.json`, etc.)

The script will:

1. Read and parse the CSV file.
2. Use the header row to determine language codes.
3. For each row, assign the translation string for each language and key.
4. Only include keys that exist in `en.json` (to avoid obsolete keys).
5. Write out a JSON file for each language.

---

## Notes

- The workflow ensures that all language files stay in sync with the master `en.json`.
- Only keys present in `en.json` are included in the output files.
- Fields containing commas, quotes, or newlines are properly escaped in the CSV.

---

## Customization

- To add a new language, add a column to the CSV and re-run `csv-to-localizations.js`.
- To update translations, edit the CSV and regenerate the JSON files.

---

This workflow makes it easy to manage translations in bulk using spreadsheet tools, while keeping your app’s localization files up to date and consistent.
