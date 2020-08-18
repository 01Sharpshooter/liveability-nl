chrome.runtime.onInstalled.addListener((details) => {
    if(details.reason == "install"){
        chrome.storage.local.set({ [AppSettings.LIVEABILITY_REGIONS_ENABLED]: true });
        chrome.storage.local.set({ [AppSettings.MIN_LIVEABILITY_SCORE]: 1 });
        chrome.storage.local.set({ [AppSettings.MIN_DEVELOPMENT_SCORE]: 1 });
        chrome.storage.local.set({ [AppSettings.MIN_HOUSES_SCORE]: 1 });
        chrome.storage.local.set({ [AppSettings.MIN_RESIDENTS_SCORE]: 1 });
        chrome.storage.local.set({ [AppSettings.MIN_SERVICES_SCORE]: 1 });
        chrome.storage.local.set({ [AppSettings.MIN_SAFETY_SCORE]: 1 });
        chrome.storage.local.set({ [AppSettings.MIN_ENVIRONMENT_SCORE]: 1 });
    }
})