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
    json = JSON.parse(data)
    fs.readFile(templatePath, 'utf8', (err, data) => {
      template = data
      callback(json, template, outputPath)
    })
  })
}

function callback (data, temp, outputPath) {
  let result = mustache.render(temp, data)
  fs.writeFile(outputPath, result, (err) => {
    if (err) {
      return console.log(err)
    }
    console.log('The file was saved!')
  })
}
createhtml('data.json', 'views/template.html', 'build.html', callback)

app.listen(3000)
