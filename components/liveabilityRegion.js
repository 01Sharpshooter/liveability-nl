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

const getRegionContent = () => {
    const regionContent = document.createElement("div");
    regionContent.setAttribute("class", `region-content`);

    return regionContent;
}

const getLiveabilityRegion = async (regionNumber, zipCode) => {
    const region = document.createElement("div");
    region.setAttribute("class", `liveability-region`);
    if (!isNaN(zipCode)) { //TODO: check if it still works
        const scores = await dataHandler.fetchBasicScores(zipCode);
        const regionHeader = getLiveabilityHeader(scores.liveabilityScore, scores.developmentScore);
        region.appendChild(regionHeader);

        const regionContent = getRegionContent();

        let chart;
        regionHeader.addEventListener("click", () => {
            if (!chart) {
                const chartId = `liveability-chart-${regionNumber}`;
                const chartClass = `chart-${scores.liveabilityScore}`;
                chart = createChart(chartId, chartClass, zipCode);
                regionContent.appendChild(chart);
            }

            regionContent.classList.toggle("visible");
        });

        region.appendChild(regionContent);
    }


    return region;
}