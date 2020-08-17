const chkEnabled = document.getElementById("checkbox-enable-disable");

const toggleEnable = (value) => {
    chrome.storage.local.set({ [AppSettings.LIVEABILITY_REGIONS_ENABLED]: value });

    sendMessage(AppSettings.LIVEABILITY_REGIONS_ENABLED);
}

chkEnabled.addEventListener("change", () => {
    toggleEnable(chkEnabled.checked);
});

chrome.storage.local.get([AppSettings.LIVEABILITY_REGIONS_ENABLED], (result) => {
    chkEnabled.checked = result[AppSettings.LIVEABILITY_REGIONS_ENABLED];
});