const fs = require('fs')
const express = require('express')
const cons = require('consolidate')
const mustache = require('mustache')

const app = express()

app.engine('html', cons.mustache)
app.set('view engine', 'html')

// Callback
// function createhtml (dataPath, templatePath, outputPath, callback) {
//   let template
//   let json
//   fs.readFile(dataPath, 'utf8', (err, data) => {
//     json = JSON.parse(data)
//     fs.readFile(templatePath, 'utf8', (err, data) => {
//       template = data
//       callback(json, template, outputPath)
//     })
//   })
// }
//
// function callback (data, temp, outputPath) {
//   let result = mustache.render(temp, data)
//   fs.writeFile(outputPath, result, (err) => {
//     if (err) {
//       return console.log(err)
//     }
//     console.log('The file was saved!')
//   })
// }
// createhtml('data.json', 'views/template.html', 'build.html', callback)

// Promise

// let json = new Promise((resolve, reject) => {
//   fs.readFile('data.json', 'utf8', (err, data) => {
//     if (data) {
//       resolve(JSON.parse(data))
//     } else {
//       reject('File not found')
//     }
//   })
// })
//
// let template = new Promise((resolve, reject) => {
//   fs.readFile('views/template.html', 'utf8', (err, data) => {
//     if (data) {
//       resolve(data)
//     } else {
//       reject('File not found')
//     }
//   })
// })
// Promise.all([json, template])
//   .then(value => { return mustache.render(value[1], value[0]) })
//   .then(result => {
//     fs.writeFile('build.html', result, (err) => {
//       if (err) {
//         return console.log(err)
//       }
//       console.log('The file was saved!')
//     })
//   }, reason => { console.log(reason) })

// async/await

async function json (data) {
  return JSON.parse(fs.readFileSync(data, 'utf8'))
}

async function temp (template) {
  return fs.readFileSync(template, 'utf8')
}

async function main () {
  let data = await json('data.json')
  let template = await temp('views/template.html')
  let result = await mustache.render(template, data)
  fs.writeFile('build.html', result, (err) => {
    if (err) {
      return console.log(err)
    }
    console.log('The file was saved!')
  })
}

app.get('/', (req, res) => {
  res.send('123')
})
main()
app.listen(3000)
