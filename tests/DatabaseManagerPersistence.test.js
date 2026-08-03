import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const fsWeb = vi.hoisted(() => ({
    readFile: vi.fn(),
    readdir: vi.fn(),
    writeFile: vi.fn()
}));

vi.mock('fs-web', () => fsWeb);
vi.mock('sql.js', () => ({
    default: vi.fn()
}));
vi.mock('!!file-loader?name=sql-wasm-[contenthash].wasm!sql.js/dist/sql-wasm.wasm', () => ({
    default: 'sql-wasm.wasm'
}));

import DatabaseManager from '@/webapp-interface/DatabaseManager';
import ScratchJRDataStore from '@/webapp-interface/ScratchJRDataStore';

function deferred() {
    let resolve;
    let reject;
    const promise = new Promise((resolvePromise, rejectPromise) => {
        resolve = resolvePromise;
        reject = rejectPromise;
    });
    return { promise, reject, resolve };
}

function exportedDatabase(...snapshots) {
    return {
        export: vi.fn(() => {
            const snapshot = snapshots.shift();
            if (!snapshot) {
                throw new Error('Test exhausted its database snapshots');
            }
            return Uint8Array.from(snapshot);
        })
    };
}

describe('DatabaseManager phone persistence', () => {
    let logSpy;

    beforeEach(() => {
        fsWeb.readFile.mockReset();
        fsWeb.readdir.mockReset();
        fsWeb.writeFile.mockReset();
        global.window = {
            atob: (value) => Buffer.from(value, 'base64').toString('binary'),
            btoa: (value) => Buffer.from(value, 'binary').toString('base64'),
            localStorage: {
                getItem: vi.fn(),
                removeItem: vi.fn(),
                setItem: vi.fn()
            }
        };
        logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        logSpy.mockRestore();
        delete global.window;
    });

    it('rejects a save when the device-local write reports failure', async () => {
        fsWeb.writeFile.mockResolvedValue(undefined);
        window.applicationManager = {
            isPhoneApp: () => true,
            saveFileOnDeviceLocalStorage: vi.fn().mockResolvedValue(false)
        };

        const manager = new DatabaseManager('/ScratchJR/scratchjr.sqllite', '/ScratchJR');
        manager.db = exportedDatabase([1, 2, 3]);

        await expect(manager.save()).rejects.toThrow(/device.local|local storage/i);
        expect(window.applicationManager.saveFileOnDeviceLocalStorage).toHaveBeenCalledOnce();
        expect(window.localStorage.setItem).toHaveBeenCalledWith(
            'scratchjrDeviceLocalStorageOutOfSync',
            'true'
        );
    });

    it('rejects and marks a bridge timeout response as a failed device-local save', async () => {
        fsWeb.writeFile.mockResolvedValue(undefined);
        window.applicationManager = {
            isPhoneApp: () => true,
            saveFileOnDeviceLocalStorage: vi.fn().mockResolvedValue({ error: 'Timeout' })
        };

        const manager = new DatabaseManager('/ScratchJR/scratchjr.sqllite', '/ScratchJR');
        manager.db = exportedDatabase([1, 2, 3]);

        await expect(manager.save()).rejects.toThrow(/device.local|local storage/i);
        expect(window.localStorage.setItem).toHaveBeenCalledWith(
            'scratchjrDeviceLocalStorageOutOfSync',
            'true'
        );
    });

    it('marks a rejected device-local write as out of sync', async () => {
        fsWeb.writeFile.mockResolvedValue(undefined);
        window.applicationManager = {
            isPhoneApp: () => true,
            saveFileOnDeviceLocalStorage: vi.fn().mockRejectedValue(new Error('Bridge unavailable'))
        };

        const manager = new DatabaseManager('/ScratchJR/scratchjr.sqllite', '/ScratchJR');
        manager.db = exportedDatabase([1, 2, 3]);

        await expect(manager.save()).rejects.toThrow('Bridge unavailable');
        expect(window.localStorage.setItem).toHaveBeenCalledWith(
            'scratchjrDeviceLocalStorageOutOfSync',
            'true'
        );
    });

    it('marks a synchronous device-local write failure as out of sync', async () => {
        fsWeb.writeFile.mockResolvedValue(undefined);
        window.applicationManager = {
            isPhoneApp: () => true,
            saveFileOnDeviceLocalStorage: vi.fn(() => {
                throw new Error('Native bridge threw');
            })
        };

        const manager = new DatabaseManager('/ScratchJR/scratchjr.sqllite', '/ScratchJR');
        manager.db = exportedDatabase([1, 2, 3]);

        await expect(manager.save()).rejects.toThrow('Native bridge threw');
        expect(window.localStorage.setItem).toHaveBeenCalledWith(
            'scratchjrDeviceLocalStorageOutOfSync',
            'true'
        );
    });

    it('clears the out-of-sync marker after a confirmed device-local save', async () => {
        fsWeb.writeFile.mockResolvedValue(undefined);
        window.applicationManager = {
            isPhoneApp: () => true,
            saveFileOnDeviceLocalStorage: vi.fn().mockResolvedValue(true)
        };

        const manager = new DatabaseManager('/ScratchJR/scratchjr.sqllite', '/ScratchJR');
        manager.db = exportedDatabase([1, 2, 3]);

        await manager.save();

        expect(window.localStorage.removeItem).toHaveBeenCalledWith(
            'scratchjrDeviceLocalStorageOutOfSync'
        );
    });

    it('falls back to an existing filesystem database when the device-local load reports failure', async () => {
        fsWeb.readdir.mockResolvedValue([
            { path: '/ScratchJR/scratchjr.sqllite' }
        ]);
        window.applicationManager = {
            isPhoneApp: () => true,
            loadFileFromDeviceLocalStorage: vi.fn().mockResolvedValue(false),
            saveFileOnDeviceLocalStorage: vi.fn().mockResolvedValue(true)
        };

        const manager = new DatabaseManager('/ScratchJR/scratchjr.sqllite', '/ScratchJR');
        manager.open = vi.fn(async () => {
            manager.db = {};
        });
        manager.initTables = vi.fn();
        manager.runMigrations = vi.fn();
        manager.save = vi.fn().mockResolvedValue(undefined);

        await manager.init();

        expect(window.applicationManager.loadFileFromDeviceLocalStorage).toHaveBeenCalledOnce();
        expect(manager.open).toHaveBeenCalledOnce();
        expect(manager.initTables).not.toHaveBeenCalled();
        expect(manager.save).toHaveBeenCalledOnce();
    });

    it('initializes a new database on first launch when neither persistence store has one', async () => {
        fsWeb.readdir.mockResolvedValue([]);
        window.applicationManager = {
            isPhoneApp: () => true,
            loadFileFromDeviceLocalStorage: vi.fn().mockResolvedValue(false)
        };

        const manager = new DatabaseManager('/ScratchJR/scratchjr.sqllite', '/ScratchJR');
        manager.initTables = vi.fn(async () => {
            manager.db = exportedDatabase([1, 2, 3]);
        });
        manager.runMigrations = vi.fn();
        manager.save = vi.fn().mockResolvedValue(undefined);

        await manager.init();

        expect(manager.initTables).toHaveBeenCalledOnce();
        expect(manager.save).toHaveBeenCalledOnce();
    });

    it('does not report a new database ready before its first filesystem snapshot exists', async () => {
        fsWeb.readdir.mockResolvedValue([]);
        fsWeb.writeFile.mockRejectedValue(new Error('Filesystem unavailable'));
        window.applicationManager = {
            isPhoneApp: () => false
        };

        const manager = new DatabaseManager('/ScratchJR/scratchjr.sqllite', '/ScratchJR');
        manager.initTables = vi.fn(async () => {
            manager.db = exportedDatabase([1, 2, 3]);
        });
        manager.runMigrations = vi.fn();
        manager.save = vi.fn().mockResolvedValue(undefined);

        await expect(manager.init()).rejects.toThrow('Filesystem unavailable');
        expect(manager.save).not.toHaveBeenCalled();
    });

    it('falls back to the native copy instead of replacing a corrupt authoritative filesystem database', async () => {
        fsWeb.readdir.mockResolvedValue([
            { path: '/ScratchJR/scratchjr.sqllite' }
        ]);
        window.localStorage.getItem.mockReturnValue('true');
        window.applicationManager = {
            isPhoneApp: () => true
        };

        const manager = new DatabaseManager('/ScratchJR/scratchjr.sqllite', '/ScratchJR');
        manager.open = vi.fn().mockResolvedValue(undefined);
        manager.getFromDeviceLocalStorage = vi.fn()
            .mockResolvedValue(Uint8Array.from(new Array(20).fill(1)).buffer);
        manager.openFromLocalStorage = vi.fn(async () => {
            manager.db = {};
        });
        manager.initTables = vi.fn();
        manager.runMigrations = vi.fn();
        manager.save = vi.fn().mockResolvedValue(undefined);

        await manager.init();

        expect(manager.open).toHaveBeenCalledOnce();
        expect(manager.getFromDeviceLocalStorage).toHaveBeenCalledOnce();
        expect(manager.openFromLocalStorage).toHaveBeenCalledOnce();
        expect(manager.initTables).not.toHaveBeenCalled();
    });

    it('falls back to the native copy when reading the authoritative filesystem database fails', async () => {
        fsWeb.readdir.mockResolvedValue([
            { path: '/ScratchJR/scratchjr.sqllite' }
        ]);
        fsWeb.readFile.mockRejectedValue(new Error('Filesystem read failed'));
        window.localStorage.getItem.mockReturnValue('true');
        window.applicationManager = {
            isPhoneApp: () => true
        };

        const manager = new DatabaseManager('/ScratchJR/scratchjr.sqllite', '/ScratchJR');
        manager.getFromDeviceLocalStorage = vi.fn()
            .mockResolvedValue(Uint8Array.from(new Array(20).fill(1)).buffer);
        manager.openFromLocalStorage = vi.fn(async () => {
            manager.db = {};
        });
        manager.runMigrations = vi.fn();
        manager.save = vi.fn().mockResolvedValue(undefined);

        await manager.init();

        expect(fsWeb.readFile).toHaveBeenCalledOnce();
        expect(manager.getFromDeviceLocalStorage).toHaveBeenCalledOnce();
        expect(manager.openFromLocalStorage).toHaveBeenCalledOnce();
    });

    it('fails closed toward the filesystem when the authority marker cannot be read', async () => {
        fsWeb.readdir.mockResolvedValue([
            { path: '/ScratchJR/scratchjr.sqllite' }
        ]);
        window.localStorage.getItem.mockImplementation(() => {
            throw new Error('Storage disabled');
        });
        window.applicationManager = {
            isPhoneApp: () => true,
            loadFileFromDeviceLocalStorage: vi.fn()
        };

        const manager = new DatabaseManager('/ScratchJR/scratchjr.sqllite', '/ScratchJR');
        manager.open = vi.fn(async () => {
            manager.db = {};
        });
        manager.runMigrations = vi.fn();
        manager.save = vi.fn().mockResolvedValue(undefined);

        await manager.init();

        expect(manager.open).toHaveBeenCalledOnce();
        expect(window.applicationManager.loadFileFromDeviceLocalStorage).not.toHaveBeenCalled();
    });

    it('prefers the filesystem copy after a previous device-local save failed', async () => {
        fsWeb.readdir.mockResolvedValue([
            { path: '/ScratchJR/scratchjr.sqllite' }
        ]);
        window.localStorage.getItem.mockReturnValue('true');
        window.applicationManager = {
            isPhoneApp: () => true,
            loadFileFromDeviceLocalStorage: vi.fn().mockResolvedValue('stale-device-copy')
        };

        const manager = new DatabaseManager('/ScratchJR/scratchjr.sqllite', '/ScratchJR');
        manager.open = vi.fn(async () => {
            manager.db = {};
        });
        manager.runMigrations = vi.fn();
        manager.save = vi.fn().mockResolvedValue(undefined);

        await manager.init();

        expect(window.applicationManager.loadFileFromDeviceLocalStorage).not.toHaveBeenCalled();
        expect(manager.open).toHaveBeenCalledOnce();
        expect(manager.save).toHaveBeenCalledOnce();
    });

    it('keeps a valid filesystem database open when its initial native mirror save fails', async () => {
        fsWeb.readdir.mockResolvedValue([
            { path: '/ScratchJR/scratchjr.sqllite' }
        ]);
        window.localStorage.getItem.mockReturnValue('true');
        window.applicationManager = {
            isPhoneApp: () => true
        };
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        const manager = new DatabaseManager('/ScratchJR/scratchjr.sqllite', '/ScratchJR');
        manager.open = vi.fn(async () => {
            manager.db = {};
        });
        manager.runMigrations = vi.fn();
        manager.save = vi.fn().mockRejectedValue(new Error('Native mirror unavailable'));

        try {
            await expect(manager.init()).resolves.toBeUndefined();
            expect(manager.isOpen()).toBe(true);
            await vi.waitFor(() => {
                expect(warnSpy).toHaveBeenCalledWith(
                    'Initial database snapshot save failed',
                    expect.any(Error)
                );
            });
        } finally {
            warnSpy.mockRestore();
        }
    });
});

