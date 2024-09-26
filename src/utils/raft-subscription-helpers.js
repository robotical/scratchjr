export const raftVerifiedSubscriptionHelper = (raft) => ({
    subscribe: (callback) => raft.subscribe(raftVerifiedSubscriptionObserver_(callback), ["conn"]),
    unsubscribe: () => raft.unsubscribe(raftVerifiedSubscriptionObserver_(() => { }))
});

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

export const raftDisconnectedSubscriptionHelper = (raft) => ({
    subscribe: (callback) => raft.subscribe(raftDisconnectedSubscriptionObserver_(callback), ["conn"]),
    unsubscribe: () => raft.unsubscribe(raftDisconnectedSubscriptionObserver_(() => { }))
});

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

export const raftPubSubscriptionHelper = (raft) => ({
    subscribe: (callback) => raft.subscribe(raftPubSubscriptionObserver_(callback), ["raftinfo"]),
    unsubscribe: () => raft.unsubscribe(raftPubSubscriptionObserver_(() => { }))
});

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
