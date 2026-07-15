export default function goToLink (hrefFile, targetWindow = window) {
    // checks if href file gets redirected, if it does,
    // it uses the href (browser), otherwise (phone)
    // it uses the file
    const href = hrefFile.replace('.html', '');
    const navigate = (destination) => {
        targetWindow.location.href = destination;
    };

    try {
        return fetch(hrefFile).then(response => {
            navigate(response.redirected ? href : hrefFile);
        }).catch(() => navigate(hrefFile));
    } catch(e) {
        navigate(hrefFile);
        return Promise.resolve();
    }
}
