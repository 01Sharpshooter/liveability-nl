const getResourceURL = (shortName) => {
    const url = `resources/${shortName}`;
    if (chrome) {
        return chrome.runtime.getURL(url);
    } else {
        return browser.runtime.getURL(url);
    }
}

const getResource = async (shortName) => {
    const url = getResourceURL(shortName);
    const response = await fetch(url);

    return response.text();
}

const sendMessage = (message) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
        chrome.tabs.sendMessage(tab[0].id, message);
    });
}

const readLocalSetting = (key) => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(key, (result) => {
            resolve(result[key]);
        });
    });
}