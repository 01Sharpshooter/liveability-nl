var mapScoreDevColumnIndex = new Map();
var mapDetailsColumnIndex = new Map();

var urlBasicScores = chrome.runtime.getURL("resources/PC4LBR.csv");
var urlDetailedScores = chrome.runtime.getURL("resources/PC4DIMENSIE.csv");
var csvBasicRows;
var csvDetailedRows;

const fontAwesomeLink = document.head.appendChild(document.createElement("link"));
fontAwesomeLink.rel = "stylesheet";
fontAwesomeLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css";

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

    regionContent.setAttribute("class", `region-content`);
    const chartId = `liveability-chart-${regionNumber}`;
    const chartClass = `chart-${liveabilityScore}`;

    const helpIcon = document.createElement("i");
    helpIcon.className = "far fa-question-circle";
    helpIcon.onclick = (event) => {
      showHelpDialog();
      event.stopPropagation();
    };
    helpIcon.title="Help";
    regionHeader.append(helpIcon);

    let chart;
    $(regionHeader).click(function () {
      $(regionContent).fadeToggle(200);
      if (!chart) {
        chart = createChart(chartId, chartClass, mapChartResults);
        regionContent.appendChild(chart);
      }
    });

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