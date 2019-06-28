let http = require('http')
let fs = require('fs')

http.createServer((req, res) => {
  let nodeTail = (readFile, writeFile) => {
    let rstream = fs.createReadStream(readFile)
    let wstream = fs.createWriteStream(writeFile)
    rstream.on('data', (read) => {
      read.toString().split('\n').reverse().forEach((str, ind) => {
        if (ind < 10) {
          wstream.write(str + '\n')
        }
      })
    })
  }
  nodeTail('./read.txt', './write.txt')
}).listen(3000)
