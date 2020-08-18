const filterMap = new Map();

var timer;
var e = document.querySelector(Settings.OBSERVER_SELECTOR);
if (e instanceof Node) {
  var observer = new MutationObserver((event) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      toggleLiveabilityRegions();
    }, 500);
  })

  observer.observe(e, Settings.OBSERVER_OPTIONS);
}

const applyFiltersToCard = (liveabilityRegion) => {
  if (filterMap.get(AppSettings.LIVEABILITY_REGIONS_ENABLED) &&
    (parseInt(liveabilityRegion.getAttribute("data-score")) < filterMap.get(AppSettings.MIN_LIVEABILITY_SCORE) ||
      parseInt(liveabilityRegion.getAttribute("data-development")) < filterMap.get(AppSettings.MIN_DEVELOPMENT_SCORE) ||
      parseInt(liveabilityRegion.getAttribute("data-houses")) < filterMap.get(AppSettings.MIN_HOUSES_SCORE) ||
      parseInt(liveabilityRegion.getAttribute("data-residents")) < filterMap.get(AppSettings.MIN_RESIDENTS_SCORE) ||
      parseInt(liveabilityRegion.getAttribute("data-services")) < filterMap.get(AppSettings.MIN_SERVICES_SCORE) ||
      parseInt(liveabilityRegion.getAttribute("data-safety")) < filterMap.get(AppSettings.MIN_SAFETY_SCORE) ||
      parseInt(liveabilityRegion.getAttribute("data-environment")) < filterMap.get(AppSettings.MIN_ENVIRONMENT_SCORE))) {
    liveabilityRegion.parentNode.style.display = "none";
  } else {
    liveabilityRegion.parentNode.style.display = "inherit";
  }
}

const addLiveabilityRegions = () => {
  let regionNumber = 1;
  document.querySelectorAll(Settings.RESULT_SELECTOR).forEach((resultCard) => {
    const zipCode = resultCard.querySelector(Settings.ZIPCODE_SELECTOR).lastChild.nodeValue.trim().substring(0, 4);

    getLiveabilityRegion(regionNumber, zipCode).then((region) => {
      resultCard.appendChild(region);

      applyFiltersToCard(region);
    });

    regionNumber++;
  });
}

const toggleLiveabilityRegions = () => {
  document.querySelectorAll(".liveability-region").forEach((node) => node.remove());

  if (filterMap.get(AppSettings.LIVEABILITY_REGIONS_ENABLED)) {
    addLiveabilityRegions();
  } else {
    document.querySelectorAll(Settings.RESULT_SELECTOR).forEach((node) => {
      node.style.display = "inherit";
    });
  }
}

const applyFiltersToAll = () => {
  document.querySelectorAll(".liveability-region").forEach((node) => {
    applyFiltersToCard(node);
  });
}

const readSettings = async () => {
  filterMap.set(AppSettings.LIVEABILITY_REGIONS_ENABLED, await readLocalSetting(AppSettings.LIVEABILITY_REGIONS_ENABLED));
  filterMap.set(AppSettings.MIN_LIVEABILITY_SCORE, await readLocalSetting(AppSettings.MIN_LIVEABILITY_SCORE));
  filterMap.set(AppSettings.MIN_DEVELOPMENT_SCORE, await readLocalSetting(AppSettings.MIN_DEVELOPMENT_SCORE));
  filterMap.set(AppSettings.MIN_HOUSES_SCORE, await readLocalSetting(AppSettings.MIN_HOUSES_SCORE));
  filterMap.set(AppSettings.MIN_RESIDENTS_SCORE, await readLocalSetting(AppSettings.MIN_RESIDENTS_SCORE));
  filterMap.set(AppSettings.MIN_SERVICES_SCORE, await readLocalSetting(AppSettings.MIN_SERVICES_SCORE));
  filterMap.set(AppSettings.MIN_SAFETY_SCORE, await readLocalSetting(AppSettings.MIN_SAFETY_SCORE));
  filterMap.set(AppSettings.MIN_ENVIRONMENT_SCORE, await readLocalSetting(AppSettings.MIN_ENVIRONMENT_SCORE));
}

const setScoreFilter = (appSetting) => {
  readLocalSetting(appSetting).then((score) => {
    filterMap.set(appSetting, score);
    applyFiltersToAll();
  });
}

const readEnabled = () => {
  readLocalSetting(AppSettings.LIVEABILITY_REGIONS_ENABLED).then((enabled) => {
    filterMap.set(AppSettings.LIVEABILITY_REGIONS_ENABLED, enabled)
    toggleLiveabilityRegions();
  });
}

const messageHandler = (message) => {
  switch (message) {
    case AppSettings.LIVEABILITY_REGIONS_ENABLED:
      readEnabled();
      break;
    default:
      setScoreFilter(message);
      break;
  }
}

chrome.runtime.onMessage.addListener(messageHandler);

readSettings().then(prefetchCSV).then(toggleLiveabilityRegions);
