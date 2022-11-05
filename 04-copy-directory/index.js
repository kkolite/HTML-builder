const fs = require('fs');
const path = require('path');

const srcCopy = path.join(__dirname, 'files-copy');
const srcOrigin = path.join(__dirname, 'files');
fs.mkdir(srcCopy, {recursive: true}, (err) => {
    if (err) {
        return console.error(err);
    }
});

fs.readdir(srcCopy, async (err, files) => {
  if (err)
    console.log(err);
  else {
    await files.forEach(file => {
      fs.unlink(path.join(srcCopy, file), (err) => {
          if (err) console.log(err);
        })
    })

    fs.readdir(srcOrigin, (err, files) => {
      if (err)
        console.log(err);
      else {
        files.forEach(file => {
          fs.copyFile(path.join(srcOrigin, file), path.join(srcCopy, file), (err) => {
              if (err) console.log(err);
              console.log(`${file} was copied`);
            })
        })
      }
  });
  }
});