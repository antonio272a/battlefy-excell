const md5 = require('md5');

// const puuid = 'kSo-LZd0ZiI0SaMVyXB5uYzoPFvvHffQqwHhmy0mOVgSDvI8MWmyjW0I-iqzf1Mes2_NqnV0G-jk-g'

// console.log(md5(puuid));

fetch('https://br.api.riotgames.com/val/content/v1/contents?api_key=RGAPI-efd7f76c-8919-4d4b-950a-800a2c6e6ebe')
.then((r) => r.json()).then((r) => {
  console.log(Object.keys(r), r.acts);
})