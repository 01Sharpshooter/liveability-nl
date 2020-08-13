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

const addLiveabilityRegions = () => {
  let regionNumber = 1;
  $.each($(Settings.RESULT_SELECTOR), function () {
    const zipCode = $(this).find(Settings.ZIPCODE_SELECTOR)[0].lastChild.nodeValue.trim().substring(0, 4);

    $(this).append(getLiveabilityRegion(regionNumber, zipCode));

    regionNumber++;
  });
}

const toggleLiveabilityRegions = () => {
  document.querySelectorAll(".liveability-region").forEach((node) => node.remove());

  chrome.storage.local.get(AppSettings.LIVEABILITY_REGIONS_ENABLED, (result) => {
    if (result[AppSettings.LIVEABILITY_REGIONS_ENABLED]) {
      addLiveabilityRegions();
    }
  });
}

const messageHandler = (message) => {
  if (message = AppMessages.READ_ENABLED) {
    toggleLiveabilityRegions();
  }
}

chrome.runtime.onMessage.addListener(messageHandler);

toggleLiveabilityRegions();
