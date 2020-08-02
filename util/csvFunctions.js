const csvRowArrayToColumnIndexMap = (csvColumns, csvRowArray) => {
    const header = csvRowArray[0].split(',');
    const map = new Map();
    header[header.length - 1] = header[header.length - 1].trim();
  
    for (const [key, value] of Object.entries(csvColumns)) {
      map.set(value, header.indexOf(value));
    }
  
    return map;
  }
  
  const csvToArrayOfRows = (csv) => {
    return csv.split('\n');
  }