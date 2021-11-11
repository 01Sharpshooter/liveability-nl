const dataHandler = (function dataHandler() {
    let csvDetailsProcessed;
    let csvScoresProcessed;

    /* Already requested once */
    const mapZipCodeDetailsArray = new Map();

    const csvRowArrayToColumnIndexMap = (csvColumns, csv) => {
        const header = csv.split('\n', 1)[0].split(',');
        const map = new Map();
        header[header.length - 1] = header[header.length - 1].trim();

        for (const value of Object.values(csvColumns)) {
            map.set(value, header.indexOf(value));
        }

        return map;
    }

    const csvToZipCodeRowMap = (csv) => {
        const map = new Map();
        const csvRows = csv.split('\n');

        for (const row of csvRows) {
            map.set(row.substring(0, 4), row);
        }

        return map;
    }

    const fetchCSV = async (csvName) => {
        const csv = await getResource(csvName);

        const csvZipCodeRowMap = csvToZipCodeRowMap(csv);
        const mapColumnIndex = csvRowArrayToColumnIndexMap(CSVColumns, csv);

        return { csvZipCodeRowMap, mapColumnIndex };
    }

    const prefetchData = async () => {
        if (!csvScoresProcessed) {
            csvScoresProcessed = await fetchCSV("PC4LBR.csv");
        }
        if (!csvDetailsProcessed) {
            csvDetailsProcessed = await fetchCSV("PC4DIMENSIE.csv");
        }
    }

    const fetchBasicScores = async (zipCode) => {
        if (!csvScoresProcessed) {
            csvScoresProcessed = await fetchCSV("PC4LBR.csv");
        }

        if (!isNaN(zipCode)) {
            const lineArray = csvScoresProcessed.csvZipCodeRowMap.get(zipCode)?.split(',');
            var liveabilityScore = lineArray[csvScoresProcessed.mapColumnIndex.get(CSVColumns.SCORE18)];
            var developmentScore = lineArray[csvScoresProcessed.mapColumnIndex.get(CSVColumns.DEVELOPMENT1418)];
        }

        return { liveabilityScore, developmentScore };
    }

    const fetchFieldOfZipCode = (zipCode, column) => {
        //assuming prefetch
        if (csvDetailsProcessed.csvZipCodeRowMap.has(zipCode)) {
            const columnIndex = csvDetailsProcessed.mapColumnIndex.get(column);

            if (!columnIndex) {
                return undefined;
            }

            if (mapZipCodeDetailsArray.has(zipCode)) {
                return mapZipCodeDetailsArray.get(zipCode)[columnIndex];
            } else {
                const lineArray = csvDetailsProcessed.csvZipCodeRowMap.get(zipCode)?.split(',');

                if (lineArray) {
                    mapZipCodeDetailsArray.set(zipCode, lineArray);
                    return lineArray[columnIndex];
                } else {
                    return undefined;
                }
            }
        }

        return undefined;
    }

    const fetchFieldScoreForZipCode = (zipCode, column) => {
        const fieldValue = fetchFieldOfZipCode(zipCode, column);
        //using the chart script now, but some reorganization might be nice if possible
        if (fieldValue) {
            return getChartInterval(fieldValue)[0];
        }
    }


    return { fetchBasicScores, fetchFieldOfZipCode, fetchFieldScoreForZipCode, prefetchData }
})();