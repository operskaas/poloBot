import jsSHA from 'jssha';
import unirest from 'unirest';

import createShaObj from './sha.js';

class ExConn {
  constructor() {}

  setKeySecret (file) {
    this.reader = new FileReader();
    return new Promise((resolve, reject) => {
      this.reader.onload = (e) => {
        const lines = e.target.result.split(/\r?\n/);
        this.key = lines[0];
        this.secret = lines[1];
        resolve(this.getChartData());
      }
      this.reader.readAsText(file);
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
