const http = require('http')
const director = require('./model_IT/data')

http.createServer(function (request, response) {
  response.end(`
    Release projects -- ${JSON.stringify(director.company.completeProjects.length)}
    
    Hiring -- ${JSON.stringify(director.hiring.length)}
    
    Firing -- ${JSON.stringify(director.firing.length)}
    
    FiringList -- ${JSON.stringify(director.firing)}
    

    
    Work.Web.list -- ${JSON.stringify(director.company.web.workers)}
    
    Work.Mobile.list -- ${JSON.stringify(director.company.mobile.workers)}
    
    Work.QA.list -- ${JSON.stringify(director.company.QA.workers)}
    
    Process.Web.list -- ${JSON.stringify(director.company.web.projectInProcess)}
    
    Process.Mobile.list -- ${JSON.stringify(director.company.mobile.projectInProcess)}
    
    Process.QA.list -- ${JSON.stringify(director.company.QA.projectInProcess)}
    
    Hiring.list -- ${JSON.stringify(director.hiring)}`)
}).listen(3000)
