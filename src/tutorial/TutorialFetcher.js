import cogAndMartyTutorial from "./tutorials-data/cog-and-marty";
import cogJrBlocksTutorial1 from "./tutorials-data/cog-jrblocks-1";
import cogJrBlocksTutorial2 from "./tutorials-data/cog-jrblocks-2";
import cogJrBlocksTutorial3 from "./tutorials-data/cog-jrblocks-3";
import cogJrBlocksTutorial4 from "./tutorials-data/cog-jrblocks-4";

const allTutorials = [
    cogAndMartyTutorial,
    cogJrBlocksTutorial1,
    cogJrBlocksTutorial2,
    cogJrBlocksTutorial3,
    cogJrBlocksTutorial4,
];
export default class TutorialFetcher {

    static fetchTutorial(tutorialId) {
        return allTutorials.find(tutorial => tutorial.id === tutorialId);
    }
}

