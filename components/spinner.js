const spinner = (function () {
    const spinner = document.createElement("div");
    spinner.classList.add("spinner");
    document.querySelector(Settings.RESULT_CONTAINER_SELECTOR).append(spinner);

    const show = () => {
        spinner.style.display = "block";
    }

    const hide = () => {
        spinner.style.display = "none";
    }

    return { show, hide };
})();