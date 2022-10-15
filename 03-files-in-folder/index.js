const fs = require('fs');
const path = require('path');

const { stdout } = process;

stdout.write('Hi! Get info about files in folder!\n');
let names = [];
const src = path.join(__dirname, 'secret-folder');
fs.readdir(src, {withFileTypes: true},   (err, files) => {
    if (err)
      console.log(err);
    else {
      files.forEach(file => {
        if (!file.isDirectory()) {
            fs.stat(path.join(src, file.name), (error, stats) => {
                if (error) {
                  console.log(error);
                }
               console.log(file.name, ' - ', path.extname(file.name), ' - ', stats.size)
               //console.log(stats)
            })
        }
      })
    }
});