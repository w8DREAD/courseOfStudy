const http = require('http')
const fs = require('fs')
const express = require('express')
const mustacheExpress = require('mustache-express')
const cons = require('consolidate')
const mustache = require('mustache')
const test = require

const app = express()
let name = { name: 'Alex' }
app.engine('html', cons.mustache)
app.set('view engine', 'html')

app.set('views', __dirname + '/views')
app.get('/', function (req, res) {
  res.render('template', name)
})


app.listen(3000)
