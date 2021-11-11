const getPagination = (numberOfPages, activePage, onClick) => {
    const range = 3;

    const container = document.createElement("div");
    container.className = "pagination";

    const btnFirst = document.createElement("button");
    btnFirst.innerHTML = "&laquo;";
    btnFirst.addEventListener("click", (e) => {
        onClick(1);
        container.replaceWith(getPagination(numberOfPages, 1, onClick));
        window.scrollTo(0, 0);
    });

    container.appendChild(btnFirst);

    let active = parseInt(activePage);
    let start = Math.max(1, active - range)
    let end = Math.min(active + range, parseInt(numberOfPages))

    for (let i = start; i <= end; i++) {
        const page = document.createElement("button");
        page.innerText = i;
        page.addEventListener("click", (e) => {
            onClick(i);
            active = parseInt(e.currentTarget.innerText);
            container.replaceWith(getPagination(numberOfPages, active, onClick));
            window.scrollTo(0, 0);
        });

        if (parseInt(activePage) == i) {
            page.classList.add("active");
        }

        container.append(page);

    }

    const btnLast = document.createElement("button");
    btnLast.innerHTML = "&raquo;";
    btnLast.addEventListener("click", (e) => {
        onClick(numberOfPages);
        container.replaceWith(getPagination(numberOfPages, numberOfPages, onClick));
        window.scrollTo(0, 0);
    });

    container.appendChild(btnLast);

    return container;
}