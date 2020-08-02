const Settings = Object.freeze({
    RESULT_SELECTOR: ".search-list__item.search-list__item--listing",
    ZIPCODE_SELECTOR: ".listing-search-item__location",
    OBSERVER_SELECTOR: "[data-search-page-content]",
    OBSERVER_OPTIONS: {
        attributes: false,
        childList: true,
        characterData: false
    }
});
