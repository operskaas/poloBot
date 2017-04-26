const autobahn = require('autobahn');
const unirest = require('unirest');
const jsSHA = require('jssha');
const {createShaObj} = require('./sha.js');

const connection = new autobahn.Connection({
  url: "wss://api.poloniex.com",
  realm: "realm1"
});

// const symbols = new Set();

const serialize = function(obj) {
  const str = [];
  for(var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
};

connection.onopen = function (session) {
  // function marketEvent (args, kwargs) {
  //   console.log('MarketEvent args are: ' + args + ', kwargs are: ' + kwargs);
  // }

  // function logNewSymbols(symbol) {
  //   if (!symbols.has(symbol)) {
  //     if (symbol.includes('ETH')) {
  //       console.log('**************ETH SYMBOL ****************');
  //     }
  //     console.log('new symbol: ' + symbol);
  //   }
  //   symbols.add(symbol);
  // }

  function tickerEvent (args, kwargs) {
    const symbol = args[0];

    if (symbol === 'BTC_ETH') {
      const last = args[1];
      const baseVol = args[5];
      const quoteVol = args[6];
      console.log(`BaseVol: ${baseVol}, quoteVol: ${quoteVol}, at ${last}`);
    }
  }

  session.subscribe('ticker', tickerEvent);
  getBalances();
};

connection.onclose = function () {
  console.log('websocket connection closedddd');
};

connection.open();
