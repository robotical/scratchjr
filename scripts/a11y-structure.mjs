import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPORT_PATH = path.join(ROOT, 'reports', 'a11y', 'structure.json');

function read(relativePath) {
    return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function countMatches(source, regex) {
    const matches = source.match(regex);
    return matches ? matches.length : 0;
}

const findings = [];

function addFinding(file, message) {
    findings.push({ file, message });
}

function requireMatch(file, regex, message) {
    if (!regex.test(read(file))) {
        addFinding(file, message);
    }
}

function forbidMatch(file, regex, message) {
    if (regex.test(read(file))) {
        addFinding(file, message);
    }
}

function requireButtonIds(file, ids) {
    const source = read(file);
    ids.forEach((id) => {
        if (!new RegExp(`<button[^>]*id="${id}"`, 's').test(source)) {
            addFinding(file, `Expected \`${id}\` to be implemented as a <button>.`);
        }
        if (new RegExp(`<div[^>]*id="${id}"`, 's').test(source)) {
            addFinding(file, `Found legacy <div> markup for \`${id}\`.`);
        }
    });
}

function requireButtonClassCount(file, className, expectedCount) {
    const source = read(file);
    const buttonCount = countMatches(source, new RegExp(`<button[^>]*class="[^"]*${className}[^"]*"`, 'g'));
    const legacyDivCount = countMatches(source, new RegExp(`<div[^>]*class="[^"]*${className}[^"]*"`, 'g'));

    if (buttonCount !== expectedCount) {
        addFinding(file, `Expected ${expectedCount} \`${className}\` buttons but found ${buttonCount}.`);
    }
    if (legacyDivCount > 0) {
        addFinding(file, `Found ${legacyDivCount} legacy <div> elements with \`${className}\`.`);
    }
}

function requireDecorativeAlt(file, className) {
    const source = read(file);
    const matches = source.match(new RegExp(`<img[^>]*class="[^"]*${className}[^"]*"[^>]*>`, 'g')) || [];
    if (matches.length === 0) {
        addFinding(file, `Expected at least one \`${className}\` image.`);
        return;
    }
    matches.forEach((match) => {
        if (!/alt=""/.test(match)) {
            addFinding(file, `Expected \`${className}\` images to use decorative alt text.`);
        }
    });
}

function requireFocusRecovery(file) {
    const source = read(file);
    if (/(outline\s*:\s*(none|0))/i.test(source) && !/:focus-visible|:focus\b/i.test(source)) {
        addFinding(file, 'Found outline suppression without a replacement focus rule.');
    }
}

requireMatch(
    'src/utils/accessibility.js',
    /export function ensureSkipLink[\s\S]*export function registerDialog[\s\S]*export function openDialog[\s\S]*export function closeDialog/,
    'Expected shared skip-link and dialog accessibility helpers.'
);
requireMatch(
    'src/entry/app.js',
    /setDocumentLanguage\(Localization\.currentLocale\)[\s\S]*setLocalizedDocumentTitle\(titleKey\)[\s\S]*ensureSkipLink\(skipLinkTargetId, Localization\.localize\('A11Y_SKIP_TO_MAIN'\)\)/,
    'Expected app bootstrap to set language, title, and skip link.'
);
requireMatch(
    'src/lobby/Lobby.js',
    /iframe\.setAttribute\('title', Lobby\.getGuideFrameTitle\(url\)\)/,
    'Expected lobby guide iframe titles to be localized.'
);

requireButtonIds('editions/free/src/home.html', [
    'logotab',
    'hometab',
    'geartab',
    'booktab',
    'tabicon',
    'abouttab',
    'interfacetab',
    'painttab',
    'blockstab',
    'privacytab'
]);

requireButtonClassCount('editions/free/src/inapp/interface.html', 'interface-button', 24);
requireButtonClassCount('editions/free/src/inapp/paint.html', 'paint-button', 13);
requireDecorativeAlt('editions/free/src/inapp/interface.html', 'ipad-project-view');
requireDecorativeAlt('editions/free/src/inapp/paint.html', 'ipad-project-view');
requireDecorativeAlt('editions/free/src/inapp/blocks.html', 'block-image');

requireMatch(
    'src/editor/ui/UI.js',
    /newButton\('flipme'[\s\S]*newButton\('addsprite'[\s\S]*newButton\('addText'[\s\S]*newButton\('changeBkg'/,
    'Expected the remaining editor shell controls to use semantic buttons.'
);
forbidMatch(
    'src/editor/ui/UI.js',
    /newHTML\('div', 'flipme'|newHTML\('div', 'addsprite'|newHTML\('div', 'addText'|newHTML\('div', 'changeBkg'/,
    'Found legacy editor shell controls still created as clickable divs.'
);

requireMatch(
    'src/editor/ui/Record.js',
    /registerDialog\(modal[\s\S]*openDialog\(gn\('recorddialog'\)\)[\s\S]*closeDialog\(gn\('recorddialog'\)\)/,
    'Expected the recording overlay to be wired through the shared dialog helper.'
);
requireMatch(
    'src/editor/ui/TutorialUI.js',
    /registerDialog\(TutorialUI\.modal[\s\S]*openDialog\(TutorialUI\.modal\)[\s\S]*closeDialog\(TutorialUI\.modal\)/,
    'Expected the tutorial modal to be wired through the shared dialog helper.'
);

requireMatch('editions/free/src/css/base.css', /\.skip-link/, 'Expected global skip-link styles.');
requireMatch('editions/free/src/css/base.css', /:focus-visible/, 'Expected global visible focus styles.');
requireMatch('editions/free/src/css/connection-modal.css', /:focus-visible/, 'Expected visible focus styles for connection buttons.');
requireMatch('editions/free/src/css/editorstage.css', /\.edittext:focus-visible/, 'Expected visible focus styles for editor text input.');
requireMatch('editions/free/src/css/editor.css', /\.textinput:focus/, 'Expected visible focus styles for the info dialog input.');

[
    'editions/free/src/css/base.css',
    'editions/free/src/css/connection-modal.css',
    'editions/free/src/css/editor.css',
    'editions/free/src/css/editorstage.css',
    'editions/free/src/css/lobby.css',
    'editions/free/src/css/thumbs.css',
    'editions/free/src/css/tutorial.css',
    'editions/free/src/inapp/style/style.css',
    'editions/free/src/inapp/style/interface.css',
    'editions/free/src/inapp/style/paint.css'
].forEach(requireFocusRecovery);

const report = {
    checkedAt: new Date().toISOString(),
    summary: {
        filesChecked: 15,
        findingCount: findings.length
    },
    findings
};

fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2) + '\n');

if (findings.length > 0) {
    console.error(`Accessibility structure scan found ${findings.length} issue(s).`);
    findings.forEach((finding) => {
        console.error(`- ${finding.file}: ${finding.message}`);
    });
    process.exit(1);
}

console.log(`Accessibility structure scan passed. Report written to ${path.relative(ROOT, REPORT_PATH)}.`);
