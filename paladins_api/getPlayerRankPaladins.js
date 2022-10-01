// const paladins = require('paladins-api');
const Paladins = require('./paladins_api');
const _ = require('lodash');
const { ranks } = require('./constants');

const getPlayerRank = async (nick) => {
  const HIREZ_AUTH_KEY = "310114B6E36447369BBD3F35034995AC";
  const HIREZ_DEV_ID = "3656";
  const pal = new Paladins(HIREZ_DEV_ID, HIREZ_AUTH_KEY);
  const error = await pal.connect();
  if(error) return console.log(error);
  

  // const res = await pal.getItems();
  const { data } = await pal.getPlayer(nick);
  const player = data[0];
  if(!player) return "Inexistente";
  if(player.ret_msg) return "Perfil Privado";
  const keys = Object.keys(player)
  const highestTier = _.max(keys.filter((k) => /^tier/i.test(k)).map((k) => player[k]));
  return ranks[highestTier];
};

module.exports = getPlayerRank;
