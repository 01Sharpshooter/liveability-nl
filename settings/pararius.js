const Settings = Object.freeze({
    RESULT_SELECTOR: ".search-list__item.search-list__item--listing",
    ZIPCODE_SELECTOR: ".listing-search-item__location",
    OBSERVER_SELECTOR: "[data-search-page-content], .page__row--search-list",
    OBSERVER_OPTIONS: {
        attributes: false,
        childList: true,
        characterData: false
    },
    RESULT_CONTAINER_SELECTOR: ".search-list",
    PAGINATION_SELECTOR: ".page__row--search-pagination",
    GET_RESULT_PAGE: (pageIndex) => {
        return location.href.replace(/\/page-\d*/g, "") + `/page-${pageIndex}`;
    }
});
