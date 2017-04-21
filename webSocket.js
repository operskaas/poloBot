const autobahn = require('autobahn');
const unirest = require('unirest');
const jsSHA = require('jssha');
const {createShaObj} = require('./sha.js');

const connection = new autobahn.Connection({
  url: "wss://api.poloniex.com",
  realm: "realm1"
});

const symbols = new Set();

connection.onopen = function (session) {
  // function marketEvent (args, kwargs) {
  //   console.log('MarketEvent args are: ' + args + ', kwargs are: ' + kwargs);
  // }

  function logNewSymbols(symbol) {
    if (!symbols.has(symbol)) {
      if (symbol.includes('ETH')) {
        console.log('**************ETH SYMBOL ****************');
      }
      console.log('new symbol: ' + symbol);
    }
    symbols.add(symbol);
  }

  function buy() {
    unirest.post('https://poloniex.com/tradingApi')
        .headers({'Key': 'the key', 'Sign': 'the sign'})
        .send({
          "parameter": "nonce",
          "command": "buy",
          "currencyPair": "BTC_ETH",
          "rate": 3,
          "amount": .0000001,
        })
        .end(function(response) {
          console.log(response.body);
        });
  }
  function getBalances() {

    const body = JSON.stringify({
      "command": "returnBalances",
      "nonce": 4,
    });
    console.log(body);
    const shaObj = createShaObj();
    shaObj.update(body);
    const sn = shaObj.getHMAC("HEX");
    unirest.post('https://poloniex.com/tradingApi')
        .type('json')
        .headers({'Key': 'IHMONRUS-JR63BYK0-6582EE1V-OIBE3KBB', 'Sign': sn})
        .send(body)
        .end(function(response) {
          console.log(response);
        });
  }

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
