const fs = require('fs')
const express = require('express')
const cons = require('consolidate')
const mustache = require('mustache')

const app = express()

app.engine('html', cons.mustache)
app.set('view engine', 'html')

let qwe = JSON.parse(fs.readFileSync('data.json', 'utf8'))

// fs.writeFile('build.html', mustache.render(template, qwe), function (error) {
//   if (error) throw error // если возникла ошибка
//   console.log('Асинхронная запись файла завершена. Содержимое файла:')
//   let data = fs.readFileSync('build.html', 'utf8')
//   console.log(data) // выводим считанные данные
// })

app.get('/', function (req, res) {
  res.render('template', qwe)
})
// function createhtml (dataPath, templatePath, outputPath, callback) {
//   let qwe = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
// app.get('/', function (req, res) {
//     res.render('templatePath', qwe)
// })
//
// }

app.listen(3000)
