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
        csvScoresProcessed = await fetchCSV(getResourceURL("PC4LBR.csv"));
    }

    const lineArray = csvScoresProcessed.csvZipCodeRowMap.get(zipCode).split(',');
    const liveabilityScore = lineArray[csvScoresProcessed.mapColumnIndex.get(CSVColumns.SCORE18)];
    const developmentScore = lineArray[csvScoresProcessed.mapColumnIndex.get(CSVColumns.DEVELOPMENT1418)];

    return { liveabilityScore: liveabilityScore, developmentScore: developmentScore };
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

    addRippleOnClick(regionHeader);

    return regionHeader;
}

const fetchChartData = async (zipCode) => {
    const mapChartResults = new Map();
    if (!csvChartProcessed) {
        csvChartProcessed = await fetchCSV(getResourceURL("PC4DIMENSIE.csv"));
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

const getLiveabilityRegion = (regionNumber, zipCode) => {
    const region = document.createElement("div");
    region.setAttribute("class", `liveability-region`);
    let regionContent;

    fetchScores(zipCode).then((scores) => {
        const regionHeader = getLiveabilityHeader(scores.liveabilityScore, scores.developmentScore);

        $(regionHeader).click(function () {
            if (!regionContent) {
                regionContent = getRegionContent(scores.liveabilityScore, regionNumber, zipCode);
                region.appendChild(regionContent);
            }

            $(regionContent).fadeToggle(200);
        });

        region.appendChild(regionHeader);
    });

    return region;
}