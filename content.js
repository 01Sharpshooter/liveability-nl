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
        var zipCode = $(this).find(".search-result__header-subtitle.fd-m-none").text().trim().substring(0, 4);
        var i;
        var klScore;
        var vklScore;
        for (i = 1; i < csv.length; i++) {
            if (csv[i].startsWith(zipCode)) {
                klScore = csv[i].split(',')[klIndex];
                vklScore = csv[i].split(',')[vklIndex];
                break;
            }
        }
        $(this).append(`<div class="liveability-region-${klScore}">
                        Liveability Score: ${klScore || 'N/A'}
                        </br>
                        Development Score: ${vklScore || 'N/A'}
                        </div>`);
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