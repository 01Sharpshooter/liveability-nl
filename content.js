var mapScoreDevColumnIndex = new Map();
var mapDetailsColumnIndex = new Map();

var urlBasicScores = chrome.runtime.getURL("resources/PC4LBR.csv");
var urlDetailedScores = chrome.runtime.getURL("resources/PC4DIMENSIE.csv");
var csvBasicRows;
var csvDetailedRows;

var timer;
var e = $(Settings.OBSERVER_SELECTOR)[0];
var observer = new MutationObserver(function (event) {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    addLiveabilityRegions();
  }, 500);
})

observer.observe(e, Settings.OBSERVER_OPTIONS);

const addLiveabilityRegions = () => {
  let regionNumber = 1;
  $.each($(Settings.RESULT_SELECTOR), function () {
    const mapChartResults = new Map();
    const zipCode = $(this).find(Settings.ZIPCODE_SELECTOR)[0].lastChild.nodeValue.trim().substring(0, 4);

    for (var i = 1; i < csvBasicRows.length; i++) {
      if (csvBasicRows[i].startsWith(zipCode)) {
        const lineArray = csvBasicRows[i].split(',');
        var liveabilityScore = lineArray[mapScoreDevColumnIndex.get(CSVColumns.SCORE18)];
        var developmentScore = lineArray[mapScoreDevColumnIndex.get(CSVColumns.DEVELOPMENT1418)];
        break;
      }
    }

    for (var i = 1; i < csvDetailedRows.length; i++) {
      if (csvDetailedRows[i].startsWith(zipCode)) {
        const lineArray = csvDetailedRows[i].split(',');
        mapDetailsColumnIndex.forEach((value, key) => {
          mapChartResults.set(key, lineArray[value]);
        })
        break;
      }
    }

    const region = document.createElement("div");
    const regionHeader = document.createElement("div");
    const headerText = document.createElement("div");
    const spinner = document.createElement("div");
    const regionContent = document.createElement("div");
    const liveabilitySpan = document.createElement("span")
    liveabilitySpan.innerHTML = `Liveability: ${LiveabilityScoreMeaning[liveabilityScore] || 'N/A'}`;
    const developmentSpan = document.createElement("span");
    developmentSpan.innerHTML = `Improvement: ${DevelopmentScoreMeaning[developmentScore] || 'N/A'}`;

    headerText.appendChild(liveabilitySpan);
    headerText.appendChild(developmentSpan);
    headerText.setAttribute("class", `region-header-text`);

    regionHeader.setAttribute("class", `region-header-${liveabilityScore}`);
    regionHeader.appendChild(headerText);

    spinner.setAttribute("class", `loader`);
    regionHeader.appendChild(spinner)

    $(regionHeader).click(function () {
      if (!$(regionContent).is(":visible")) {
        $(spinner).show();
      }
      $header = $(this);
      $content = $header.next();
      $content.slideToggle(400, () => { $(spinner).hide(); });
    });

    regionContent.setAttribute("class", `region-content`);
    const chartId = `liveability-chart-${regionNumber}`;
    const chartClass = `chart-${liveabilityScore}`;

    setTimeout(() => { regionContent.appendChild(createChart(chartId, chartClass, mapChartResults)) }, 500);

    region.appendChild(regionHeader);
    region.appendChild(regionContent);
    region.setAttribute("class", `liveability-region`);

    regionNumber++;

    $(this).append(region);
  });
}

const fetchData = () => {
  $.get(urlBasicScores, function (csv) {
    csvBasicRows = csvToArrayOfRows(csv);
    mapScoreDevColumnIndex = csvRowArrayToColumnIndexMap(CSVColumns, csvBasicRows);
  }, 'text');

  $.get(urlDetailedScores, function (csv) {
    csvDetailedRows = csvToArrayOfRows(csv);
    mapDetailsColumnIndex = csvRowArrayToColumnIndexMap(CSVColumns, csvDetailedRows);

    addLiveabilityRegions();
  }, 'text');
};

fetchData();