const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'project-dist');
const srcIndex = path.join(__dirname, 'project-dist', 'index.html');
const srcStyle = path.join(__dirname, 'project-dist', 'style.css');
const srcOrigin = path.join(__dirname, 'styles');
const srcAssets = path.join(__dirname, 'assets');
const newAssets = path.join(__dirname, 'project-dist', 'assets');
//срабатывает со створого раза 
function makeCSS() {
    fs.mkdir(src, {recursive: true}, (err) => {
        if (err) {
            return console.error(err);
        }
    });
    fs.mkdir(srcAssets, {recursive: true}, (err) => {
        if (err) {
            return console.error(err);
        }
    });

    fs.writeFile(srcStyle,'', err => {if (err) throw err});

    const output = fs.createWriteStream(srcStyle);

    fs.readdir(srcOrigin, {withFileTypes: true}, (err, files) => {
        if (err)
        console.log(err);
        else {
        files.forEach(file => {
            if (!file.isDirectory() && path.extname(file.name).match('css')) {
                let url = path.join(srcOrigin, file.name)
                fs.readFile(url, 'utf8', function(err, data){
                    output.write(data);
                })
            }
        })
        }
    });
    
}
makeCSS();



/*fs.readdir(__dirname, {withFileTypes: true}, (err, directories) => {
    if (err)
      console.log(err);
    else {
      directories.forEach(el => {
        if (el.isDirectory() && el.name.match('assets')) {
            fs.copyFile(path.join(__dirname, el.name), path.join(src, el.name), (err) => {
                if (err) return console.error(err)
              })
        }
      })
    }
  });*/

function makeAssets(directorySrc, newSrc){
    fs.readdir(directorySrc, {withFileTypes: true}, (err, files) => {
        if (err)
          console.log(err);
        else {
          files.forEach(el => {
            if (el.isDirectory()) {
                const nextSrc = path.join(newSrc, el.name);
                const nextRead = path.join(directorySrc, el.name);
                fs.mkdir(nextSrc, {recursive: true}, (err) => {
                    if (err) {
                        return console.error(err);
                    }
                });
                makeAssets(nextRead, nextSrc)
            }
            else {
                fs.copyFile(path.join(directorySrc, el.name), path.join(newSrc, el.name), (err) => {
                    if (err) return console.error(err)
                  })
            }
          })
        }
      });
  }


makeAssets(srcAssets, newAssets)

function makeHTML() {
    const srcComponents = path.join(__dirname, 'components');
    const srcTemplate = path.join(__dirname, 'template.html')
    const readTemplate = fs.createReadStream(srcTemplate, 'utf-8');
    let data = '';
    let componentsName = [];

    readTemplate.on('data', chunk => data += chunk);
    readTemplate.on('end', () => {

        fs.readdir(srcComponents, {withFileTypes: true}, (err, files) => {
            if (err)
            console.log(err);
            else {
            files.forEach(file => {
                if (!file.isDirectory() && path.extname(file.name).match('html')) {
                    componentsName.push(file.name.toString())
                }
            })
            }

            componentsName.forEach(el => {
                const srcComponent = path.join(srcComponents, el);
                let temp = '';
                const readComponent = fs.createReadStream(srcComponent, 'utf-8');
                readComponent.on('data', chunk => temp += chunk)
                readComponent.on('end', () => {
                    let fileName = el.split('.')[0];
                    data = data.replace(`{{${fileName}}}`, temp);
                    fs.writeFile(srcIndex, data, err => {if (err) throw err});

                })
            
            });
            
    })});
}
makeHTML();
