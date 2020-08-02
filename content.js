const chartScript = document.createElement('script');
chartScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.min.js';
document.body.appendChild(chartScript);

var mapScoreDevIndex = new Map();
var mapDetailsIndex = new Map();

var urlBasicScores = chrome.runtime.getURL("resources/PC4LBR.csv");
var urlDetailedScores = chrome.runtime.getURL("resources/PC4DIMENSIE.csv");
var csvBasic;
var csvDetailed;

var timer;
var e = document.getElementsByClassName('container search-main')[0];
var observer = new MutationObserver(function (event) {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    addRegion();
  }, 200);
})

observer.observe(e, {
  attributes: true,
  attributeFilter: ['class'],
  childList: false,
  characterData: false
});

const getChart = (canvasId, chartMap) => {
  var script = document.createElement("script");
  var chartText = document.createTextNode(`
  var ChartScoreMeaning = Object.freeze({
    "0": "National Average",
    "0.05": "Slightly Above Average",
    "0.1": "Above Average",
    "0.2": "Highly Above Average",
    "-0.05": "Slightly Below Average",
    "-0.1": "Below Average",
    "-0.2": "Way Below Average"
  });
    new Chart(document.getElementById("${canvasId}"), {
        type: 'line',
        data: {
          labels: [2012,2014,2016,2018],
          datasets: [{ 
              data: [0,0,0,0],
              label: "National Average",
              borderColor: "#ff4f00",
              pointRadius: 0,
              fill: false
            }, { 
              data: [${chartMap.get(CSVColumns.HOUSES12)},${chartMap.get(CSVColumns.HOUSES14)},${chartMap.get(CSVColumns.HOUSES16)},${chartMap.get(CSVColumns.HOUSES18)}],
              label: "Houses",
              borderColor: "#3e95cd",
              fill: false
            }, { 
              data: [${chartMap.get(CSVColumns.RESIDENTS12)},${chartMap.get(CSVColumns.RESIDENTS14)},${chartMap.get(CSVColumns.RESIDENTS16)},${chartMap.get(CSVColumns.RESIDENTS18)}],
              label: "Residents",
              borderColor: "#8e5ea2",
              fill: false
            }, { 
              data: [${chartMap.get(CSVColumns.SERVICES12)},${chartMap.get(CSVColumns.SERVICES14)},${chartMap.get(CSVColumns.SERVICES16)},${chartMap.get(CSVColumns.SERVICES18)}],
              label: "Services",
              borderColor: "#3cba9f",
              fill: false
            }, { 
              data: [${chartMap.get(CSVColumns.SAFETY12)},${chartMap.get(CSVColumns.SAFETY14)},${chartMap.get(CSVColumns.SAFETY16)},${chartMap.get(CSVColumns.SAFETY18)}],
              label: "Safety",
              borderColor: "#F1C40F",
              fill: false
            }, { 
              data: [${chartMap.get(CSVColumns.ENVIRONMENT12)},${chartMap.get(CSVColumns.ENVIRONMENT14)},${chartMap.get(CSVColumns.ENVIRONMENT16)},${chartMap.get(CSVColumns.ENVIRONMENT18)}],
              label: "Environment",
              borderColor: "#c45850",
              fill: false
            }
          ]
        },
        options: {
          title: {
            display: true,
            text: 'Liveability scores compared to the national average'
          },
          legend: {
            labels: {
              filter: function(item, chart) {
                  return !item.text.includes('National Average');
              }
            }
          },
          animation: {
            duration: 0
          },
          scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    callback: function(value, index, values) {
                      return ChartScoreMeaning[value.toString()]
                    }
                }
            }]
          }
        }
      });`);

  script.appendChild(chartText);
  return script;
}

const addRegion = () => {
  let regionNumber = 1;
  $.each($(".search-result"), function () {
    const mapChartResults = new Map();
    const zipCode = $(this).find(".search-result__header-subtitle.fd-m-none").text().trim().substring(0, 4);
    for (var i = 1; i < csvBasic.length; i++) {
      if (csvBasic[i].startsWith(zipCode)) {
        var liveabilityScore = csvBasic[i].split(',')[mapScoreDevIndex.get(CSVColumns.SCORE18)];
        var developmentScore = csvBasic[i].split(',')[mapScoreDevIndex.get(CSVColumns.DEVELOPMENT1418)];
        break;
      }
    }

    for (var i = 1; i < csvDetailed.length; i++) {
      if (csvDetailed[i].startsWith(zipCode)) {
        var lineArray = csvDetailed[i].split(',');
        mapDetailsIndex.forEach((value, key) => {
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
    const canvas = document.createElement("canvas");
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

    canvas.id = `liveability-chart-${regionNumber}`;
    canvas.width = "800";
    canvas.height = "450";
    canvas.setAttribute("class", `chart-${liveabilityScore}`);

    regionContent.appendChild(canvas);
    regionContent.setAttribute("class", `region-content`);
    setTimeout(() => { regionContent.appendChild(getChart(canvas.id, mapChartResults)) }, 2000);

    region.appendChild(regionHeader);
    region.appendChild(regionContent);
    region.setAttribute("class", `liveability-region`);

    regionNumber++;

    $(this).append(region);
  });
}

const fetchData = () => {
  $.get(urlBasicScores, function (data) {
    csvBasic = data.split('\n');
    const header = csvBasic[0].split(',');
    mapScoreDevIndex.set(CSVColumns.SCORE18, header.indexOf(CSVColumns.SCORE18));
    mapScoreDevIndex.set(CSVColumns.DEVELOPMENT1418, header.indexOf(CSVColumns.DEVELOPMENT1418));
  }, 'text');

  $.get(urlDetailedScores, function (data) {
    csvDetailed = data.split('\n');
    const header = csvDetailed[0].split(',');

    header[header.length - 1] = header[header.length - 1].trim();

    for (const [key, value] of Object.entries(CSVColumns)) {
      mapDetailsIndex.set(value, header.indexOf(value));
    }

    addRegion();
  }, 'text');
};

fetchData();