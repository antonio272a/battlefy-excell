const { convertCsvToXlsx } = require("@aternus/csv-to-xlsx");
const fs = require("fs");

const WITH_ID = false;

const file = fs.readFileSync("battlefy-player-info-export.csv");

const string = file.toString();

const array = string.split("\n"); //.filter((l) => !l.startsWith(','));

const headers = array[0].replace(/"/g, "").split(",");
const data = array.slice(1, array.length + 1);
const splitedData = data.map((l) => l.replace(/"/g, "").split(","));
const withTeamData = splitedData.filter((player) => player[0][0]);
const withoutTeamData = splitedData.filter((player) => !player[0][0]);

const handleTeams = () => {
  if(!withTeamData) return;
  const arrayOfJson = withTeamData.map((line) => {
    const json = {};
    line.forEach((info, i) => {
      json[headers[i]] = info;
    });
    return json;
  });

  const finalArray = [];

  const fieldsToRemove = ["inGameName", "userID"];
  const playersFields = ["inGameName", "userID"];

  arrayOfJson.forEach((player) => {
    const fields = Object.keys(player);
    fieldsToRemove.forEach((field) => {
      fields.splice(fields.indexOf(field), 1);
    });

    const defaultTeam = {
      players: [],
    };
    fields.forEach((field) => {
      defaultTeam[field] = player[field];
    });

    const alreadyExists = finalArray.find(
      (team) => team.teamID === player.teamID
    );
    if (!alreadyExists) finalArray.push(defaultTeam);

    const thisTeam = finalArray.find((team) => team.teamID === player.teamID);
    const teamIndex = finalArray.indexOf(thisTeam);
    const playerIndex = finalArray[teamIndex].players.length;
    const playerJson = {};
    playersFields.forEach((field) => {
      playerJson[field] = player[field];
    });

    finalArray[teamIndex].players[playerIndex] = playerJson;
  });


  const keys = Object.keys(finalArray[0]);
  keys.splice(keys.indexOf("players"), 1);

  const sortedByNumberOfPlayers = finalArray.sort(
    (a, b) => b.players.length - a.players.length
  );
  const maxNumberOfPlayers = sortedByNumberOfPlayers[0].players.length;
  const playersNumbers = Array.from(Array(maxNumberOfPlayers));

  const teamsCsv = finalArray
    .map((team) => {
      const csvWithoutPlayers = keys.reduce(
        (acc, act) => `${acc ? `${acc},` : ""}${team[act]}`,
        ""
      );
      const playersCsv = playersNumbers.reduce((acc, _act, i) => {
        if (!team.players[i]) return WITH_ID ? `${acc}, , ` : `${acc},`;
        const info = WITH_ID
          ? `${team.players[i].inGameName},${team.players[i].userID || " "}`
          : `${team.players[i].inGameName}`;
        return `${acc}${acc ? `,${info}` : info}`;
      }, "");
      return `${csvWithoutPlayers},${playersCsv}`;
    })
    .join("\n");

  playersNumbers.forEach((_, i) => {
    const info = WITH_ID
      ? `player${i + 1}, player${i + 1} ID`
      : `player${i + 1}`;
    keys.push(info);
  });
  const teamHeader = keys.join(",");
  const finalTeamCsv = `${teamHeader}\n${teamsCsv}`;
  return finalTeamCsv
};

const handleFreeAgents = () => {
  if(!withoutTeamData) return;
  const fieldsToRemove = ['teamName', 'teamID'];
  const freeAgentsHeader = JSON.parse(JSON.stringify(headers));
  fieldsToRemove.forEach((field) => {
    freeAgentsHeader.splice(freeAgentsHeader.indexOf(field), 1)
  });

  withoutTeamData.forEach((player) => {
    const headersDeepCopy = JSON.parse(JSON.stringify(headers));
    fieldsToRemove.forEach((field) => {
      const index = headersDeepCopy.indexOf(field)
      headersDeepCopy.splice(index, 1)
      player.splice(index, 1)
    })
  })

  const headersCsv = freeAgentsHeader.join(',');
  const playersCsv = withoutTeamData.map((p) => p.join(',')).join('\n')
  
  
  const finalFreeAgentCsv = `${headersCsv}\n${playersCsv}`;  
  
  return finalFreeAgentCsv
}

const createCsv = () => {
  const teamsCsv = handleTeams();
  const freeAgentsCsv = handleFreeAgents();
  const finalCsv = `${teamsCsv}\nEnd of Teams\n\nFree Agents\n${freeAgentsCsv}`
  return finalCsv
}

module.exports = createCsv

// const finalCsv = createCsv();





