import {afterAll, beforeAll, describe, expect, it} from 'vitest';
import puppeteer from 'puppeteer';
import http from 'http';
import fs from 'fs';
import path from 'path';

let server;
let host;
const root = path.resolve('editions/free/src');
const wave = Buffer.alloc(44 + 16000 * 6 * 2);
wave.write('RIFF', 0); wave.writeUInt32LE(wave.length - 8, 4); wave.write('WAVEfmt ', 8);
wave.writeUInt32LE(16, 16); wave.writeUInt16LE(1, 20); wave.writeUInt16LE(1, 22);
wave.writeUInt32LE(16000, 24); wave.writeUInt32LE(32000, 28);
wave.writeUInt16LE(2, 32); wave.writeUInt16LE(16, 34);
wave.write('data', 36); wave.writeUInt32LE(wave.length - 44, 40);

beforeAll(async () => {
    server = http.createServer((request, response) => {
        const url = new URL(request.url, 'http://localhost');
        if (url.pathname === '/favicon.ico') { response.writeHead(204); response.end(); return; }
        const filename = url.pathname === '/__narration-host' ?
            path.resolve('tests/fixtures/narration-host.html') : path.join(root, decodeURIComponent(url.pathname));
        const mime = {'.html': 'text/html', '.js': 'application/javascript', '.json': 'application/json',
            '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.wasm': 'application/wasm'};
        fs.readFile(filename, (error, data) => {
            response.writeHead(error ? 404 : 200, {'Content-Type': mime[path.extname(filename)] || 'application/octet-stream'});
            response.end(error ? 'Missing test asset' : data);
        });
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    host = `http://127.0.0.1:${server.address().port}`;
});

afterAll(async () => {
    if (server) await new Promise(resolve => server.close(resolve));
});

async function openActivity () {
    const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox']});
    try {
        const page = await browser.newPage();
        await page.setViewport({width: 1024, height: 720});
        const errors = [];
        page.on('pageerror', error => errors.push(String(error)));
        await page.evaluateOnNewDocument(() => {
            window.deviceAudioStarts = 0;
            window.normalSpeech = [];
            window.normalSpeechCancels = 0;
            const start = AudioBufferSourceNode.prototype.start;
            AudioBufferSourceNode.prototype.start = function () {
                window.deviceAudioStarts++;
                return start.apply(this, arguments);
            };
            Object.defineProperty(window, 'speechSynthesis', {configurable: true, value: {
                speak: function (utterance) { window.normalSpeech.push({text: utterance.text, lang: utterance.lang}); },
                cancel: function () { window.normalSpeechCancels++; }
            }});
            window.SpeechSynthesisUtterance = function (text) { this.text = text; };
        });
        const requests = [];
        const control = {mode: 'ok', held: null};
        const headers = {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'};
        await page.setRequestInterception(true);
        page.on('request', request => {
            if (!request.url().endsWith('/activity-narration')) { request.continue(); return; }
            if (request.method() === 'OPTIONS') { request.respond({status: 204, headers}); return; }
            requests.push(JSON.parse(request.postData()));
            if (control.mode === 'pending') { control.held = request; return; }
            request.respond(control.mode === 'quota' ? {status: 429, headers, contentType: 'application/json', body: '{}'} :
                {status: 200, headers, contentType: 'audio/wav', body: wave});
        });
        await page.goto(`${host}/__narration-host`, {waitUntil: 'domcontentloaded', timeout: 30000});
        let frame;
        const deadline = Date.now() + 30000;
        while (!frame && Date.now() < deadline) {
            frame = page.frames().find(candidate => candidate.url().includes('/editor.html'));
            if (!frame) await new Promise(resolve => setTimeout(resolve, 50));
        }
        if (!frame) throw new Error('Editor did not load');
        await frame.waitForSelector('#tutorialReadAloud', {visible: true, timeout: 30000});
        return {browser, page, frame, requests, control, errors};
    } catch (error) {
        await browser.close();
        throw error;
    }
}

describe('activity Azure narration', () => {
    it('shows Marty after verification, streams with pinwheel feedback, and switches to device audio', async () => {
        const {browser, page, frame, requests, errors} = await openActivity();
        try {
            expect(await frame.$eval('#tutorialMartyReadAloud', button => button.hidden)).toBe(true);
            await page.click('#connectMockMarty');
            expect(await frame.$eval('#tutorialMartyReadAloud', button => button.hidden)).toBe(true);
            await page.click('#verifyMockMarty');
            await frame.waitForFunction(() => !document.getElementById('tutorialMartyReadAloud').hidden);
            await frame.click('#tutorialMartyReadAloud');
            await page.waitForFunction(() => window.narrationEvents.some(event => event.streamBytes));
            const events = await page.evaluate(() => window.narrationEvents);
            expect(events[0].command).toBe('led/LEDeye/pattern/pinwheel');
            expect(events[1]).toMatchObject({clearExisting: true, duration: 6000});
            expect(events[1].streamBytes).toBeGreaterThan(1000);
            expect(requests).toHaveLength(1);
            expect(requests[0].text).not.toMatch(/<[^>]+>/);

            await frame.click('#tutorialReadAloud');
            await frame.waitForFunction(() => window.deviceAudioStarts === 1);
            expect(await page.evaluate(() => window.narrationEvents.map(event => event.command).filter(Boolean)))
                .toEqual(['led/LEDeye/pattern/pinwheel', 'audio/stop', 'led/LEDeye/off']);
            expect(requests).toHaveLength(1); // Both outputs share the unchanged Azure recording.
            await frame.click('#tutorialReadAloud');
            await page.click('#disconnectMockMarty');
            await frame.waitForFunction(() => document.getElementById('tutorialMartyReadAloud').hidden);
            expect(await frame.$eval('#tutorialReadAloud', button => button.hidden)).toBe(false);
            expect(errors).toEqual([]);
        } finally { await browser.close(); }
    }, 60000);

    it('cancels a late Azure reply on step changes and silently falls back after a quota error', async () => {
        const {browser, frame, requests, control, errors} = await openActivity();
        try {
            control.mode = 'pending';
            await frame.click('#tutorialReadAloud');
            const deadline = Date.now() + 5000;
            while (!control.held && Date.now() < deadline) await new Promise(resolve => setTimeout(resolve, 10));
            expect(control.held).not.toBeNull();
            await frame.click('#nextStep');
            await control.held.respond({status: 200, contentType: 'audio/wav',
                headers: {'Access-Control-Allow-Origin': '*'}, body: wave}).catch(() => {});
            expect(await frame.evaluate(() => window.deviceAudioStarts)).toBe(0);
            expect(await frame.$eval('#tutorialReadAloud', button => button.getAttribute('aria-pressed'))).toBe('false');
            control.mode = 'quota';
            await frame.click('#tutorialReadAloud');
            await frame.waitForFunction(() => window.normalSpeech.length === 1);
            expect(requests).toHaveLength(2);
            expect(await frame.evaluate(() => window.normalSpeech[0].text)).toBe(requests[1].text);
            expect(await frame.$$('[role="alert"]')).toHaveLength(0);
            await frame.click('#nextStep');
            expect(await frame.$eval('#tutorialReadAloud', button => button.getAttribute('aria-pressed'))).toBe('false');
            expect(await frame.evaluate(() => window.normalSpeechCancels)).toBeGreaterThan(0);
            expect(errors).toEqual([]);
        } finally { await browser.close(); }
    }, 60000);
});
