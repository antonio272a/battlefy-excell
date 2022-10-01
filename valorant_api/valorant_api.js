const fs = require('fs');

const BASE_URL = 'https://api.henrikdev.xyz/valorant/v2/mmr'

const getPlayerRankStats = async (playerName, tag, region) => {
  const url = `${BASE_URL}/${region}/${playerName}/${tag}`;
  // const url = `https://api.henrikdev.xyz/valorant/v2/mmr/na/susxnoo/1234`;
  const res = await fetch(url);
  const json = await res.json();
  return json
}

const getPlayerRank = async (playerName, tag, region = 'na') => {
  const res = await getPlayerRankStats(playerName, tag, region)
  const { status, data , errors } = res;
  if(status === 404) return "Inexistente";
  if(errors) return errors 

  console.log(data);
}

getPlayerRank('susxnoo', '1234')