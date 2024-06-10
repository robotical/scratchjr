import P3vmEvents from "./P3EventEnum";

export default class PublishedDataAnalyser {
    static _instance;

    // Get instance
    static getInstance() {
        if (!PublishedDataAnalyser._instance) {
            PublishedDataAnalyser._instance = new PublishedDataAnalyser();
        }
        return PublishedDataAnalyser._instance;
    }


    analyse(data, publisher) {
        console.log("data", data);
        // analyse data (this should first collect some data and then analyse)
        // if the appropriate number of data has been collected, analyse
        // if the data is not enough, return
        // if the analysed data conclude on an event, then publish
        // publisher(P3vmEvents.ON_MOVE);
        // publisher(P3vmEvents.ON_TOUCH);
        // publisher(P3vmEvents.ON_TOUCH);
        // publisher(P3vmEvents.ON_SHAKE);
        // publisher(P3vmEvents.TILE_LEFT);
        // publisher(P3vmEvents.TILT_RIGHT);
        // publisher(P3vmEvents.TILT_BACKWARD);
        // publisher(P3vmEvents.TILT_FORWARD);
        // publisher(P3vmEvents.ON_ROTATE_CLOCKWISE);
        // publisher(P3vmEvents.ON_ROTATE_COUNTER_CLOCKWISE);
    }
}