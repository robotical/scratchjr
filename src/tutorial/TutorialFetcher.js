import cogAndMartyTutorial from "./tutorials-data/cog-and-marty";
import cogJrBlocksTutorial1 from "./tutorials-data/cog-jrblocks-1";
import cogJrBlocksTutorial2 from "./tutorials-data/cog-jrblocks-2";
import cogJrBlocksTutorial3 from "./tutorials-data/cog-jrblocks-3";
import cogJrBlocksTutorial4 from "./tutorials-data/cog-jrblocks-4";
import cogJrBlocksTutorial5 from "./tutorials-data/cog-jrblocks-5";
import cogJrBlocksTutorial6 from "./tutorials-data/cog-jrblocks-6";
import cogJrBlocksTutorial7 from "./tutorials-data/cog-jrblocks-7";


const allTutorials = [
    cogAndMartyTutorial,
    cogJrBlocksTutorial1,
    cogJrBlocksTutorial2,
    cogJrBlocksTutorial3,
    cogJrBlocksTutorial4,
    cogJrBlocksTutorial5,
    cogJrBlocksTutorial6,
    cogJrBlocksTutorial7,
];
export default class TutorialFetcher {

    static fetchTutorial(tutorialId) {
        return allTutorials.find(tutorial => tutorial.id === tutorialId);
    }
}

