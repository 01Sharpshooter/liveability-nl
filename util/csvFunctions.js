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

  for (const row of Object.values(csvRows)) {
    map.set(row.substring(0, 4), row);
  }

  return map;
}

const fetchCSV = async (url) => {
  const csv = await $.get(url);

  const csvZipCodeRowMap = csvToZipCodeRowMap(csv);
  const mapColumnIndex = csvRowArrayToColumnIndexMap(CSVColumns, csv);

  return { csvZipCodeRowMap: csvZipCodeRowMap, mapColumnIndex: mapColumnIndex };
}