const http = require('http')
const director = require('./model_IT/data')

http.createServer(function (request, response) {
  response.end(`
    Release projects -- ${JSON.stringify(director.company.completeProjects.length)}
    
    Hiring -- ${JSON.stringify(director.hiring.length)}
    
    Firing -- ${JSON.stringify(director.firing.length)}
    
    FiringList -- ${JSON.stringify(director.firing)}
      
    Hiring.list -- ${JSON.stringify(director.hiring)}`)
}).listen(3000)
