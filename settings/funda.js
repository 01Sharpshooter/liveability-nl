const Settings = Object.freeze({
    RESULT_SELECTOR: ".search-result",
    ZIPCODE_SELECTOR: ".search-result__header-subtitle.fd-m-none",
    OBSERVER_SELECTOR: ".container.search-main",
    OBSERVER_OPTIONS: {
        attributes: true,
        attributeFilter: ['class'],
        childList: false,
        characterData: false
    }
});
