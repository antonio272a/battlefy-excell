//  const request = require('fetch').fetchUrl;
 const moment = require('moment');
 const md5 = require('md5');
 const c = require('./constants');
 
 module.exports = class API {/*w   w   w.  d  e   m  o  2 s  .  c  o    m*/
 
   constructor(devId, authKey, format, lang) {
     (!devId) ? console.log('Error: No devId specified.') : this.devId = devId;
     (!authKey) ? console.log('Error: No authKey specified.') : this.authKey = authKey;
     (!format) ? this.format = 'Json' : (this.format = c[format]);
     (!lang) ? this.lang = '10' : (this.lang = c[lang]);
     this._session_id = null;
   }
 
   getFormat(send) {
     send(this.format);
   }
 
   getLanguage(send) {
     send(this.lang);
   }
 
   setLanguage(lang) {
     this.lang = c[lang];
   }
 
   setFormat(format) {
     this.format = c[format];
   }
 
   getPlayer(player) {
     const method = 'getplayer';
     const url = this.urlBuilder(method, player);
     return this.makeRequest(url)
   }
 
   getPlayerStatus(player) {
     const method = 'getplayerstatus';
     const url = this.urlBuilder(method, player);
     return this.makeRequest(url)
   }
 
   getMatchHistory(player) {
     const method = 'getmatchhistory';
     const url = this.urlBuilder(method, player);
     return this.makeRequest(url)
   }
 
   getMatchDetails(match_id) {
     const method = 'getmatchdetails';
     const url = this.urlBuilder(method, null, null, match_id);
     return this.makeRequest(url)
   }
 
   getChampions() {
     const method = 'getchampions';
     const url = this.urlBuilder(method, null, this.lang);
     return this.makeRequest(url)
   }
 
   getChampionRanks(player) {
     const method = 'getchampionranks';
     const url = this.urlBuilder(method, player);
     return this.makeRequest(url)
   }
 
   getChampionSkins(champ_id) {
     const method = 'getchampionskins';
     const url = this.urlBuilder(method, null, this.lang, null, champ_id);
     return this.makeRequest(url)
   }
 
   //Currently returns an empty object. Don't know why.
   getChampionRecommendedItems(champ_id) {
     const method = 'getchampionrecommendeditems';
     const url = this.urlBuilder(method, null, this.lang, null, champ_id);
     request(url, function(err, res, body) {
       if(!err) {
         const bodyParsed = JSON.parse(body);
         send(err, bodyParsed);
       }
     });
   }
 
   getDemoDetails(match_id) {
     const method = 'getdemodetails';
     const url = this.urlBuilder(method, null, null, match_id);
     return this.makeRequest(url)
   }
 
   getQueueStats(player, queue, match_id) {
     const method = 'getqueuestats';
     const url = this.urlBuilder(method, player, null, null, null, queue);
     return this.makeRequest(url)
   }
 
   getItems() {
     const method = 'getitems';
     const url = this.urlBuilder(method, null, this.lang);
     return this.makeRequest(url)
   }
 
   getDataUsed() {
     const method = 'getdataused';
     const url = this.urlBuilder(method);
     return this.makeRequest(url)
   }
 
   getPlayerLoadouts(player) {
     const method = 'getplayerloadouts';
     const url = this.urlBuilder(method, player);
     return this.makeRequest(url)
   }
 
   getLeagueLeaderboard(queue, tier, season) {
     const method = 'getleagueleaderboard';
     const url = this.urlBuilder(method, null, null,
                               null, null, queue, tier, season);
     return this.makeRequest(url)
   }
 
   async connect() {
     const url = c.PC + '/' + 'createsession' + this.format + '/' +
               this.devId + '/' + this.getSignature('createsession')
               + '/' + this.timeStamp();
    const { error, data } = await this.makeRequest(url);
    if(error) return error;
    this._session_id = data.session_id
   }
 
   async makeRequest(url) {
    try {
      const res = await fetch(url);
      const json = await res.json()
      return { data: json };
    } catch (error) {
      return {error: 'Paladins API is down'} 
    }
   }
 
   urlBuilder(method, player, lang, match_id, champ_id, queue, tier, season) {
     let baseURL = c.PC + '/' + method + this.format + '/' + this.devId + '/' +
                   this.getSignature(method) + '/' + this._session_id + '/' + this.timeStamp();
 
     (player) ? baseURL += ('/' + player) : null;
     (champ_id) ? baseURL += ('/' + champ_id) : null;
     (lang) ? baseURL += ('/' + lang) : null;
     (match_id) ? baseURL += ('/' + match_id) : null;
     (queue) ? baseURL += ('/' + queue) : null;
     (tier) ? baseURL += ('/' + tier) : null;
     (season) ? baseURL += ('/' + season) : null;
     return baseURL;
   }
 
   timeStamp() {
     return moment().utc().format('YYYYMMDDHHmmss');
   }
 
   getSignature(method) {
     return md5(this.devId + method + this.authKey + this.timeStamp());
   }
 
 };