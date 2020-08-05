const urlHelpHtml = chrome.runtime.getURL("resources/help.html");
var helpDialogDiv;

const createHelpDialog = () => {
    if (helpDialogDiv) {
        return;
    }

    helpDialogDiv = document.createElement("div");
    helpDialogDiv.className = "liveability-help-modal";
    helpDialogDiv.id = "liveability-help-dialog";

    $.get(urlHelpHtml, function (html) {
        helpDialogDiv.innerHTML = html;

        const closeSpan = helpDialogDiv.getElementsByClassName("liveability-help-modal-close")[0];
        closeSpan.onclick = function () {
            helpDialogDiv.style.display = "none";
        }

        const liveabilityClasses = helpDialogDiv.getElementsByClassName("liveability-classes")[0];
        let classesList = "";
        Object.values(LiveabilityScoreMeaning).forEach((liveabilityClass) => {
            classesList += `<li>${liveabilityClass}</li>`;
        });
        liveabilityClasses.innerHTML = classesList;
        helpDialogDiv = document.body.appendChild(helpDialogDiv);

    }, 'text');
}

const showHelpDialog = () => {
    if (!helpDialogDiv) {
        createHelpDialog();
    }

    helpDialogDiv.style.display = "block";
}
