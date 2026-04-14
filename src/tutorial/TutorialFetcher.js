import cogAndMartyTutorial from "./tutorials-data/cog-and-marty";
import cogJrBlocksTutorial1 from "./tutorials-data/cog-jrblocks-1";
import cogJrBlocksTutorial2 from "./tutorials-data/cog-jrblocks-2";
import cogJrBlocksTutorial3 from "./tutorials-data/cog-jrblocks-3";
import cogJrBlocksTutorial4 from "./tutorials-data/cog-jrblocks-4";
import cogJrBlocksTutorial5 from "./tutorials-data/cog-jrblocks-5";
import cogJrBlocksTutorial6 from "./tutorials-data/cog-jrblocks-6";
import cogJrBlocksTutorial7 from "./tutorials-data/cog-jrblocks-7";
import cogJrBlocksTutorial8 from "./tutorials-data/cog-jrblocks-8";
import cogJrBlocksTutorial9 from "./tutorials-data/cog-jrblocks-9";
import cogJrBlocksTutorial10 from "./tutorials-data/cog-jrblocks-10";
import cogJrBlocksTutorial11 from "./tutorials-data/cog-jrblocks-11";
import cogJrBlocksTutorial12 from "./tutorials-data/cog-jrblocks-12";
import cogJrBlocksTutorial13 from "./tutorials-data/cog-jrblocks-13";

import martyJrBlocksTutorial1 from "./tutorials-data/marty-jrblocks-tutorials/marty-jrblocks-1";
import martyJrBlocksTutorial2 from "./tutorials-data/marty-jrblocks-tutorials/marty-jrblocks-2";
import martyJrBlocksTutorial3 from "./tutorials-data/marty-jrblocks-tutorials/marty-jrblocks-3";
import martyJrBlocksTutorial4 from "./tutorials-data/marty-jrblocks-tutorials/marty-jrblocks-4";
import martyJrBlocksTutorial5 from "./tutorials-data/marty-jrblocks-tutorials/marty-jrblocks-5";
import Localization from "../utils/Localization";

const MISSING_PREFIX = 'String missing: ';

const allTutorials = [
    cogAndMartyTutorial,
    cogJrBlocksTutorial1,
    cogJrBlocksTutorial2,
    cogJrBlocksTutorial3,
    cogJrBlocksTutorial4,
    cogJrBlocksTutorial5,
    cogJrBlocksTutorial6,
    cogJrBlocksTutorial7,
    cogJrBlocksTutorial8,
    cogJrBlocksTutorial9,
    cogJrBlocksTutorial10,
    cogJrBlocksTutorial11,
    cogJrBlocksTutorial12,
    cogJrBlocksTutorial13,

    martyJrBlocksTutorial1,
    martyJrBlocksTutorial2,
    martyJrBlocksTutorial3,
    martyJrBlocksTutorial4,
    martyJrBlocksTutorial5
];

function resolveLocalizedValue(value) {
    if (typeof value === 'string' && value.indexOf(MISSING_PREFIX) === 0) {
        const key = value.slice(MISSING_PREFIX.length);
        const localizedValue = Localization.localize(key);
        return localizedValue.indexOf(MISSING_PREFIX) === 0 ? value : localizedValue;
    }

    if (Array.isArray(value)) {
        return value.map((item) => resolveLocalizedValue(item));
    }

    if (value && typeof value === 'object') {
        const resolvedValue = {};
        Object.keys(value).forEach((key) => {
            resolvedValue[key] = resolveLocalizedValue(value[key]);
        });
        return resolvedValue;
    }

    return value;
}

export default class TutorialFetcher {

    static fetchTutorial(tutorialId) {
        const tutorial = allTutorials.find((item) => item.id === tutorialId);
        return tutorial ? resolveLocalizedValue(tutorial) : undefined;
    }

    static fetchTutorials(filters = {}) {
        return allTutorials.filter((tutorial) => {
            if (filters.platform && tutorial.platform !== filters.platform) {
                return false;
            }
            return true;
        }).map((tutorial) => resolveLocalizedValue(tutorial));
    }
}