describe('DatabaseManager snapshot ordering', () => {
    let logSpy;

    beforeEach(() => {
        fsWeb.readFile.mockReset();
        fsWeb.readdir.mockReset();
        fsWeb.writeFile.mockReset();
        global.window = {
            atob: (value) => Buffer.from(value, 'base64').toString('binary'),
            btoa: (value) => Buffer.from(value, 'binary').toString('base64'),
            localStorage: {
                getItem: vi.fn(),
                removeItem: vi.fn(),
                setItem: vi.fn()
            }
        };
        logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        logSpy.mockRestore();
        delete global.window;
    });

    it('serializes full snapshot writes so an older snapshot cannot finish after a newer one', async () => {
        const pendingWrites = [];
        const durableSnapshots = [];
        fsWeb.writeFile.mockImplementation((_filename, buffer) => {
            const operation = deferred();
            const snapshot = Array.from(new Uint8Array(buffer));
            pendingWrites.push({ operation, snapshot });
            return operation.promise.then(() => {
                durableSnapshots.push(snapshot);
            });
        });

        const manager = new DatabaseManager('/ScratchJR/scratchjr.sqllite', '/ScratchJR');
        manager.db = exportedDatabase([1], [2]);

        const firstSave = manager.save();
        const secondSave = manager.save();

        try {
            await vi.waitFor(() => {
                expect(pendingWrites).toHaveLength(1);
            });
            expect(manager.db.export).toHaveBeenCalledTimes(1);

            pendingWrites[0].operation.resolve();
            await firstSave;

            await vi.waitFor(() => {
                expect(pendingWrites).toHaveLength(2);
            });
            pendingWrites[1].operation.resolve();
            await secondSave;

            expect(durableSnapshots).toEqual([[1], [2]]);
        } finally {
            for (const write of pendingWrites) {
                write.operation.resolve();
            }
            await Promise.allSettled([firstSave, secondSave]);
        }
    });

    it('does not release the queue until the filesystem write settles after a native failure', async () => {
        const pendingWrites = [];
        fsWeb.writeFile.mockImplementation(() => {
            const operation = deferred();
            pendingWrites.push(operation);
            return operation.promise;
        });
        window.applicationManager = {
            isPhoneApp: () => true,
            saveFileOnDeviceLocalStorage: vi.fn()
                .mockRejectedValueOnce(new Error('Native mirror failed'))
                .mockResolvedValueOnce(true)
        };

        const manager = new DatabaseManager('/ScratchJR/scratchjr.sqllite', '/ScratchJR');
        manager.db = exportedDatabase([1], [2]);

        const firstSave = manager.save();
        const secondSave = manager.save();

        try {
            await vi.waitFor(() => {
                expect(pendingWrites).toHaveLength(1);
            });
            await Promise.resolve();
            expect(pendingWrites).toHaveLength(1);
            expect(manager.db.export).toHaveBeenCalledTimes(1);

            pendingWrites[0].resolve();
            await expect(firstSave).rejects.toThrow('Native mirror failed');

            await vi.waitFor(() => {
                expect(pendingWrites).toHaveLength(2);
            });
            expect(manager.db.export).toHaveBeenCalledTimes(2);
            pendingWrites[1].resolve();
            await expect(secondSave).resolves.toBeUndefined();
        } finally {
            for (const write of pendingWrites) {
                write.resolve();
            }
            await Promise.allSettled([firstSave, secondSave]);
        }
    });
});

