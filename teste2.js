const { convertCsvToXlsx } = require('@aternus/csv-to-xlsx');
const fs = require('fs')
try {
  fs.rmSync('./result2.xlsx')
} catch (error) {
}
try{
  convertCsvToXlsx('./battlefy-player-info-export.csv', './result2.xlsx')
} catch(e) {
  console.log(e);
}
