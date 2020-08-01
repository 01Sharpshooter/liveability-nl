document.body.appendChild(document.createElement('script')).src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.min.js';

var url = chrome.runtime.getURL("PC4LBR.csv")
var klIndex = -1;
var vklIndex = -1;
var csv;

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

const getChart = (canvasId) => {
    var script = document.createElement("script");
    var chartText = document.createTextNode(`
    new Chart(document.getElementById("${canvasId}"), {
        type: 'line',
        data: {
          labels: [1500,1600,1700,1750,1800,1850,1900,1950,1999,2050],
          datasets: [{ 
              data: [86,114,106,106,107,111,133,221,783,2478],
              label: "Africa",
              borderColor: "#3e95cd",
              fill: false
            }, { 
              data: [282,350,411,502,635,809,947,1402,3700,5267],
              label: "Asia",
              borderColor: "#8e5ea2",
              fill: false
            }, { 
              data: [168,170,178,190,203,276,408,547,675,734],
              label: "Europe",
              borderColor: "#3cba9f",
              fill: false
            }, { 
              data: [40,20,10,16,24,38,74,167,508,784],
              label: "Latin America",
              borderColor: "#e8c3b9",
              fill: false
            }, { 
              data: [6,3,2,2,7,26,82,172,312,433],
              label: "North America",
              borderColor: "#c45850",
              fill: false
            }
          ]
        },
        options: {
          title: {
            display: true,
            text: 'World population per region (in millions)'
          }
        }
      });`);

      script.appendChild(chartText);
      return script;
}

const addRegion = () => {
    let regionNumber = 1;
    $.each($(".search-result"), function () {
        const zipCode = $(this).find(".search-result__header-subtitle.fd-m-none").text().trim().substring(0, 4);
        for (var i = 1; i < csv.length; i++) {
            if (csv[i].startsWith(zipCode)) {
                var klScore = csv[i].split(',')[klIndex];
                var vklScore = csv[i].split(',')[vklIndex];
                break;
            }
        }

        const region = document.createElement("div");
        const regionHeader = document.createElement("div");
        const regionContent = document.createElement("div");
        const canvas = document.createElement("canvas");
        const liveabilitySpan = document.createElement("span")
        liveabilitySpan.innerHTML = `Liveability Score: ${klScore || 'N/A'}`;
        const developmentSpan = document.createElement("span");
        developmentSpan.innerHTML = `Development Score: ${vklScore || 'N/A'}`;

        regionHeader.appendChild(liveabilitySpan);
        regionHeader.appendChild(developmentSpan);
        regionHeader.setAttribute("class", `region-header-${klScore}`);

        $(regionHeader).click(function () {

            $header = $(this);
            $content = $header.next();
            $content.slideToggle(1000);      
        });

        canvas.id = `liveability-chart-${regionNumber}`;
        canvas.width = "800";
        canvas.height = "450";

        regionContent.appendChild(canvas);
        regionContent.setAttribute("class", `region-content`);
        setTimeout(() => {regionContent.appendChild(getChart(canvas.id))}, 2000);

        region.appendChild(regionHeader);
        region.appendChild(regionContent);
        region.setAttribute("class", `liveability-region`);

        regionNumber++;

        $(this).append(region);
    });
}

const fetchData = () => {
    $.get(url, function (data) {
        csv = data.split('\n');
        const header = csv[0].split(',');
        klIndex = header.indexOf('KL18');
        vklIndex = header.indexOf('VKL1418');

        addRegion();
    }, 'text')
};

fetchData();