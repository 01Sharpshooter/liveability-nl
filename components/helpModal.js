var helpDialogDiv;

const createHelpDialog = () => {
    if (helpDialogDiv) {
        return;
    }

    helpDialogDiv = document.createElement("div");
    helpDialogDiv.className = "liveability-help-modal-container";
    helpDialogDiv.id = "liveability-help-dialog";

    getResource("help.html").then((html) => {
        helpDialogDiv.innerHTML = html;

        const modalWindow = helpDialogDiv.querySelector(".liveability-help-modal");

        const closeSpan = helpDialogDiv.getElementsByClassName("liveability-help-modal-close")[0];
        closeSpan.onclick = () => {
            helpDialogDiv.style.display = "none";
        }

        const liveabilityClasses = helpDialogDiv.getElementsByClassName("liveability-classes")[0];
        let classesList = "";
        Object.entries(LiveabilityClasses).forEach((liveabilityClass) => {
            const backgroundColor = liveabilityClass[1].backgroundColor
            classesList += `<li><div class="box" style="background-color: ${backgroundColor};"></div>${liveabilityClass[1].meaning}</li>`;
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

        document.body.addEventListener("keydown", (e) => {
            if (e.keyCode == 27 && helpDialogDiv.style.display != "none") {
                e.stopImmediatePropagation();
            }
        });

        document.addEventListener("keyup", (e) => {
            if (e.which == 27) {
                helpDialogDiv.style.display = "none";
            }
        });

        document.addEventListener("mouseup", (e) => {
            if (!modalWindow.contains(e.target)) {
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
