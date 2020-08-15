chrome.runtime.onInstalled.addListener((details) => {
    if(details.reason == "install"){
        chrome.storage.local.set({ [AppSettings.LIVEABILITY_REGIONS_ENABLED]: true });
        chrome.storage.local.set({ [AppSettings.MIN_LIVEABILITY_SCORE]: 1 });
    }
})