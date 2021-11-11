const parser = new DOMParser();
const advancedFilter = true;

var timer;
var resultCard = document.querySelector(Settings.OBSERVER_SELECTOR);

if (resultCard instanceof Node) {
  var observer = new MutationObserver((event) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      if (advancedFilter) {
        initAdvancedFilter().then(pageHandler.createPages);
      } else {
        toggleLiveabilityRegions();
      }
    }, 500);
  })

  observer.observe(resultCard, Settings.OBSERVER_OPTIONS);
}

const houseFitsFilters = (house) => {
  return parseInt(house.getAttribute("data-score")) >= settingsHandler.get(AppSettings.MIN_LIVEABILITY_SCORE) &&
    parseInt(house.getAttribute("data-development")) >= settingsHandler.get(AppSettings.MIN_DEVELOPMENT_SCORE) &&
    parseInt(house.getAttribute("data-houses")) >= settingsHandler.get(AppSettings.MIN_HOUSES_SCORE) &&
    parseInt(house.getAttribute("data-residents")) >= settingsHandler.get(AppSettings.MIN_RESIDENTS_SCORE) &&
    parseInt(house.getAttribute("data-services")) >= settingsHandler.get(AppSettings.MIN_SERVICES_SCORE) &&
    parseInt(house.getAttribute("data-safety")) >= settingsHandler.get(AppSettings.MIN_SAFETY_SCORE) &&
    parseInt(house.getAttribute("data-environment")) >= settingsHandler.get(AppSettings.MIN_ENVIRONMENT_SCORE);
}

// replace in other files too
const validZipCode = (zipCode) => {
  return !(isNaN(zipCode) || zipCode === "");
}

const decorateCardWithData = async (card) => {
  let zipCode = extractZipCode(card);
  card.setAttribute("data-zipcode", zipCode);

  if (validZipCode(zipCode)) {// still needed with dataHandler?
    card.setAttribute("data-houses", dataHandler.fetchFieldScoreForZipCode(zipCode, CSVColumns.HOUSES18));
    card.setAttribute("data-residents", dataHandler.fetchFieldScoreForZipCode(zipCode, CSVColumns.RESIDENTS18));
    card.setAttribute("data-services", dataHandler.fetchFieldScoreForZipCode(zipCode, CSVColumns.SERVICES18));
    card.setAttribute("data-safety", dataHandler.fetchFieldScoreForZipCode(zipCode, CSVColumns.SAFETY18));
    card.setAttribute("data-environment", dataHandler.fetchFieldScoreForZipCode(zipCode, CSVColumns.ENVIRONMENT18));

    const scores = await dataHandler.fetchBasicScores(zipCode);
    card.setAttribute("data-score", scores.liveabilityScore);
    card.setAttribute("data-development", scores.developmentScore);
  }
}

const applyFiltersToCard = (resultCard) => {
  if (settingsHandler.get(AppSettings.LIVEABILITY_REGIONS_ENABLED) && !houseFitsFilters(resultCard)) {
    resultCard.style.display = "none";
  } else {
    resultCard.style.display = "inherit";
  }
}

const processCards = async () => {
  let regionNumber = 1;
  document.querySelectorAll(Settings.RESULT_SELECTOR).forEach(async (resultCard) => {
    let zipCode = extractZipCode(resultCard)

    await decorateCardWithData(resultCard); //wait for attributes to filter

    getLiveabilityRegion(regionNumber, zipCode).then((region) => {
      resultCard.appendChild(region);
    });

    applyFiltersToCard(resultCard);

    regionNumber++;
  });
}

const toggleLiveabilityRegions = () => {
  document.querySelectorAll(".liveability-region").forEach((node) => node.remove());

  if (settingsHandler.get(AppSettings.LIVEABILITY_REGIONS_ENABLED)) {
    processCards();
  } else {
    document.querySelectorAll(Settings.RESULT_SELECTOR).forEach((node) => {
      node.style.display = "inherit";
    });
  }
}

const applyFiltersToAll = () => {
  document.querySelectorAll(Settings.RESULT_SELECTOR).forEach((node) => {
    applyFiltersToCard(node);
  });
}

const updateState = () => {
  // might need to separate filters into a separate list for ease to avoid extra filter updates on other setting changes (if there's ever one)
  const enabled = settingsHandler.get(AppSettings.LIVEABILITY_REGIONS_ENABLED);

  //toggle does not work now
  if (!enabled) {
    return;
  }

  if (advancedFilter) {
    findAllFittingHouses();
  } else {
    applyFiltersToAll();
  }
}

// ADVANCED FILTER

let houseList = [];

const initAdvancedFilter = async () => {
  let nodeNr = 0;
  let externalPageIndex = 1;
  houseList = [];

  clearHouseCards();

  window.scrollTo(0, 0);

  pageHandler.reset();
  pageHandler.hidePaging();
  spinner.show();

  while (true) {
    let url = Settings.GET_RESULT_PAGE(externalPageIndex);
    const response = await fetch(url);

    console.log(response);

    const statusNumber = response.status.toString();

    //also stop at captcha
    if (!statusNumber.startsWith("2") || response.redirected === true) {
      spinner.hide();
      return;
    }

    const html = await response.text();
    const dom = parser.parseFromString(html, "text/html");
    let nodeList = dom.querySelectorAll(Settings.RESULT_SELECTOR);

    for (const e of nodeList) {
      nodeNr++;
      e.setAttribute("data-number-in-order", nodeNr);

      await decorateCardWithData(e); //wait for attributes to filter

      houseList.push(e);

      if (settingsHandler.get(AppSettings.LIVEABILITY_REGIONS_ENABLED) && houseFitsFilters(e)) {
        pageHandler.addCard(e);
      }
    };

    externalPageIndex++;
  }
}

const findAllFittingHouses = () => {
  clearHouseCards();
  pageHandler.reset();

  //TODO Other chart numbering req, because this can cause issues ??

  houseList.forEach(house => {
    if (settingsHandler.get(AppSettings.LIVEABILITY_REGIONS_ENABLED) && houseFitsFilters(house)) {
      pageHandler.addCard(house);
    }
  });

  pageHandler.createPages();
}


//INIT
const messageHandler = (message) => {
  switch (message.type) {
    case MessageTypes.SETTINGS_CHANGE:
      settingsHandler.set(message.setting, message.value);
  }
}

chrome.runtime.onMessage.addListener(messageHandler);

Promise.all([settingsHandler.loadSettings(), dataHandler.prefetchData()]).then(() => { //maybe don't prefetch if not enabled?
  if (settingsHandler.get(AppSettings.LIVEABILITY_REGIONS_ENABLED)) {
    if (advancedFilter) {
      initAdvancedFilter().then(pageHandler.createPages);
    } else {
      toggleLiveabilityRegions();
    }
  }
});

settingsHandler.addChangeListener(updateState);
//TODO: turning on/off with advanced filters dynamically


