const fs = require('fs')
const express = require('express')
const cons = require('consolidate')
const mustache = require('mustache')

const app = express()

app.engine('html', cons.mustache)
app.set('view engine', 'html')

// Callback

// function callBack(err) {
//   if(err) {
//     return console.log(err)
//   }
// }
//
// function createhtml (dataPath, templatePath, outputPath, callBack) {
//   return fs.readFile(dataPath, 'utf8', (err, json) => {
//     if (err) {
//       return callBack(err)
//     }
//     return fs.readFile(templatePath, 'utf8', (err, temp) => {
//       if (err) {
//         return callBack(err)
//       }
//       let result = mustache.render(temp, json)
//       return fs.writeFile(outputPath, result, (err) => {
//         if (err) {
//           return callBack(err)
//         }
//         return console.log('file has been saved')
//       })
//     })
//
//   })
// }
// createhtml('data.json', 'views/template.html', 'build.html', callBack)
// Promise


function getPromis (path) {
  return new Promise( (resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}
getPromis('data.json')
    .then(json => {
      getPromis('views/template.html')
          .then(temp => {
            return new Promise((resolve, reject) => {
              fs.writeFile('build.html', mustache.render(temp, json), (err) => {
                if (err) {
                  reject(err)
                }
                resolve('The file was saved!')
              })
            })
                .then(message => {
                  return console.log(message)
                })
          })
    })
    .catch(err => {
      return console.log(err)
    })

// async/await

async function getData (path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

async function main () {
  try {
    let temp = await getData('data.json')
    let json = await getData('views/template.html')
    let result = mustache.render(temp, json)
    return fs.writeFile('build.html', result, (err) => {
      if (err) {
        return console.log(err)
      }
      return console.log('The file was saved!')
    })
  } catch (e) {
    return console.log(`File ${e} not found`)
  }
}

app.get('/', (req, res) => {
  res.send('123')
})
main()

app.listen(3000)