describe('ScratchJRDataStore database initialization', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('shares one fully initialized manager across concurrent callers', async () => {
        const initialization = deferred();
        const folderSpy = vi.spyOn(ScratchJRDataStore, 'getScratchJRFolder')
            .mockResolvedValue('/ScratchJR');
        const initSpy = vi.spyOn(DatabaseManager.prototype, 'init')
            .mockReturnValue(initialization.promise);
        const store = new ScratchJRDataStore();

        const firstRequest = store.getDatabaseManager();
        const secondRequest = store.getDatabaseManager();

        await vi.waitFor(() => {
            expect(initSpy).toHaveBeenCalledOnce();
        });
        expect(folderSpy).toHaveBeenCalledOnce();

        initialization.resolve();
        const [firstManager, secondManager] = await Promise.all([firstRequest, secondRequest]);

        expect(firstManager).toBe(secondManager);
        expect(store.databaseManager).toBe(firstManager);
    });

    it('retries initialization instead of retaining a failed manager', async () => {
        vi.spyOn(ScratchJRDataStore, 'getScratchJRFolder').mockResolvedValue('/ScratchJR');
        const initSpy = vi.spyOn(DatabaseManager.prototype, 'init')
            .mockRejectedValueOnce(new Error('Initialization failed'))
            .mockResolvedValueOnce(undefined);
        const store = new ScratchJRDataStore();

        await expect(store.getDatabaseManager()).rejects.toThrow('Initialization failed');
        const manager = await store.getDatabaseManager();

        expect(initSpy).toHaveBeenCalledTimes(2);
        expect(store.databaseManager).toBe(manager);
    });
});

describe('ScratchJRDataStore project-file durability', () => {
    it('waits for the project-file snapshot save before reporting success', async () => {
        const operation = deferred();
        const store = new ScratchJRDataStore();
        store.getDatabaseManager = vi.fn().mockResolvedValue({
            saveToProjectFiles: vi.fn().mockReturnValue(operation.promise)
        });

        const write = store.writeProjectFile('sprite.svg', 'encoded contents', {
            encoding: 'base64'
        });
        let settled = false;
        write.finally(() => {
            settled = true;
        });

        await Promise.resolve();
        expect(settled).toBe(false);

        operation.resolve(true);
        await expect(write).resolves.toBe('sprite.svg');
    });
});
