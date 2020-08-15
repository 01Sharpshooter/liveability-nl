var timer;
var e = $(Settings.OBSERVER_SELECTOR)[0];
if (e instanceof Node) {
  var observer = new MutationObserver((event) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      toggleLiveabilityRegions();
    }, 500);
  })

  observer.observe(e, Settings.OBSERVER_OPTIONS);
}

const filterCardByMinScore = (liveabilityRegion, minScore) => {
  if (parseInt(liveabilityRegion.getAttribute("data-score")) < minScore) {
    liveabilityRegion.parentNode.style.display = "none";
  } else {
    liveabilityRegion.parentNode.style.display = "inherit";
  }
}

const addLiveabilityRegions = () => {
  let regionNumber = 1;
  chrome.storage.local.get(AppSettings.MIN_LIVEABILITY_SCORE, (result) => {
    const minScore = result[AppSettings.MIN_LIVEABILITY_SCORE];
    $.each($(Settings.RESULT_SELECTOR), function () {
      const zipCode = $(this).find(Settings.ZIPCODE_SELECTOR)[0].lastChild.nodeValue.trim().substring(0, 4);

      getLiveabilityRegion(regionNumber, zipCode).then((region) => {
        $(this).append(region);

        filterCardByMinScore(region, minScore);
      });
    });

    regionNumber++;
  });
}

const filterAllCardsByMinScore = () => {
  chrome.storage.local.get(AppSettings.MIN_LIVEABILITY_SCORE, (result) => {
    const minScore = result[AppSettings.MIN_LIVEABILITY_SCORE];

    document.querySelectorAll(".liveability-region").forEach((node) => {
      filterCardByMinScore(node, minScore);
    });
  });
}

const toggleLiveabilityRegions = () => {
  document.querySelectorAll(".liveability-region").forEach((node) => node.remove());

  chrome.storage.local.get(AppSettings.LIVEABILITY_REGIONS_ENABLED, (result) => {
    if (result[AppSettings.LIVEABILITY_REGIONS_ENABLED]) {
      addLiveabilityRegions();
    } else {
      document.querySelectorAll(Settings.RESULT_SELECTOR).forEach((node) => {
        node.style.display = "inherit";
      });
    }
  });
}

const messageHandler = (message) => {
  switch (message) {
    case AppMessages.READ_ENABLED:
      toggleLiveabilityRegions();
      break;
    case AppMessages.READ_MIN_LIV_SCORE:
      filterAllCardsByMinScore();
      break;
    default:
      break;
  }
}

chrome.runtime.onMessage.addListener(messageHandler);

toggleLiveabilityRegions();
