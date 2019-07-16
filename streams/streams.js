let fs = require('fs')
async function nodeTail (readFile, writeFile) {
  let rstream = fs.createReadStream(readFile)
  let wstream = fs.createWriteStream(writeFile)
  rstream.on('error', (err) => {
    return console.log(`File ${err.path} not found`)
  })
  wstream.on('error', (err) => {
    rstream.destroy()
    return console.log(`File ${err.path} not found`)
  })
  rstream.on('data', (read) => {
    console.log('Writing')
    return read.toString().split('\n').reverse().forEach((str, ind) => {
      if (ind < 10) {
        wstream.write(str + '\n')
      }
    })
  })
  return rstream.on('end', () => {
    return console.log('Close file')
  })
}
nodeTail('./read.txt', './write.txt')
