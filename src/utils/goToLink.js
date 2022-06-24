export default function goToLink(hrefFile) {
    // checks if href file gets redirected, if it does, 
    // it uses the href (browser), otherwise (phone)
    // it uses the file
    const href = hrefFile.replace(".html", "");
    try {

        fetch(hrefFile).then(response => {
            if (response.redirected) window.location.href = href;
            else window.location.href = hrefFile;
        }).catch(_ => window.location.href = hrefFile);
    } catch(e) {
        window.location.href = hrefFile;
    }
}