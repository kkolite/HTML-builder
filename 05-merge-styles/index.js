const fs = require('fs');
const path = require('path');

const srcOrigin = path.join(__dirname, 'styles');
const src = path.join(__dirname, 'project-dist', 'bundle.css');

fs.writeFile(src,'', err => {if (err) throw err});
const output = fs.createWriteStream(src);

fs.readdir(srcOrigin, {withFileTypes: true},   (err, files) => {
    if (err)
      console.log(err);
    else {
      files.forEach(file => {
        if (!file.isDirectory() && path.extname(file.name).match('css')) {
            let url = path.join(srcOrigin, file.name)
            fs.readFile(url, 'utf8', function(err, data){
                output.write(data);
                //console.log(data);
            })
        }
      })
    }
});