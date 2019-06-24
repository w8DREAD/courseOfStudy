const fs = require('fs')
const express = require('express')
const cons = require('consolidate')
const Mustache = require('mustache')

const app = express()

app.engine('html', cons.mustache)
app.set('view engine', 'html')

let obj

  fs.readFile('data.json', 'utf8', function (err, data) {
    if (err) throw err // we'll not consider error handling for now
    obj = data
  })

app.get('/', function (req, res) {
  res.render('template', obj)
})

app.listen(3000)
