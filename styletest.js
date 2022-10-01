const XLSX = require('xlsx')

const file = XLSX.readFile('./resulteditado.xlsx');

console.log(file.Sheets[file.SheetNames[0]]);