const jsSHA = require('jssha');

function createShaObj(secret) {
  const shaObj = new jsSHA("SHA-512", "TEXT");
  shaObj.setHMACKey(secret, 'TEXT');
  return shaObj;
}

module.exports = {createShaObj};
