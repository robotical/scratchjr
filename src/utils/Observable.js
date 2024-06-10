import P3vmEvents from "../p3/P3EventEnum";

/**
 * Abstract class representing an observable in code assessment context.
 * @abstract
 */
class Observable {
    observers = [];

    constructor() {
        if (this.constructor === Observable) {
            throw new TypeError('Abstract class "Observable" cannot be instantiated directly.');
        }
    }

    /**
     * Subscribe to this observable.
     */
    subscribe(id, typeOfEvent, cb,) {
        const PublishedEventsEnum = Object.values(P3vmEvents);
        if (!Object.values(PublishedEventsEnum).includes(typeOfEvent)) {
            throw new TypeError(`The type of event "${typeOfEvent}" is not valid. Valid types are: ${Object.values(PublishedEventsEnum).join(", ")}`);
        }
        const observer = new Observer(id, typeOfEvent, cb);
        const index = this.observers.findIndex((o) => o.id === observer.id);
        if (index !== -1) {
            this.observers.splice(index, 1);
        }
        this.observers.push(observer);
    }

    /**
     * Unsubscribe from this observable.
     */
    unsubscribe(observerId) {
        const index = this.observers.findIndex((o) => o.id === observerId);
        if (index !== -1) {
            this.observers.splice(index, 1);
        }
    }

    /**
     * Unsubscribe all observers from this observable.
     */
    unsubscribeAll() {
        this.observers = [];
    }

    /**
     * Publish updates to all subscribers.
     */
    publish(typeOfEvent, data) {
        this.observers.forEach((o) => o.notify(typeOfEvent, data));
    }
}

/**
 * Class representing an observer in code assessment context.
 */
class Observer {
    id;
    typeOfEventToListenFor;
    cb;

    constructor(id, typeOfEventToListenFor, cb) {
        this.id = id;
        this.typeOfEventToListenFor = typeOfEventToListenFor;
        this.cb = cb;
        // Checking if abstract properties are initialized
        if (!this.id || !this.cb || !this.typeOfEventToListenFor) {
            throw new TypeError('The subclass must define the "id", "typeOfEventToListenFor" and "cb" properties.' + this.id + this.cb + this.typeOfEventToListenFor);
        }
    }

    /**
     * Notify this observer of updates.
     * @param {PublishedEventsEnum} typeOfEvent
     */
    notify(typeOfEvent, data) {
        if (typeOfEvent === this.typeOfEventToListenFor) {
            this.cb(data);
        }
    }
}

export { Observable, Observer };
