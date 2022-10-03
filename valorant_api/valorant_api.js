const fs = require('fs');
const { ranks } = require('./constants');

const BASE_URL = 'https://api.henrikdev.xyz/valorant/v2/mmr'

const getPlayerRankStats = async (playerName, tag, region) => {
  const url = `${BASE_URL}/${region}/${playerName}/${tag}`;
  // const url = `https://api.henrikdev.xyz/valorant/v2/mmr/na/susxnoo/1234`;
  const res = await fetch(url);
  const json = await res.json();
  return json
}

const getPlayerRank = async (_, nickname, region = 'na') => {
  const [playerName, tag] = nickname.split('#')
  const res = await getPlayerRankStats(playerName, tag, region)
  const { status, data , errors } = res;
  if (errors) console.log(errors);
  if(status === 404) return "Inexistente";
  if(errors) return "Inexistente" 

  return data.current_data.currenttierpatched;
}

// const nick = 'Who is zero #br1';
// const nick = 'niiyuji #BR1';
// const nick = 'COROLHO#6873';
// const nick = 'vtW#BR1';
// const nick = 'Yarchuw #6858';
const nick = 'ruh#doze'
module.exports = {
  createInstance: () => null,
  getPlayerRank
}
