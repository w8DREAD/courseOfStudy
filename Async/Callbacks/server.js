const fs = require('fs')
const express = require('express')
const cons = require('consolidate')

const app = express()

app.engine('html', cons.mustache)
app.set('view engine', 'html')

let qwe = JSON.parse(fs.readFileSync('data.json', 'utf8'))

function createhtml (dataPath, templatePath, outputPath, callback) {
  let qwe = JSON.parse(fs.readFileSync('data.json', 'utf8'))

}

app.get('/', function (req, res) {
    res.render('template', qwe)
})

app.listen(3000)
