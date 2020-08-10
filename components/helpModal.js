const urlHelpHtml = getResourceURL("help.html");
var helpDialogDiv;

const createHelpDialog = () => {
    if (helpDialogDiv) {
        return;
    }

    helpDialogDiv = document.createElement("div");
    helpDialogDiv.className = "liveability-help-modal-container";
    helpDialogDiv.id = "liveability-help-dialog";

    $.get(urlHelpHtml, function (html) {
        helpDialogDiv.innerHTML = html;

        const closeSpan = helpDialogDiv.getElementsByClassName("liveability-help-modal-close")[0];
        closeSpan.onclick = function () {
            helpDialogDiv.style.display = "none";
        }

        const liveabilityClasses = helpDialogDiv.getElementsByClassName("liveability-classes")[0];
        let classesList = "";
        Object.entries(LiveabilityScoreMeaning).forEach((liveabilityClass) => {
            classesList += `<li><div class="box box-color-${liveabilityClass[0]}"></div>${liveabilityClass[1]}</li>`;
        });
        liveabilityClasses.innerHTML = classesList;

        const improvementClasses = helpDialogDiv.getElementsByClassName("improvement-classes")[0];
        classesList = "";
        Object.values(DevelopmentScoreMeaning).forEach((improvementClass) => {
            classesList += `<li>${improvementClass}</li>`;
        });
        improvementClasses.innerHTML = classesList;

        const underlyingCategories = helpDialogDiv.getElementsByClassName("underlying-categories")[0];
        classesList = "";
        Object.values(ChartCategories).forEach((category) => {
            classesList += `<li><div class="box" style="background-color: ${category.color};"></div>${category.label}</li>`;
        });
        underlyingCategories.innerHTML = classesList;

        helpDialogDiv.getElementsByClassName("img-help-chart")[0].src = getResourceURL("chart-picture.png");

        $(document).keyup((e) => {
            if (e.which == 27) {
                helpDialogDiv.style.display = "none";
            }
        });

        $(document).mouseup((e) => {
            if ($(helpDialogDiv).has(e.target).length === 0) {
                helpDialogDiv.style.display = "none";
            }
        });

        helpDialogDiv = document.body.appendChild(helpDialogDiv);

    }, 'text');
}

const showHelpDialog = () => {
    if (!helpDialogDiv) {
        createHelpDialog();
    }

    helpDialogDiv.style.display = "block";
}
