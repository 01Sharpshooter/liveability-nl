const pageHandler = (function () {
    const pageMap = new Map();
    const pageLimit = 15;

    // revisit code repetition
    let pageNum = 1;
    let cardsPerPageArray = [];
    let currentOpenPageNum = 0;
    pageMap.set(pageNum, cardsPerPageArray);

    const attachLiveabilityRegionIfNecessary = (card) => {
        const zipCode = extractZipCode(card);
        if (!card.querySelector(".liveability-region")) {
            getLiveabilityRegion(card.getAttribute("data-number-in-order"), zipCode).then((region) => {
                card.appendChild(region);
            });
        }
    }

    const addCard = (card) => {
        //optionally the card could be added to the current page dynamically
        if (cardsPerPageArray.length == pageLimit) {
            pageNum++;
            cardsPerPageArray = [];
            pageMap.set(pageNum, cardsPerPageArray);
        }
        cardsPerPageArray.push(card);
    }

    const reset = () => {
        pageMap.clear();
        currentOpenPageNum = 0;
        pageNum = 1;
        cardsPerPageArray = [];
        pageMap.set(pageNum, cardsPerPageArray);
    }

    const goToPage = (pageNr) => {
        if (currentOpenPageNum === pageNr) return;

        clearHouseCards();

        pageMap.get(pageNr).forEach(resultCard => {
            document.querySelector(Settings.RESULT_CONTAINER_SELECTOR).append(resultCard);
            attachLiveabilityRegionIfNecessary(resultCard);
        });

        currentOpenPageNum = pageNr;
    }

    const createPages = () => {
        //TODO FUNDA
        //check if loading can be done nicely in the back after first page is ready
        let paginationContainer = document.querySelector(Settings.PAGINATION_SELECTOR);

        const pagination = getPagination(pageMap.size, 1, goToPage);
        paginationContainer.innerHTML = ""; // will not work if there's no original paging
        paginationContainer.appendChild(pagination);
        paginationContainer.style.display = "unset";
        goToPage(1);
    }

    const hidePaging = () => {
        let paginationContainer = document.querySelector(Settings.PAGINATION_SELECTOR);
        paginationContainer.style.display = "none"
    }

    return { addCard, reset, createPages, hidePaging }
})();