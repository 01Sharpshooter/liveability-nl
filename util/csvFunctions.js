const csvRowArrayToColumnIndexMap = (csvColumns, csvRowArray) => {
  const header = csvRowArray[0].split(',');
  const map = new Map();
  header[header.length - 1] = header[header.length - 1].trim();

  for (const value of Object.values(csvColumns)) {
    map.set(value, header.indexOf(value));
  }

  return map;
}

const csvToArrayOfRows = (csv) => {
  return csv.split('\n');
}

const fetchCSV = async (url) => {
  const csv = await $.get(url);

  const csvRows = csvToArrayOfRows(csv);
  const mapColumnIndex = csvRowArrayToColumnIndexMap(CSVColumns, csvRows);

  return { csvRows: csvRows, mapColumnIndex: mapColumnIndex };
}