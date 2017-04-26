import {readFile} from 'fs';
import jsSHA from 'jssha';
import unirest from 'unirest';

import createShaObj from './sha.js';

class ExConn {
  constructor() {
    this.setKeySecret_();
  }

  setKeySecret_ () {
    readFile('key.txt', 'utf8', (err, data) => {
      if (err) throw err;
      const lines = data.split(/\r?\n/);
      this.key = lines[0];
      this.secret = lines[1];
    });
  }

  serialize_ (obj) {
    const str = [];
    for(var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }

  getChartData() {
    return unirest.get(`https://poloniex.com/public?command=returnChartData&currencyPair=BTC_ETH&start=1439006400&end=9999999999&period=1800`);
  }

  getBalances() {
    const body = {
      command: 'returnBalances',
      nonce: new Date().getTime()
    };
    const shaObj = createShaObj(this.secret);
    shaObj.update(this.serialize_(body));
    const sn = shaObj.getHMAC("HEX");
    return unirest.post('https://poloniex.com/tradingApi')
        .headers({Key: this.key, Sign: sn})
        .send(body);
  }
}

export default ExConn;
