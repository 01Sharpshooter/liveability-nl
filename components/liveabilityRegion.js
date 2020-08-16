var csvChartProcessed;
var csvScoresProcessed;

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

const fetchScores = async (zipCode) => {
    if (!csvScoresProcessed) {
        csvScoresProcessed = await fetchCSV("PC4LBR.csv");
    }

    const lineArray = csvScoresProcessed.csvZipCodeRowMap.get(zipCode).split(',');
    const liveabilityScore = lineArray[csvScoresProcessed.mapColumnIndex.get(CSVColumns.SCORE18)];
    const developmentScore = lineArray[csvScoresProcessed.mapColumnIndex.get(CSVColumns.DEVELOPMENT1418)];

    return { liveabilityScore: liveabilityScore, developmentScore: developmentScore };
}


const getScoreDiv = (liveabilityScore, developmentScore) => {
    const scoreDiv = document.createElement("div");
    const liveabilitySpan = document.createElement("span");
    liveabilitySpan.innerHTML = `Liveability: ${LiveabilityClasses[liveabilityScore]?.meaning || 'N/A'}`;
    const developmentSpan = document.createElement("span");
    developmentSpan.innerHTML = `Development: ${DevelopmentScoreMeaning[developmentScore] || 'N/A'}`;
    scoreDiv.appendChild(liveabilitySpan);
    scoreDiv.appendChild(developmentSpan);
    scoreDiv.setAttribute("class", `region-header-text`);
    return scoreDiv;
}

const getLiveabilityHeader = (liveabilityScore, developmentScore) => {
    const regionHeader = document.createElement("div");
    regionHeader.setAttribute("class", `region-header`);
    regionHeader.style.backgroundColor = LiveabilityClasses[liveabilityScore]?.backgroundColor;
    regionHeader.style.color = LiveabilityClasses[liveabilityScore]?.fontColor;

    const scoreDiv = getScoreDiv(liveabilityScore, developmentScore);
    regionHeader.appendChild(scoreDiv);

    const helpIcon = getHelpIcon();
    regionHeader.append(helpIcon);

    addRippleOnClick(regionHeader);

    return regionHeader;
}

const fetchChartData = async (zipCode) => {
    const mapChartResults = new Map();
    if (!csvChartProcessed) {
        csvChartProcessed = await fetchCSV("PC4DIMENSIE.csv");
    }

    const lineArray = csvChartProcessed.csvZipCodeRowMap.get(zipCode).split(',');
    csvChartProcessed.mapColumnIndex.forEach((value, key) => {
        mapChartResults.set(key, lineArray[value]);
    })

    return mapChartResults;
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

const getLiveabilityRegion = async (regionNumber, zipCode) => {
    const region = document.createElement("div");
    region.setAttribute("class", `liveability-region`);
    let regionContent;

    const scores = await fetchScores(zipCode);
    const regionHeader = getLiveabilityHeader(scores.liveabilityScore, scores.developmentScore);

    regionHeader.addEventListener("click", () => {
        if (!regionContent) {
            regionContent = getRegionContent(scores.liveabilityScore, regionNumber, zipCode);
            region.appendChild(regionContent);
        }

        regionContent.classList.toggle("visible");
    });

    region.setAttribute("data-score", scores.liveabilityScore);
    region.appendChild(regionHeader);

    return region;
}