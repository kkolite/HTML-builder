const { stdout, stdin } = process;
const fs = require('fs');
const path = require('path');
const src = path.join(__dirname, 'text.txt')

fs.writeFile(src,'', err => {if (err) throw err});
const output = fs.createWriteStream(src);

stdout.write('I\'m waiting for your text\n');
stdin.on('data', data => {
    const text = data.toString();
    if (data.toString().match('exit')) {process.exit()}
    output.write(data)
});
process.on('exit', () => stdout.write('Good luck!'));
process.on('SIGINT', () => process.exit())