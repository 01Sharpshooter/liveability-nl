const liveabilitySlider = document.getElementById("liveability-range-slider");
const developmentSlider = document.getElementById("development-range-slider");
const safetySlider = document.getElementById("safety-range-slider");
const servicesSlider = document.getElementById("services-range-slider");
const housesSlider = document.getElementById("houses-range-slider");
const residentsSlider = document.getElementById("residents-range-slider");

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

    const valueInPercentage = (range.value / range.max * 100) - 5;
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

const initChartSlider = (slider, appSetting, color) => {
    const range = slider.querySelector("input");
    const max = Object.keys(ChartIntervals).length;
    range.max = max;

    range.addEventListener("input", () => {
        sliderChange(range.value, appSetting);
        drawChartSlider(slider, color);
    });

    drawChartSlider(slider, color);
};

const drawChartSlider = (slider, color) => {
    const range = slider.querySelector("input");
    const span = slider.querySelector(".range-slider-value");

    const valueInPercentage = (range.value / range.max * 100) - 5;
    span.innerHTML = ChartIntervals[range.value].name;

    range.style.background = `linear-gradient(to right, ${color} 0% ${valueInPercentage}%, #ccc ${valueInPercentage}% 100%)`;
}

const initAllSliders = () => {
    initLiveabilitySlider();
    initDevelopmentSlider();
    initChartSlider(housesSlider, AppSettings.MIN_HOUSES_SCORE, ChartCategories.HOUSES.color);
    initChartSlider(residentsSlider, AppSettings.MIN_RESIDENTS_SCORE, ChartCategories.RESIDENTS.color);
    initChartSlider(servicesSlider, AppSettings.MIN_SERVICES_SCORE, ChartCategories.SERVICES.color);
    initChartSlider(safetySlider, AppSettings.MIN_SAFETY_SCORE, ChartCategories.SAFETY.color);
}

chrome.storage.local.get(
    [AppSettings.MIN_LIVEABILITY_SCORE
        , AppSettings.MIN_DEVELOPMENT_SCORE
        , AppSettings.MIN_SERVICES_SCORE
        , AppSettings.MIN_RESIDENTS_SCORE
        , AppSettings.MIN_SAFETY_SCORE
        , AppSettings.MIN_HOUSES_SCORE],
    (result) => {
        liveabilitySlider.querySelector("input").value = result[AppSettings.MIN_LIVEABILITY_SCORE];
        developmentSlider.querySelector("input").value = result[AppSettings.MIN_DEVELOPMENT_SCORE];
        servicesSlider.querySelector("input").value = result[AppSettings.MIN_SERVICES_SCORE]
        safetySlider.querySelector("input").value = result[AppSettings.MIN_SAFETY_SCORE];
        housesSlider.querySelector("input").value = result[AppSettings.MIN_HOUSES_SCORE];
        residentsSlider.querySelector("input").value = result[AppSettings.MIN_RESIDENTS_SCORE];
        initAllSliders();
    });