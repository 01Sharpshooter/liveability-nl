
var timer;
var e = $(Settings.OBSERVER_SELECTOR)[0];
var observer = new MutationObserver((event) => {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    addLiveabilityRegions();
  }, 500);
})

observer.observe(e, Settings.OBSERVER_OPTIONS);

const addLiveabilityRegions = (csvBasicRows, mapScoreDevColumnIndex) => {
  let regionNumber = 1;
  $.each($(Settings.RESULT_SELECTOR), function () {
    const zipCode = $(this).find(Settings.ZIPCODE_SELECTOR)[0].lastChild.nodeValue.trim().substring(0, 4);

    for (var i = 1; i < csvBasicRows.length; i++) {
      if (csvBasicRows[i].startsWith(zipCode)) {
        const lineArray = csvBasicRows[i].split(',');
        var liveabilityScore = lineArray[mapScoreDevColumnIndex.get(CSVColumns.SCORE18)];
        var developmentScore = lineArray[mapScoreDevColumnIndex.get(CSVColumns.DEVELOPMENT1418)];
        break;
      }
    }

    const region = getLiveabilityRegion(liveabilityScore, developmentScore, regionNumber, zipCode);

    regionNumber++;

    $(this).append(region);
  });
}

const fetchData = () => {
  const urlBasicScores = chrome.runtime.getURL("resources/PC4LBR.csv");

  $.get(urlBasicScores, function (csv) {
    csvBasicRows = csvToArrayOfRows(csv);
    mapScoreDevColumnIndex = csvRowArrayToColumnIndexMap(CSVColumns, csvBasicRows);

    addLiveabilityRegions(csvBasicRows, mapScoreDevColumnIndex);

  }, 'text');

};

fetchData();
