/* crack strapi
 strapi enterprise cracker script
*/

// node_modules\strapi\lib\utils\ee.js

const fs = require('fs');

const eePath = './node_modules/pdf-parse/index.js';

fs.readFile(eePath, 'utf-8', (err, _) => {
  if (err) throw err;
  console.log('Starting pdf-parse fix.');

  const newValue = `
const Pdf = require('./lib/pdf-parse.js');
module.exports = Pdf;
  `;
  fs.writeFile(eePath, newValue, 'utf-8', (err2, __) => {
    if (err2) throw err2;
    console.log('Done!');
  });
});
