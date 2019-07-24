const fs = require('fs')
const express = require('express')
const cons = require('consolidate')
const mustache = require('mustache')

const app = express()

app.engine('html', cons.mustache)
app.set('view engine', 'html')

// Callback

function callBack (err) {
  if (err) {
    return console.log(err)
  }
  return console.log('1 - The file was saved!')
}

function createhtml (dataPath, templatePath, outputPath, callBack) {
  return fs.readFile(dataPath, 'utf8', (err, json) => {
    if (err) {
      callBack(new Error('Файл не прочитан'))
    }
    return fs.readFile(templatePath, 'utf8', (err, temp) => {
      if (err) {
        callBack(new Error('Файл не прочитан'))
      }
      let result = mustache.render(temp, JSON.parse(json))
      return fs.writeFile(outputPath, result, (err) => {
        if (err) {
          return callBack(new Error('Файл не записан'))
        }
        callBack(err)
      })
    })
  })
}
createhtml('data.json', 'views/template.html', 'build.html', callBack)

// Promise

function getPromise (path) {
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
getPromise('data.json')
  .then(json => {
    getPromise('views/template.html')
      .then(temp => {
        return new Promise((resolve, reject) => {
          fs.writeFile('build.html', mustache.render(temp, JSON.parse(json)), (err) => {
            if (err) {
              reject(err)
            }
            resolve('2 - The file was saved!')
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
    let json = await getData('data.json')
    let temp = await getData('views/template.html')
    let result = mustache.render(temp, JSON.parse(json))
    let finished = await new Promise((resolve, reject) => {
      fs.writeFile('build.html', result, (err) => {
        if (err) {
          reject(err)
        }
        resolve('3 - The file was saved!')
      })
    })
    return console.log(finished)
  } catch (err) {
    console.log(err)
  }
}

app.get('/', (req, res) => {
  res.send('123')
})
main()

app.listen(3000)
