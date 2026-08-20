import { describe, expect, it, vi } from 'vitest';
import { getTutorialProjectName, saveTutorialProject } from '@/tutorial/TutorialProject';

function makeDependencies(overrides = {}) {
    const metadata = {name: 'Tutorials'};
    const io = {
        uniqueProjectName: vi.fn((request, callback) => callback({name: request.name})),
        createProject: vi.fn((request, callback) => callback('42'))
    };
    const project = {
        metadata,
        prepareToSave: vi.fn((projectId, callback) => callback(true))
    };
    return {
        io,
        project,
        tutorial: {title: '1. Getting Marty Moving'},
        version: 'iOSv01',
        setActiveProject: vi.fn(),
        ...overrides
    };
}

describe('tutorial project saving', () => {
    it('normalizes tutorial titles into valid local project names', () => {
        expect(getTutorialProjectName({title: '  <b>My</b>   tutorial  '})).toBe('My tutorial');
        expect(getTutorialProjectName({})).toBe('Tutorial project');
        expect(getTutorialProjectName({title: 'x'.repeat(40)})).toHaveLength(30);
    });

    it('creates and persists a uniquely named editable project', async () => {
        const dependencies = makeDependencies();
        dependencies.io.uniqueProjectName.mockImplementation((request, callback) => {
            callback({name: request.name + ' 2'});
        });

        const result = await new Promise((resolve) => saveTutorialProject(dependencies, resolve));

        expect(dependencies.io.createProject).toHaveBeenCalledWith(
            expect.objectContaining({name: '1. Getting Marty Moving 2', version: 'iOSv01'}),
            expect.any(Function)
        );
        expect(dependencies.setActiveProject).toHaveBeenCalledWith('42');
        expect(dependencies.project.metadata).toMatchObject({
            id: '42',
            name: '1. Getting Marty Moving 2',
            version: 'iOSv01',
            deleted: 'NO',
            gallery: '',
            isgift: '0'
        });
        expect(dependencies.project.prepareToSave).toHaveBeenCalledWith('42', expect.any(Function));
        expect(result).toEqual({
            persisted: true,
            projectId: '42',
            projectName: '1. Getting Marty Moving 2'
        });
    });

    it('reports a failed insert without activating or saving a project', async () => {
        const dependencies = makeDependencies();
        dependencies.io.createProject.mockImplementation((request, callback) => callback('-1'));

        const result = await new Promise((resolve) => saveTutorialProject(dependencies, resolve));

        expect(dependencies.setActiveProject).not.toHaveBeenCalled();
        expect(dependencies.project.prepareToSave).not.toHaveBeenCalled();
        expect(result).toEqual({persisted: false, projectId: undefined, projectName: undefined});
    });
});
