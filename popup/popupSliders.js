const liveabilitySlider = document.getElementById("liveability-range-slider");
const developmentSlider = document.getElementById("development-range-slider");
const sliderChange = (value, appSetting) => {
    chrome.storage.local.set({ [appSetting]: value }, () => {
        sendMessage(appSetting);
    });
}

const initLiveabilitySlider = () => {
    const range = liveabilitySlider.querySelector("input");
    const max = Object.keys(LiveabilityClasses).length;
    range.max = max;

    range.addEventListener("input", () => {
        sliderChange(range.value, AppSettings.MIN_LIVEABILITY_SCORE);
        drawLiveabilitySlider();
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
        sliderChange(range.value, AppSettings.MIN_DEVELOPMENT_SCORE);
        drawDevelopmentSlider();
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

const initAllSliders = () => {    
    initLiveabilitySlider();
    initDevelopmentSlider();
}

chrome.storage.local.get([AppSettings.MIN_LIVEABILITY_SCORE, AppSettings.MIN_DEVELOPMENT_SCORE], (result) => {
    liveabilitySlider.querySelector("input").value = result[AppSettings.MIN_LIVEABILITY_SCORE];
    developmentSlider.querySelector("input").value = result[AppSettings.MIN_DEVELOPMENT_SCORE];
    initAllSliders();
});