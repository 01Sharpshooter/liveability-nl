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
})

const addRegion = () => {
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
        const liveabilitySpan = document.createElement("span");
        liveabilitySpan.innerHTML = `Liveability Score: ${klScore || 'N/A'}`;
        const developmentSpan = document.createElement("span");
        developmentSpan.innerHTML = `Development Score: ${vklScore || 'N/A'}`;

        region.setAttribute("class", `liveability-region-${klScore}`)
        region.appendChild(liveabilitySpan);
        region.appendChild(developmentSpan);

        $(this).append(region)
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