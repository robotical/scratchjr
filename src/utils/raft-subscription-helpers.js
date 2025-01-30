export const raftVerifiedSubscriptionHelper = (raft) => {
    let observer = null;
    return {
        subscribe: (callback) => {
            observer = raftVerifiedSubscriptionObserver_(callback);
            raft.subscribe(observer, ["conn"]);
        },
        unsubscribe: () => {
            if (observer) {
                raft.unsubscribe(observer);
            }
        }
    };
};

const raftVerifiedSubscriptionObserver_ = (callback) => {
    return {
        notify(
            eventType,
            eventEnum,
            eventName,
            eventData,
        ) {
            switch (eventType) {
                case "conn":
                    switch (eventEnum) {
                        case 8:
                            callback();
                            break;
                        default:
                            break;
                    }
                    break;
            }
        },
    };
};

export const raftDisconnectedSubscriptionHelper = (raft) => {
    let observer = null;
    return {
        subscribe: (callback) => {
            observer = raftDisconnectedSubscriptionObserver_(callback);
            raft.subscribe(observer, ["conn"]);
        },
        unsubscribe: () => {
            if (observer) {
                raft.unsubscribe(observer);
            }
        }
    };
};

const raftDisconnectedSubscriptionObserver_ = (callback) => {
    return {
        notify(
            eventType,
            eventEnum,
            eventName,
            eventData,
        ) {
            switch (eventType) {
                case "conn":
                    switch (eventEnum) {
                        case 3:
                            callback();
                            break;
                        default:
                            break;
                    }
                    break;
            }
        },
    };
};

export const raftPubSubscriptionHelper = (raft) => {
    let observer = null;
    return {
        subscribe: (callback) => {
            observer = raftPubSubscriptionObserver_(callback);
            raft.subscribe(raftPubSubscriptionObserver_(callback), ["raftinfo"]);
        },
        unsubscribe: () => {
            if (observer) {
                raft.unsubscribe(observer);
            }
        }
    };
};

const raftPubSubscriptionObserver_ = (callback) => {
    return {
        notify(
            eventType,
            eventEnum,
            eventName,
            eventData,
        ) {
            switch (eventType) {
                case "raftinfo":
                    switch (eventEnum) {
                        case "STATE_INFO":
                            callback(eventData);
                            break;
                        default:
                            break;
                    }
                    break;
            }
        },
    };
};
