const chkEnabled = document.getElementById("checkbox-enable-disable");
const liveabilitySlider = document.getElementById("liveability-range-slider");
const developmentSlider = document.getElementById("development-range-slider");

const toggleEnable = (value) => {
    chrome.storage.local.set({ [AppSettings.LIVEABILITY_REGIONS_ENABLED]: value });

    sendMessage(AppMessages.READ_ENABLED);
}

const changeLiveabilityRange = (value) => {
    chrome.storage.local.set({ [AppSettings.MIN_LIVEABILITY_SCORE]: value });
    drawLiveabilitySlider();

    sendMessage(AppMessages.READ_MIN_LIV_SCORE);
}

const changeDevelopmentRange = (value) => {
    chrome.storage.local.set({ [AppSettings.MIN_DEVELOPMENT_SCORE]: value });
    drawDevelopmentSlider();

    sendMessage(AppMessages.READ_MIN_DEV_SCORE);
}

chkEnabled.addEventListener("change", () => {
    toggleEnable(chkEnabled.checked);
});

const initLiveabilitySlider = () => {
    const range = liveabilitySlider.querySelector("input");
    const max = Object.keys(LiveabilityClasses).length;
    range.max = max;

    range.addEventListener("input", () => {
        changeLiveabilityRange(range.value);
    });

    drawLiveabilitySlider();
};

const drawLiveabilitySlider = () => {
    const range = liveabilitySlider.querySelector("input");
    const span = liveabilitySlider.querySelector(".range-slider-value");

    const valueInPercentage = (range.value / range.max * 100) - 1;
    const backgroundColor = LiveabilityClasses[range.value]?.backgroundColor;
    span.innerHTML = LiveabilityClasses[range.value]?.meaning;

    range.style.background = `linear-gradient(to right, ${backgroundColor} 0% ${valueInPercentage}%, #ccc ${valueInPercentage}% 100%)`;
}

const initDevelopmentSlider = () => {
    const range = developmentSlider.querySelector("input");
    const max = Object.keys(DevelopmentScoreMeaning).length;
    range.max = max;

    range.addEventListener("input", () => {
        changeDevelopmentRange(range.value);
    });

    drawDevelopmentSlider();
};

const drawDevelopmentSlider = () => {
    const range = developmentSlider.querySelector("input");
    const span = developmentSlider.querySelector(".range-slider-value");

    const valueInPercentage = (range.value / range.max * 100) - 5;
    const backgroundColor = "#ace6d4";
    span.innerHTML = DevelopmentScoreMeaning[range.value];

    range.style.background = `linear-gradient(to right, ${backgroundColor} 0% ${valueInPercentage}%, #ccc ${valueInPercentage}% 100%)`;
}

chrome.storage.local.get([AppSettings.LIVEABILITY_REGIONS_ENABLED, AppSettings.MIN_LIVEABILITY_SCORE, AppSettings.MIN_DEVELOPMENT_SCORE], (result) => {
    chkEnabled.checked = result[AppSettings.LIVEABILITY_REGIONS_ENABLED];
    liveabilitySlider.querySelector("input").value = result[AppSettings.MIN_LIVEABILITY_SCORE];
    developmentSlider.querySelector("input").value = result[AppSettings.MIN_DEVELOPMENT_SCORE];
    initLiveabilitySlider();
    initDevelopmentSlider();
});