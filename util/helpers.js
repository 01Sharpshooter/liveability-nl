const extractZipCode = (card) => {
    let zipCode = card.querySelector(Settings.ZIPCODE_SELECTOR).lastChild.nodeValue.trim().substring(0, 4);
    return validZipCode(zipCode) ? zipCode : 'N/A';
}


const clearHouseCards = () => {
    document.querySelectorAll(Settings.RESULT_SELECTOR).forEach(
        node => node.remove()
    );
}