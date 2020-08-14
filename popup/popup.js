const chkEnabled = document.getElementById("checkbox-enable-disable");

const toggleEnable = (value) => {
    chrome.storage.local.set({ [AppSettings.LIVEABILITY_REGIONS_ENABLED]: value });

    sendMessage(AppMessages.READ_ENABLED);
}

chrome.storage.local.get(AppSettings.LIVEABILITY_REGIONS_ENABLED, (result) => {
    chkEnabled.checked = result[AppSettings.LIVEABILITY_REGIONS_ENABLED];
});

chkEnabled.addEventListener("change", () => {
    toggleEnable(chkEnabled.checked);
});

const rangeSlider = () => {
    const slider = document.getElementById("liveability-range-slider");

    const range = slider.querySelector(".range-slider-range");
    const span = slider.querySelector(".range-slider-value");
    const max = Object.keys(LiveabilityClasses).length;

    range.max = max;

    span.innerHTML = LiveabilityClasses[range.value].meaning;

    range.addEventListener("input", (event) => {
        const element = event.currentTarget;
        const valueInPercentage = (element.value / element.max * 100) - 1;
        const backgroundColor = LiveabilityClasses[element.value].backgroundColor;
        span.innerHTML = LiveabilityClasses[element.value].meaning;

        range.style.background = `linear-gradient(to right, ${backgroundColor} 0% ${valueInPercentage}%, #ccc ${valueInPercentage}% 100%)`;
    });
};

rangeSlider();