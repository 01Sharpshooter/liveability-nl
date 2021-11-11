const Settings = Object.freeze({
    RESULT_SELECTOR: ".search-result",
    ZIPCODE_SELECTOR: ".search-result__header-subtitle.fd-m-none",
    OBSERVER_SELECTOR: ".container.search-main, input[name=previousState]",
    OBSERVER_OPTIONS: {
        attributes: true,
        attributeFilter: ['class'],
        childList: false,
        characterData: false
    },
    RESULT_CONTAINER_SELECTOR: ".search-results",
    PAGINATION_SELECTOR: "nav.pagination",
    GET_RESULT_PAGE: (pageIndex) => {
        return location.href.replace(/\/p\d*/g, "") + `/p${pageIndex}`;
    }
});
