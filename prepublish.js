const glob = require('glob')
const fs = require('fs')
const es3ify = require('es3ify')

glob('./@(lib|dist)/**/*.js', (err, files) => {
  if (err) {
    throw err
  }

  files.forEach((file) => {
    fs.readFile(file, 'utf8', (err, data) => { // eslint-disable-line
      if (err) {
        throw err
      }

      fs.writeFile(file, es3ify.transform(data), err => { // eslint-disable-line
        if (err) {
          throw err
        }

        console.log('es3ified ' + file) // eslint-disable-line no-console
      })
    })
  })
})
