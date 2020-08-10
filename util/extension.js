const getResourceURL = (shortName) => {
    const url = `resources/${shortName}`;
    if (chrome) {
        return chrome.runtime.getURL(url);
    } else {
        return browser.runtime.getURL(url);
    }
}