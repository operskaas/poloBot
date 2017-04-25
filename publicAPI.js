const unirest = require('unirest');

unirest.get('https://poloniex.com/public?command=returnTicker')
    .end(data => {
      console.log(data);
    });
