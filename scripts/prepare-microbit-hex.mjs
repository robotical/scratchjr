import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

const require = createRequire(import.meta.url);
const JSZip = require('jszip');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const sourceUrl = 'https://downloads.scratch.mit.edu/microbit/scratch-microbit.hex.zip';
const outputPath = path.join(projectRoot, 'src', 'assets', 'microbit', 'scratch-microbit.hex');
const expectedHexSha256 = '6a0cc7c2927ef53c8a8e8e26b8df06778f0a9896af49a98b285f51fff58c53e2';

async function prepareMicroBitHex () {
    console.info(`Downloading ${sourceUrl}`);
    const response = await fetch(sourceUrl);
    if (!response.ok) {
        throw new Error(`Could not download the micro:bit HEX archive: HTTP ${response.status}`);
    }

    const archive = new JSZip(Buffer.from(await response.arrayBuffer()));
    const hexEntryName = Object.keys(archive.files).find(fileName =>
        !archive.files[fileName].dir && /\.hex$/i.test(fileName)
    );
    if (!hexEntryName) {
        throw new Error('The micro:bit HEX archive did not contain a HEX file.');
    }

    const hexData = archive.file(hexEntryName).asNodeBuffer();
    const actualHexSha256 = createHash('sha256').update(hexData).digest('hex');
    if (actualHexSha256 !== expectedHexSha256) {
        throw new Error(
            `The downloaded micro:bit HEX failed its integrity check. ` +
            `Expected ${expectedHexSha256}, received ${actualHexSha256}.`
        );
    }
    await fs.mkdir(path.dirname(outputPath), {recursive: true});
    await fs.writeFile(outputPath, hexData);
    console.info(`Wrote ${path.relative(projectRoot, outputPath)}`);
}

prepareMicroBitHex().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
