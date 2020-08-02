const chartScript = document.createElement('script');
chartScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.min.js';
document.body.appendChild(chartScript);

const createChart = (chartId, chartClass, chartMap) => {
    const chartDiv = document.createElement("div");
    const canvas = document.createElement("canvas");
    const script = document.createElement("script");

    canvas.id = chartId;
    canvas.setAttribute("class", chartClass);

    const chartText = document.createTextNode(`
    var ChartScoreMeaning = Object.freeze({
      "0": "National Average",
      "0.05": "Slightly Above Average",
      "0.1": "Above Average",
      "0.2": "Highly Above Average",
      "-0.05": "Slightly Below Average",
      "-0.1": "Below Average",
      "-0.2": "Way Below Average"
    });
      new Chart(document.getElementById("${chartId}"), {
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
    chartDiv.appendChild(canvas);
    chartDiv.appendChild(script);

    return chartDiv;
}