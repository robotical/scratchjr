// The editor can be nested in both an object document and an iframe.
export const getApplicationManager = () => {
    if (typeof window === 'undefined') return null;
    const candidates = [window];
    try {
        candidates.push(window.parent);
    } catch (error) { /* Cross-origin host. */ }
    try {
        candidates.push(window.top);
    } catch (error) { /* Cross-origin host. */ }
    try {
        candidates.push(window.frameElement && window.frameElement.ownerDocument.defaultView);
    } catch (error) { /* Cross-origin host. */ }
    const managers = [];
    for (const candidate of candidates) {
        try {
            const manager = candidate && candidate.applicationManager;
            if (manager && managers.indexOf(manager) === -1) managers.push(manager);
        } catch (error) { /* Keep looking in accessible host windows. */ }
    }
    return managers.find(manager => manager.connectedRafts && Object.keys(manager.connectedRafts).length) ||
        managers.find(manager => manager.connectedRafts) || null;
};
