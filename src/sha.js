import jsSHA from 'jssha';

const createShaObj = (secret) =>{
  const shaObj = new jsSHA("SHA-512", "TEXT");
  shaObj.setHMACKey(secret, 'TEXT');
  return shaObj;
}

export default createShaObj;
