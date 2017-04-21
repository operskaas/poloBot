var autobahn = require('autobahn');
var wsuri = "wss://api.poloniex.com";
var connection = new autobahn.Connection({
  url: wsuri,
  realm: "realm1"
});

var symbols = new Set();

connection.onopen = function (session) {
  // function marketEvent (args, kwargs) {
  //   console.log('MarketEvent args are: ' + args + ', kwargs are: ' + kwargs);
  // }
  function tickerEvent (args, kwargs) {
    const symbol = args[0];
    if (!symbols.has(symbol)) {
      if (symbol.includes('ETH')) {
        console.log('**************ETH SYMBOL ****************');
      }
      console.log('new symbol: ' + symbol);
    }
    symbols.add(args[0]);
    // console.log('TickerEvent args are: ' + args[0] + ', kwargs are: ' + kwargs);
  }

  // session.subscribe('BTC_XMR', marketEvent);
  session.subscribe('ticker', tickerEvent);
};

connection.onclose = function () {
  console.log('websocket connection closedddd');
};

connection.open();
