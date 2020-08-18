let minLiveabilityScore;
let minDevelopmentScore;
let minServicesScore;
let minSafetyScore;
let regionsEnabled;

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
  if (regionsEnabled &&
    (parseInt(liveabilityRegion.getAttribute("data-score")) < minLiveabilityScore ||
      parseInt(liveabilityRegion.getAttribute("data-development")) < minDevelopmentScore ||
      parseInt(liveabilityRegion.getAttribute("data-services")) < minServicesScore ||
      parseInt(liveabilityRegion.getAttribute("data-safety")) < minSafetyScore )) {
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

  if (regionsEnabled) {
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
  regionsEnabled = await readLocalSetting(AppSettings.LIVEABILITY_REGIONS_ENABLED);
  minLiveabilityScore = await readLocalSetting(AppSettings.MIN_LIVEABILITY_SCORE);
  minDevelopmentScore = await readLocalSetting(AppSettings.MIN_DEVELOPMENT_SCORE);
  minServicesScore = await readLocalSetting(AppSettings.MIN_SERVICES_SCORE);
  minSafetyScore = await readLocalSetting(AppSettings.MIN_SAFETY_SCORE);
}

const readLiveabilityScore = () => {
  readLocalSetting(AppSettings.MIN_LIVEABILITY_SCORE).then((score) => {
    minLiveabilityScore = score;
    applyFiltersToAll();
  });
}

const readDevelopmentScore = () => {
  readLocalSetting(AppSettings.MIN_DEVELOPMENT_SCORE).then((score) => {
    minDevelopmentScore = score;
    applyFiltersToAll();
  });
}

const readServicesScore = () => {
  readLocalSetting(AppSettings.MIN_SERVICES_SCORE).then((score) => {
    minServicesScore = score;
    applyFiltersToAll();
  });
}

const readSafetyScore = () => {
  readLocalSetting(AppSettings.MIN_SAFETY_SCORE).then((score) => {
    minSafetyScore = score;
    applyFiltersToAll();
  });
}

const readEnabled = () => {
  readLocalSetting(AppSettings.LIVEABILITY_REGIONS_ENABLED).then((enabled) => {
    regionsEnabled = enabled;
    toggleLiveabilityRegions();
  });
}

const messageHandler = (message) => {
  switch (message) {
    case AppSettings.LIVEABILITY_REGIONS_ENABLED:
      readEnabled();
      break;
    case AppSettings.MIN_LIVEABILITY_SCORE:
      readLiveabilityScore();
      break;
    case AppSettings.MIN_DEVELOPMENT_SCORE:
      readDevelopmentScore();
      break;
    case AppSettings.MIN_SERVICES_SCORE:
      readServicesScore();
      break;
    case AppSettings.MIN_SAFETY_SCORE:
      readSafetyScore();
      break;
    default:
      break;
  }
}

chrome.runtime.onMessage.addListener(messageHandler);

readSettings().then(prefetchCSV).then(toggleLiveabilityRegions);
