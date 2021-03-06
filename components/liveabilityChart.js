const chartScript = document.createElement('script');
chartScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.min.js';
document.body.appendChild(chartScript);

const chartLabelsScript = document.createElement("script");
chartLabelsScript.src = getResourceURL("chartScripts.js");
document.body.appendChild(chartLabelsScript);

const createChart = (chartId, chartClass, chartMap) => {
  const chartDiv = document.createElement("div");
  const canvas = document.createElement("canvas");
  const script = document.createElement("script");

  canvas.id = chartId;
  canvas.setAttribute("class", chartClass);

  const chartText = document.createTextNode(`
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
                label: "${ChartCategories.HOUSES.label}",
                borderColor: "${ChartCategories.HOUSES.color}",
                fill: false
              }, { 
                data: [${chartMap.get(CSVColumns.RESIDENTS12)},${chartMap.get(CSVColumns.RESIDENTS14)},${chartMap.get(CSVColumns.RESIDENTS16)},${chartMap.get(CSVColumns.RESIDENTS18)}],
                label: "${ChartCategories.RESIDENTS.label}",
                borderColor: "${ChartCategories.RESIDENTS.color}",
                fill: false
              }, { 
                data: [${chartMap.get(CSVColumns.SERVICES12)},${chartMap.get(CSVColumns.SERVICES14)},${chartMap.get(CSVColumns.SERVICES16)},${chartMap.get(CSVColumns.SERVICES18)}],
                label: "${ChartCategories.SERVICES.label}",
                borderColor: "${ChartCategories.SERVICES.color}",
                fill: false
              }, { 
                data: [${chartMap.get(CSVColumns.SAFETY12)},${chartMap.get(CSVColumns.SAFETY14)},${chartMap.get(CSVColumns.SAFETY16)},${chartMap.get(CSVColumns.SAFETY18)}],
                label: "${ChartCategories.SAFETY.label}",
                borderColor: "${ChartCategories.SAFETY.color}",
                fill: false
              }, { 
                data: [${chartMap.get(CSVColumns.ENVIRONMENT12)},${chartMap.get(CSVColumns.ENVIRONMENT14)},${chartMap.get(CSVColumns.ENVIRONMENT16)},${chartMap.get(CSVColumns.ENVIRONMENT18)}],
                label: "${ChartCategories.ENVIRONMENT.label}",
                borderColor: "${ChartCategories.ENVIRONMENT.color}",
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
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        const value = parseFloat(tooltipItem.value);
                        return getChartInterval(value)[1].name;
                    }
                }
            },
            animation: {
              duration: 500
            },
            scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true,
                      callback: function(value, index, values) {
                        return chartYLabels[value];
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