const fs = require('fs')
const express = require('express')
const cons = require('consolidate')
const mustache = require('mustache')

const app = express()

app.engine('html', cons.mustache)
app.set('view engine', 'html')

// Callback

function createhtml (dataPath, templatePath, outputPath, callback) {
  let template
  let json
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      return console.log('File .json not found')
    }
    json = JSON.parse(data)

    fs.readFile(templatePath, 'utf8', (err, data) => {
      if (err) {
        return console.log('File template not found')
      }
      template = data

      callback(json, template, outputPath)
    })
  })
}

function callback (data, temp, outputPath) {
  let result = mustache.render(temp, data)
  if (!result) {
    return console.log('File not rendering')
  }
  fs.writeFile(outputPath, result, (err) => {
    if (err) {
      return console.log(err)
    }
    console.log('The file was saved!')
  })
}
createhtml('data.json', 'views/template.html', 'build.html', callback)

// Promise

let jsonData = new Promise((resolve, reject) => {
  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
      reject('File .json not found')
    } else {
      resolve(JSON.parse(data))
    }
  })
})

let template = new Promise((resolve, reject) => {
  fs.readFile('views/template.html', 'utf8', (err, data) => {
    if (err) {
      reject('File template not found')
    } else {
      resolve(data)
    }
  })
})
Promise.all([jsonData, template])
  .then(([jsonData, template]) => {
    fs.writeFile('build.html', mustache.render(template, jsonData), (err) => {
      if (err) {
        return console.log(err)
      }
      console.log('The file was saved!')
    })
  })
  .catch(err => {
    console.log(err)
  })

// async/await

async function getJson () {
  return fs.readFileSync('data.json', 'utf8')
}

async function getTemp () {
  return fs.readFileSync('views/template.html', 'utf8')
}

async function main () {
  try {
    let temp = await getTemp()
    let json = await getJson()
    let result = mustache.render(temp, json)
    fs.writeFile('build.html', result, (err) => {
      if (err) {
        return console.log(err)
      }
      console.log('The file was saved!')
    })
  } catch (e) {
    console.log(`File ${e} not found`)
  }
}

app.get('/', (req, res) => {
  res.send('123')
})
main()

app.listen(3000)
