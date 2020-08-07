
var timer;
var e = $(Settings.OBSERVER_SELECTOR)[0];
var observer = new MutationObserver((event) => {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    addLiveabilityRegions();
  }, 500);
})

observer.observe(e, Settings.OBSERVER_OPTIONS);

const addLiveabilityRegions = () => {
  let regionNumber = 1;
  $.each($(Settings.RESULT_SELECTOR), function () {
    const zipCode = $(this).find(Settings.ZIPCODE_SELECTOR)[0].lastChild.nodeValue.trim().substring(0, 4);

    $(this).append(getLiveabilityRegion(regionNumber, zipCode));

    regionNumber++;
  });
}

addLiveabilityRegions();
