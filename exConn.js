const fs = require('fs');
const jsSHA = require('jssha');
const unirest = require('unirest');

const {createShaObj} = require('./sha.js');

class ExConn {
  constructor() {
    fs.readFile('key.txt', 'utf8', (err, data) => {
      if (err) throw err;
      const lines = data.split(/\r?\n/);
      console.log(lines[0]);
      this.key = lines[0];
      this.secret = lines[1];
      console.log(lines[1]);
    });
  }

  serialize (obj) {
    const str = [];
    for(var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }

  getChartData() {
    unirest.get(`https://poloniex.com/public?command=returnChartData&currencyPair=BTC_XMR&start=1405699200&end=9999999999&period=14400`)
        .end(response => console.log(response.body));
  }

  getBalances() {
    const body = {
      command: 'returnBalances',
      nonce: new Date().getTime()
    };
    const shaObj = createShaObj(this.secret);
    shaObj.update(this.serialize(body));
    const sn = shaObj.getHMAC("HEX");
    unirest.post('https://poloniex.com/tradingApi')
        .headers({Key: this.key, Sign: sn})
        .send(body)
        .end(response => {
          console.log(response.body);
        });
  }
}

const charles = new ExConn();
charles.getChartData();
