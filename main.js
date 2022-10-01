const XLSX = require("xlsx-js-style/dist/xlsx.bundle");
const createCsv = require('./createCsv');
const _ = require('lodash');
const csv = createCsv();

const trimSheet = (sheet) => {
  const keys = Object.keys(sheet)
  keys.forEach((key) => {    
    sheet[key].v = sheet[key].v ? sheet[key].v.trim() : ''
  });
}

try {
  const workbook = XLSX.read(csv, {type: 'string'});
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  trimSheet(sheet);
  const cellKeys = Object.keys(sheet).filter((c) => sheet[c].v);
  const firstLineRegex = /[\w]{1}1$/;
  const firstLineCells = cellKeys.filter((c) => firstLineRegex.test(c))
  const nameColumn = firstLineCells.find((c) => sheet[c].v = 'teamName').replace(/\d/, '');
  const teamPlayersColumns = firstLineCells.filter((c) => sheet[c].v.startsWith('player')).map((c) => c.replace(/\d/, ''));
  const teamEndLine = cellKeys.find((c) => sheet[c].v.startsWith('End of Teams')).replace(/\w/, '');
  const teamsLines = _.range(2, teamEndLine);
  const array = [];
  teamPlayersColumns.forEach((c) => {
    teamsLines.forEach((l) => {
      const player = sheet[`${c}${l}`] ? sheet[`${c}${l}`] : undefined;
      array.push(player)
    })
  })
  const teste = sheet[`${teamPlayersColumns[2]}${teamsLines[5]}`]
  // teste.s = { font: { bold: true, color: { rgb: "FF0000" } } }
  console.log(teste.v);
  // XLSX.writeFile(workbook, './result.xlsx')
} catch (e) {
  console.log(e);
}