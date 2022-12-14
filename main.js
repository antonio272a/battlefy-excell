const XLSX = require("xlsx-js-style/dist/xlsx.bundle");
const createCsv = require("./createCsv");
const _ = require("lodash");
const Paladins = require("./paladins_api/getPlayerRankPaladins");
const Valorant = require("./valorant_api/valorant_api");


const selectedGame = 'valorant'

const RanksPaladins = require("./paladins_api/constants.js");
const RanksValorant = require("./valorant_api/constants.js");

const gameRanks = {
  'paladins': {
    ranks: RanksPaladins.ranks,
    ranksText: RanksPaladins.ranksText
  },
  'valorant': {
    ranks: RanksValorant.ranks,
    ranksText: RanksValorant.ranksText
  }
}

const { ranks, ranksText } = gameRanks[selectedGame];

const gameWrappers = {
  'paladins': Paladins,
  'valorant': Valorant
}

const csv = createCsv();

const MIN_RANK = ranksText["Iron 1"];
// const MIN_RANK = ranksText["Bronze_V"];
// const MAX_RANK = ranksText["Diamond_III"];
const MAX_RANK = ranksText["Platinum 2"];
const allRanksText = Object.keys(ranksText);
// console.log(allRanks);
const styles = {
  Inexistente: { fill: { fgColor: { rgb: "ffff66" } } }, // Amarelo
  "Perfil Privado": { fill: { fgColor: { rgb: "3366ff" } } }, // Azul 
  apto: { fill: { fgColor: { rgb: "00ff00" } } }, // Verde
  "n-apto": { fill: { fgColor: { rgb: "ff0000" } } }, // Vermelho
  [ranks[0]] : { fill: { fgColor: { rgb: "ff6600" } } } // Laranja
};

const trimSheet = (sheet) => {
  const keys = Object.keys(sheet);
  keys.forEach((key) => {
    sheet[key].v = sheet[key].v ? sheet[key].v.trim() : "";
  });
};

try {
  const workbook = XLSX.read(csv, { type: "string" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  trimSheet(sheet);
  const cellKeys = Object.keys(sheet).filter((c) => sheet[c].v);
  const firstLineRegex = /[\w]{1}1$/;
  const firstLineCells = cellKeys.filter((c) => firstLineRegex.test(c));
  const nameColumn = firstLineCells
    .find((c) => (sheet[c].v = "teamName"))
    .replace(/\d/, "");
  const teamPlayersColumns = firstLineCells
    .filter((c) => sheet[c].v.startsWith("player"))
    .map((c) => c.replace(/\d/, ""));
  const teamEndLine = cellKeys
    .find((c) => sheet[c].v.startsWith("End of Teams"))
    .replace(/\w/, "");
  const teamsLines = _.range(2, teamEndLine);
  const players = [];
  teamPlayersColumns.forEach((c) => {
    teamsLines.forEach((l) => {
      const player = sheet[`${c}${l}`] ? sheet[`${c}${l}`] : undefined;
      if (!player) return;
      players.push({ playerName: player.v, cell: player, position: `${c}${l}` });
    });
  });
  
  const getRanks = async () => {
    const wrapper = gameWrappers[selectedGame];
    const instance = await wrapper.createInstance();

    const withRanks = players.map(async (p) => ({
      ...p,
      rank: await wrapper.getPlayerRank(instance, p.playerName),
    }));
    const playersWithRank = await Promise.all(withRanks);
    const categorizedPlayers = playersWithRank.map((p) => {
      const hasRank = allRanksText.includes(p.rank);
      if(!hasRank || p.rank === ranks['0']) return {...p, status: p.rank, style: styles[p.rank]};
        const fits = ranksText[p.rank] >= MIN_RANK && ranksText[p.rank] <= MAX_RANK;

      const status = fits ? 'apto' : 'n-apto'
      return { ...p, status, style: styles[status] }
    })
    console.log(categorizedPlayers);

    categorizedPlayers.forEach((p) => {
      // console.log(p.position, p.playerName, p.status);
      sheet[p.position]['s'] = p.style;
    })
    
    
    XLSX.writeFile(workbook, "./result.xlsx");
  };

  // teamPlayersColumns.forEach((c) => {
  //   teamsLines.forEach((l) => {
  //     console.log(sheet[`${c}${l}`])
  //   });
  // });
  getRanks();
  // XLSX.writeFile(workbook, "./result.xlsx");

  // console.log(players);
  // const teste = sheet[`${teamPlayersColumns[2]}${teamsLines[5]}`]
  // console.log(`${teamPlayersColumns[2]}${teamsLines[5]}`);
  // console.log(teste);
  // teste.s = styles['Inexistente']
  // console.log(teste);
} catch (e) {
  console.log(e);
}
