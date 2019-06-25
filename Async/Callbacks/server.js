const fs = require('fs')
const express = require('express')
const cons = require('consolidate')
const mustache = require('mustache')

const app = express()

app.engine('html', cons.mustache)
app.set('view engine', 'html')

let template
let json

function createhtml (dataPath, templatePath, outputPath, callback) {

  fs.readFile(dataPath, 'utf8', (err, data) => {
    json =  JSON.parse(data)
  })
  fs.readFile(templatePath, 'utf8', (err, data) => {
    template = data
  })
  callback(json, template, outputPath)
  //
  // let result = mustache.render(template, obj)
  //
  // fs.writeFile(outputPath, result, (err) => {
  //   if (err) {
  //     return console.log(err)
  //   }
  //   console.log('The file was saved!')
  // })
}
// let obj
// let template
// fs.readFile('views/template.html', 'utf8', (err, data) => {
//   template = data
// })
// fs.readFile('data.json', 'utf8', (err, data) => {
//   obj = data
// })
//
// let result = mustache.render(template, obj)
//

function callback (data, temp, outputPath) {
  console.log(data)
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
