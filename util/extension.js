const getResourceURL = (shortName) => {
    const url = `resources/${shortName}`;
    if (chrome) {
        return chrome.runtime.getURL(url);
    } else {
        return browser.runtime.getURL(url);
    }
}

const sendMessage = (message) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
        chrome.tabs.sendMessage(tab[0].id, message);
    });
}