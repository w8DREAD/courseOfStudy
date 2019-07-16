const fs = require('fs')
const express = require('express')
const cons = require('consolidate')
const mustache = require('mustache')

const app = express()

app.engine('html', cons.mustache)
app.set('view engine', 'html')

// Callback

function createhtml (dataPath, templatePath, outputPath) {
  return fs.readFile(dataPath, 'utf8', (err, json) => {
    if (err) {
      return console.log(err.message)
    }
    return fs.readFile(templatePath, 'utf8', (err, temp) => {
      if (err) {
        return console.log(err.message)
      }
      let result = mustache.render(temp, json)
      return fs.writeFile(outputPath, result, (err) => {
        if (err) {
          return console.log(err.message)
        }
        return console.log('The file was saved!')
      })
    })
  })
}
createhtml('data.json', 'views/template.html', 'build.html')

// Promise

let jsonData = new Promise((resolve, reject) => {
  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
      reject(err)
    } else {
      resolve(JSON.parse(data))
    }
  })
})

let template = new Promise((resolve, reject) => {
  fs.readFile('views/template.html', 'utf8', (err, data) => {
    if (err) {
      reject(err)
    } else {
      resolve(data)
    }
  })
})
Promise.all([jsonData, template])
  .then(([jsonData, template]) => {
    return fs.writeFile('build.html', mustache.render(template, jsonData), (err) => {
      if (err) {
        return console.log(err)
      }
      return console.log('The file was saved!')
    })
  })
  .catch(err => {
    return console.log(err.message)
  })

// async/await

async function getJson () {
  return new Promise((resolve, reject) => {
    fs.readFile('data.json', 'utf8', (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

async function getTemp () {
  return new Promise((resolve, reject) => {
    fs.readFile('views/template.html', 'utf8', (err, data) => {
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
    let temp = await getTemp()
    let json = await getJson()
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
