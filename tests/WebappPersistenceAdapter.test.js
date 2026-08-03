import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const webappInterface = vi.hoisted(() => ({
    database_stmt: vi.fn(),
    io_cleanassets: vi.fn(),
    io_remove: vi.fn(),
    io_setmedia: vi.fn(),
    io_setmedianame: vi.fn()
}));

vi.mock('@/webapp-interface/WebappInterface', () => ({
    default: webappInterface
}));

import Webapp from '@/tablet/Webapp';

const adapterCases = [
    {
        invoke: (callback) => Webapp.stmt({ stmt: 'insert into projects values (?)', values: ['project'] }, callback),
        method: 'database_stmt',
        name: 'stmt',
        value: 42
    },
    {
        invoke: (callback) => Webapp.remove('thumbnail.png', callback),
        method: 'io_remove',
        name: 'remove',
        value: true
    },
    {
        invoke: (callback) => Webapp.setmedia('encoded media', 'svg', callback),
        method: 'io_setmedia',
        name: 'setmedia',
        value: 'sprite.svg'
    },
    {
        invoke: (callback) => Webapp.setmedianame('encoded media', 'thumbnail', 'png', callback),
        method: 'io_setmedianame',
        name: 'setmedianame',
        value: 'thumbnail.png'
    }
];

describe('Webapp persistence callback adapters', () => {
    let warnSpy;

    beforeEach(() => {
        for (const method of Object.values(webappInterface)) {
            method.mockReset();
        }
        warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
        warnSpy.mockRestore();
    });

    it.each(adapterCases)('forwards the successful $name result unchanged', async ({ invoke, method, value }) => {
        webappInterface[method].mockResolvedValue(value);
        const callback = vi.fn();

        await expect(invoke(callback)).resolves.toBeUndefined();

        expect(callback).toHaveBeenCalledOnce();
        expect(callback).toHaveBeenCalledWith(value);
        expect(warnSpy).not.toHaveBeenCalled();
    });

    it.each(adapterCases)('contains a rejected $name persistence call and reports null', async ({ invoke, method, name }) => {
        const error = new Error(`${name} persistence failed`);
        webappInterface[method].mockRejectedValue(error);
        const callback = vi.fn();

        await expect(invoke(callback)).resolves.toBeUndefined();

        expect(callback).toHaveBeenCalledOnce();
        expect(callback).toHaveBeenCalledWith(null);
        expect(warnSpy).toHaveBeenCalledOnce();
        expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining(name), error);
    });

    it('completes non-critical cleanup after containing a persistence rejection', async () => {
        const error = new Error('cleanup persistence failed');
        webappInterface.io_cleanassets.mockRejectedValue(error);
        const callback = vi.fn();

        await expect(Webapp.cleanassets('svg', callback)).resolves.toBeUndefined();

        expect(callback).toHaveBeenCalledOnce();
        expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('cleanassets'), error);
    });
});
