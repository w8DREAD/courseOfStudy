let fs = require('fs')
let error
async function nodeTail (readFile, writeFile) {
  let rstream = fs.createReadStream(readFile)
  let wstream = fs.createWriteStream(writeFile)
  rstream.on('error', (err) => {
    return console.log(`File ${err.path} not found`)
  })
  wstream.on('error', (err) => {
    error = err
  })
  rstream.on('data', (read) => {
    if (!error) {
      console.log('Writing')
      return read.toString().split('\n').reverse().forEach((str, ind) => {
        if (ind < 10) {
          wstream.write(str + '\n')
        }
      })
    }
    console.log('file not found or cannot be created')
  })
  rstream.on('end', () => {
    console.log('Close file')
  })
  return rstream
}
nodeTail('./read.txt', './write.txt')
