const FALLBACK_PROJECT_NAME = 'Tutorial project';
const MAX_PROJECT_NAME_LENGTH = 30;

export function getTutorialProjectName (tutorial) {
    var title = tutorial && typeof tutorial.title === 'string' ? tutorial.title : '';
    title = title.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return (title || FALLBACK_PROJECT_NAME).substring(0, MAX_PROJECT_NAME_LENGTH);
}

export function saveTutorialProject (options, whenDone) {
    var io = options.io;
    var project = options.project;
    var tutorial = options.tutorial;
    var version = options.version;
    var setActiveProject = options.setActiveProject;
    var completed = false;

    function finish (persisted, projectId, projectName) {
        if (completed) {
            return;
        }
        completed = true;
        if (whenDone) {
            whenDone({
                persisted: persisted === true,
                projectId: projectId,
                projectName: projectName
            });
        }
    }

    var requestedName = getTutorialProjectName(tutorial);
    try {
        io.uniqueProjectName({name: requestedName}, function (namedProject) {
            var projectName = namedProject && namedProject.name ? namedProject.name : requestedName;
            io.createProject({
                name: projectName,
                version: version,
                mtime: (new Date()).getTime().toString()
            }, function (projectId) {
                if (projectId === null || projectId === undefined || projectId === -1 || projectId === '-1') {
                    finish(false);
                    return;
                }

                projectId = String(projectId);
                project.metadata.id = projectId;
                project.metadata.name = projectName;
                project.metadata.version = version;
                project.metadata.deleted = 'NO';
                project.metadata.gallery = '';
                project.metadata.isgift = '0';
                setActiveProject(projectId);

                try {
                    project.prepareToSave(projectId, function (persisted) {
                        finish(persisted === true, projectId, projectName);
                    });
                } catch (err) {
                    finish(false, projectId, projectName);
                }
            });
        });
    } catch (err) {
        finish(false);
    }
}

export default {
    getProjectName: getTutorialProjectName,
    save: saveTutorialProject
};
