var csvProcessed;

const fontAwesomeLink = document.head.appendChild(document.createElement("link"));
fontAwesomeLink.rel = "stylesheet";
fontAwesomeLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css";

const getHelpIcon = () => {
    const helpIcon = document.createElement("i");
    helpIcon.className = "far fa-question-circle";
    helpIcon.onclick = (event) => {
        showHelpDialog();
        event.stopPropagation();
    };
    helpIcon.title = "Help";
    return helpIcon;
}

const getScoreDiv = (liveabilityScore, developmentScore) => {
    const scoreDiv = document.createElement("div");
    const liveabilitySpan = document.createElement("span");
    liveabilitySpan.innerHTML = `Liveability: ${LiveabilityScoreMeaning[liveabilityScore] || 'N/A'}`;
    const developmentSpan = document.createElement("span");
    developmentSpan.innerHTML = `Improvement: ${DevelopmentScoreMeaning[developmentScore] || 'N/A'}`;
    scoreDiv.appendChild(liveabilitySpan);
    scoreDiv.appendChild(developmentSpan);
    scoreDiv.setAttribute("class", `region-header-text`);
    return scoreDiv;
}

const getLiveabilityHeader = (liveabilityScore, developmentScore) => {
    const regionHeader = document.createElement("div");
    regionHeader.setAttribute("class", `region-header-${liveabilityScore}`);

    const scoreDiv = getScoreDiv(liveabilityScore, developmentScore);
    regionHeader.appendChild(scoreDiv);

    const helpIcon = getHelpIcon();
    regionHeader.append(helpIcon);

    return regionHeader;
}

const fetchChartCSV = async () => {
    const urlDetailedScores = chrome.runtime.getURL("resources/PC4DIMENSIE.csv");

    const csv = await $.get(urlDetailedScores);

    const csvRows = csvToArrayOfRows(csv);
    const mapColumnIndex = csvRowArrayToColumnIndexMap(CSVColumns, csvRows);

    csvProcessed = { csvRows: csvRows, mapColumnIndex: mapColumnIndex };
}

const fetchChartData = async (zipCode) => {
    const mapChartResults = new Map();
    if (!csvProcessed) {
        await fetchChartCSV();
    }

    for (var i = 1; i < csvProcessed.csvRows.length; i++) {
        csvRow = csvProcessed.csvRows[i];
        if (csvRow.startsWith(zipCode)) {
            const lineArray = csvRow.split(',');
            csvProcessed.mapColumnIndex.forEach((value, key) => {
                mapChartResults.set(key, lineArray[value]);
            })
            return mapChartResults;
        }
    }


}

const getRegionContent = (liveabilityScore, regionNumber, zipCode) => {
    const regionContent = document.createElement("div");
    regionContent.setAttribute("class", `region-content`);

    fetchChartData(zipCode).then((mapChartResults) => {

        const chartId = `liveability-chart-${regionNumber}`;
        const chartClass = `chart-${liveabilityScore}`;

        chart = createChart(chartId, chartClass, mapChartResults);
        regionContent.appendChild(chart);

    })

    return regionContent;
}

const getLiveabilityRegion = (liveabilityScore, developmentScore, regionNumber, zipCode) => {
    const region = document.createElement("div");
    const regionHeader = getLiveabilityHeader(liveabilityScore, developmentScore);

    $(regionHeader).click(function () {
        let regionContent = region.getElementsByClassName("region-content")[0];

        if (!regionContent) {
            regionContent = getRegionContent(liveabilityScore, regionNumber, zipCode);
            region.appendChild(regionContent);
        }

        $(regionContent).fadeToggle(200);
    });

    region.appendChild(regionHeader);
    region.setAttribute("class", `liveability-region`);
    return region;
}
