import TutorialEngine from './TutorialEngine';
import TutorialFetcher from './TutorialFetcher';

// Called only after the editor's assets, project, stage and runtime are ready.
export function startTutorialAfterProjectLoad () {
    if (window.scratchJrPage !== 'editor' || window.tutorialEngine) {
        return;
    }

    const tutorialId = new window.URLSearchParams(window.location.search).get('tutorial');
    if (!tutorialId) {
        return;
    }

    const tutorial = TutorialFetcher.fetchTutorial(tutorialId);
    if (tutorial) {
        window.tutorialEngine = new TutorialEngine(tutorial);
    }
}
