import cogAndMartyTutorial from "./tutorials-data/cog-and-marty";

const allTutorials = [
    cogAndMartyTutorial
];
export default class TutorialFetcher {

    static fetchTutorial(tutorialId) {
        return allTutorials.find(tutorial => tutorial.id === tutorialId);
    }
}

