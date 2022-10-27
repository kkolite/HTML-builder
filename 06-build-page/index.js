const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;

const src = path.join(__dirname, 'project-dist');
const srcIndex = path.join(__dirname, 'project-dist', 'index.html');
const srcStyle = path.join(__dirname, 'project-dist', 'style.css');
const srcOrigin = path.join(__dirname, 'styles');
const srcAssets = path.join(__dirname, 'assets');
const newAssets = path.join(__dirname, 'project-dist', 'assets');
 
async function makeCSS() {
    await fs.mkdir(src, {recursive: true}, (err) => {
        if (err) {
            return console.error(err);
        }
    });
    await fs.mkdir(newAssets, {recursive: true}, (err) => {
        if (err) {
            return console.error(err);
        }
    });

    await fs.writeFile(srcStyle,'', err => {if (err) throw err});

    const output = fs.createWriteStream(srcStyle);

    await fs.readdir(srcOrigin, {withFileTypes: true}, async (err, files) => {
        if (err)
        console.log(err);
        else {
        await files.forEach(file => {
            if (!file.isDirectory() && path.extname(file.name).match('css')) {
                let url = path.join(srcOrigin, file.name)
                fs.readFile(url, 'utf8', function(err, data){
                    output.write(data);
                })
            }
        })
        }
    });

    await makeAssets(srcAssets, newAssets);
}
makeCSS();

async function makeAssets(directorySrc, newSrc){
    await fs.readdir(directorySrc, {withFileTypes: true}, async (err, files) => {
        if (err)
          console.log(err);
        else {
          await files.forEach(async (el) => {
            if (el.isDirectory()) {
                const nextSrc = path.join(newSrc, el.name);
                const nextRead = path.join(directorySrc, el.name);
                await fs.mkdir(nextSrc, {recursive: true}, (err) => {
                    if (err) {
                        return console.error(err);
                    }
                });
                await makeAssets(nextRead, nextSrc)
            }
            else {
                await fs.copyFile(path.join(directorySrc, el.name), path.join(newSrc, el.name), (err) => {
                    if (err) return console.error(err)
                  })
            }
          })
        }
      });
      makeHTML();
  }

async function makeHTML() {
    const srcComponents = path.join(__dirname, 'components');
    const srcTemplate = path.join(__dirname, 'template.html')
    const readTemplate = fs.createReadStream(srcTemplate, 'utf-8');
    let data = '';
    let componentsName = [];

    readTemplate.on('data', chunk => data += chunk);
    await readTemplate.on('end', async () => {

        await fs.readdir(srcComponents, {withFileTypes: true}, async (err, files) => {
            if (err)
            console.log(err);
            else {
            await files.forEach(async (file) => {
                if (!file.isDirectory() && path.extname(file.name).match('html')) {
                    componentsName.push(file.name.toString())
                }
            })
            }

            await componentsName.forEach(async (el) => {
                const srcComponent = path.join(srcComponents, el);
                let temp = '';
                const readComponent = fs.createReadStream(srcComponent, 'utf-8');
                await readComponent.on('data', chunk => temp += chunk)
                await readComponent.on('end', async () => {
                    let fileName = el.split('.')[0];
                    data = data.replace(`{{${fileName}}}`, temp);
                    await fs.writeFile(srcIndex, data, err => {if (err) throw err});

                })
            
            });
            
    })});
}