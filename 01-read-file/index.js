const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'text.txt');
const stream = fs.createReadStream(src);

let data = '';

stream.on('data', chunk => data += chunk);
stream.on('end', () => console.log(data));