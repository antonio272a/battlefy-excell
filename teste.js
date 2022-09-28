const fs = require('fs');
const { convertCsvToXlsx } = require('@aternus/csv-to-xlsx');

const file = fs.readFileSync('battlefy-player-info-export.csv');

const string = file.toString();

const array = string.split('\n').filter((l) => !l.startsWith(','));

const headers = array[0].replace(/"/g, '').split(',');
const data = array.slice(1, array.length + 1);
const splitedData = data.map((l) => l.replace(/"/g, '').split(','));

const arrayOfJson = splitedData.map((line) => {
  const json = {}
  line.forEach((info, i) => {
    json[headers[i]] = info
  })
  return json
});
// console.log(arrayOfJson);

const finalArray = [];

const fieldsToRemove = ['inGameName', 'userID'];
const playersFields = ['inGameName', 'userID'];

arrayOfJson.forEach((player) => {
  const fields = Object.keys(player)
  fieldsToRemove.forEach((field) => {
    fields.splice(fields.indexOf(field), 1)
  });

  const defaultTeam = {
    players: []
  };
  fields.forEach((field) => {
    defaultTeam[field] = player[field]
  });

  const alreadyExists = finalArray.find((team) => team.teamID === player.teamID)
  if (!alreadyExists) finalArray.push(defaultTeam);

  const thisTeam = finalArray.find((team) => team.teamID === player.teamID);
  const teamIndex = finalArray.indexOf(thisTeam);
  const playerIndex = finalArray[teamIndex].players.length;
  const playerJson = {};
  playersFields.forEach((field) => {
    playerJson[field] = player[field];
  });

  finalArray[teamIndex].players[playerIndex] = playerJson;
})

// console.log(finalArray);

// fs.writeFileSync('result.json', JSON.stringify(finalArray))

const keys = Object.keys(finalArray[0]);
keys.splice(keys.indexOf('players'), 1);


const sortedByNumberOfPlayers = finalArray.sort((a, b) => b.players.length - a.players.length);
const maxNumberOfPlayers = sortedByNumberOfPlayers[0].players.length;
const playersNumbers = Array.from(Array(maxNumberOfPlayers));



const teamsCsv = finalArray.map((team) => {
  const csvWithoutPlayers = keys.reduce((acc, act) => (
    `${acc ? `${acc},` : ''}${team[act]}`
  ), '');
  const playersCsv = playersNumbers.reduce((acc, _act, i) => {
    if(!team.players[i]) return `${acc},`;
    return `${acc}${acc ? `,${team.players[i].inGameName}` : team.players[i].inGameName}`
  }, '');
  // console.log(csvWithoutPlayers);
  return `${csvWithoutPlayers},${playersCsv}`
}).join('\n')

playersNumbers.forEach((_, i) => {
  keys.push(`player${i + 1}`)
});
// console.log(keys);
const header = keys.join(',');
// console.log(teamsCsv);
const finalCsv = `${header}\n${teamsCsv}`;
// console.log(finalCsv);

// const test = ;
// test.forEach(() => console.log('3'))
// console.log(header);
fs.writeFileSync('result.csv', finalCsv);
try {
  fs.rmSync('./result.xlsx')
} catch (error) {
}

try{
  convertCsvToXlsx('./result.csv', './result.xlsx')
} catch(e) {
  console.log(e);
}

fs.rmSync('./result.csv')

