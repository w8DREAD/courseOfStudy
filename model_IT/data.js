const _ = require('lodash')

function random (min = 0, max = 1) {
  return Math.round(Math.random() * (max - min) + min)
}

class Director {
  constructor (name, company) {
    this.name = name
    this.projectNotGiven = []
    this.hiring = []
    this.company = company
  }

  getProjects () {
    let i = 0
    let rand = random(0, 4)
    while (i < rand) {
      let project = Project.createProject(random()) // spec: [0 = 'web', 1 = 'mobile']
      this.projectNotGiven.push(project)
      i++
    }
  }

  giveProjects () {
    let projectsNotGiven = this.projectNotGiven.slice()
    projectsNotGiven.forEach((project, index) => {
      this.company.takeProject(project)
      this.projectNotGiven.splice(index, 1)
    })
    let projectsForTest = this.company.QA.storageProjects.concat(this.company.web.forTest.concat(this.company.mobile.forTest))
      this.company.QA.storageProjects = projectsForTest.slice()
      this.company.web.forTest = []
      this.company.mobile.forTest = []
  }

  hiringWorker () {
      let i = 0
      let needWeb = this.company.web.requireWorker()
      let needMobile = this.company.mobile.requireWorker()
      let needQA = this.company.QA.requireWorker()
    while (i < needWeb) {
        let worker = Worker.createWorker('web')
      this.company.web.workers.push(worker)
      this.hiring.push(worker)
       i++
   }
   i = 0
      while (i < needMobile) {
          let worker = Worker.createWorker('mobile')
          this.company.mobile.workers.push(worker)
          this.hiring.push(worker)
          i++
      }
      i = 0
      while (i < needQA) {
          let worker = Worker.createWorker('QA')
          this.company.QA.workers.push(worker)
          this.hiring.push(worker)
          i++
      }
  }
}

class Company {
  constructor(name = 'Corporation') {
    this.name = name
    this.web = Group.createGroup(Web)
    this.mobile = Group.createGroup(Mobile)
    this.QA = Group.createGroup(QA)
  }

  takeProject(project) {
      this[project.spec].storageProjects.push(project)
    }
}
class Group {
  constructor (name) {
    this.name = name
    this.workers = []
    this.firing = []
    this.storageProjects = []
  }

  requireWorker () {
      let projectsInWaiting = this.storageProjects.filter(project => project.status == 'in waiting' || project.status == 'for test')
      return projectsInWaiting.length - this.workers.length
  }

  startWork () {
      this.storageProjects.forEach( (project) => {
        if(this.workers.length && project.status == 'in waiting') {
          project.addWorker(this.workers[0])
          this.workers.splice(0, 1)
        }
      })
  }

  checkWork () {
    let storageProjects = this.storageProjects.slice()
    storageProjects.forEach( (project, index) => {
      if(project.daysInWork >= project.difficulty) {
        project.workers.forEach( (worker) => {
          worker.finishWork(project)
          this.workers.push(worker)
        })
        project.status = 'for test'
        project.workers = []
        project.daysInWork = 0
        this.forTest.push(project)
        this.storageProjects.splice(index, 1)
      }
    })
    this.storageProjects.forEach( (project) => {
      project.workDay()
    })
  }

  firingWorkers () {
    let notWorks = this.workers.filter((worker) => {
      return worker.withoutWorks >= 3
    })

    if (notWorks.length > 0) {
      notWorks.sort((a, b) => {
        if (a.completeProjects.length < b.completeProjects.length) {
          return -1
        }
        if (a.completeProjects.length > b.completeProjects.length) {
          return 1
        }
        return 0
      })

      this.firing.push(notWorks[0])
      remEl(notWorks[0].name, this.workers, 'name')
    }

    this.workers.forEach((worker) => {
      worker.withoutWorks += 1
    })
  }

  static createGroup (name) {
    return new name()
  }
}

class Web extends Group {
  constructor (name = 'web') {
    super(name)
    this.forTest = []
  }
}

class Mobile extends Group {
  constructor (name = 'mobile') {
    super(name)
    this.forTest = []
  }
  helpWithProject () {

    this.storageProjects.forEach( (project) => {
      if (this.workers.length) {
      if(project.workers.length < 3) {
        project.addWorker(this.workers[0])
        this.workers.splice(0, 1)
      }
      }
    })
  }
}

class QA extends Group {
  constructor (name = 'QA') {
    super(name)
  }
  startWork () {
    this.storageProjects.forEach( (project) => {
      if(this.workers.length && project.status == 'for test') {
        project.addWorker(this.workers[0], 'testing')
        this.workers.splice(0, 1)
      }
    })
  }
  checkWork () {
    this.storageProjects.forEach( (project) => {
      if(project.daysInWork >= project.difficulty) {
        project.workers.forEach( (worker) => {
          worker.finishWork(project)
          this.workers.push(worker)
        })
        project.status = 'complete'
        project.workers = []
        project.daysInWork = 0
      }
    })
    this.storageProjects.forEach( (project) => {
      project.workDay()
    })
  }
}
let workerId = 0
class Worker {

  constructor (skill) {
    this.name = 'Worker_' + workerId
    this.skill = skill
    this.completeProjects = []
    this.withoutWorks = 0
    workerId++
  }
  finishWork (project) {
    this.completeProjects.push(project.name)
    this.withoutWorks = 0
  }
  static createWorker (skill) {
    return new Worker(skill)
  }
}
let projectId = 0
class Project {

  constructor (spec) {
    this.name = 'Project N-' + projectId
    this.spec = ['web', 'mobile'][spec]
    this.difficulty = random(1, 3)
    this.workers = []
    this.daysInWork = 0
    this.status = 'in waiting'  // ['in waiting', 'in work', 'for test',  'testing', 'complete']
    projectId++
  }
  static createProject (spec) {
    return new Project(spec)
  }
  workDay () {
    if (this.status == 'testing') {
      this.daysInWork = this.difficulty
    }
    else if (this.workers.length) {
      this.daysInWork += this.workers.length
    }
  }
  addWorker (worker, status = 'in work') {
    this.workers.push(worker)
    this.status = status
  }
}

function remEl (elem, arr, key) {
  let i = 0

  while (i < arr.length) {
    if (arr[i][key] == elem) {
      arr.splice(i, 1)
      return arr
    }
    i++
  }
}

let evil = new Director('Evil', new Company('Corporation'))

function test (n) {
  let i = 0

  while (i < n) {
    evil.getProjects()
    evil.hiringWorker()
    evil.giveProjects()
      evil.hiringWorker()
      evil.company.web.startWork()
      evil.company.mobile.startWork()
      evil.company.QA.startWork()
      evil.company.mobile.helpWithProject()
      evil.company.web.checkWork()
      evil.company.mobile.checkWork()
      evil.company.QA.checkWork()
      evil.company.web.firingWorkers()
      evil.company.mobile.firingWorkers()
      evil.company.QA.firingWorkers()
    i++
  }
}

test(100)

console.log(evil.company.QA.storageProjects.filter((cur) => {
  return cur.status == 'complete'
}).length)

console.log(evil.hiring.length)
// console.log(evil.hiring)
//
// console.log(evil.hiring.filter(cur => cur.skill == 'mobile'))

console.log(evil.company.web.firing.length + evil.company.mobile.firing.length + evil.company.QA.firing.length)

// console.log(`Web firing --- ${JSON.stringify(evil.company.web.firing)}`)
// console.log(`Mobile firing --- ${JSON.stringify(evil.company.mobile.firing)}`)
// console.log(`QA firing --- ${JSON.stringify(evil.company.QA.firing)}`)
// console.log(`Web workers --- ${JSON.stringify(evil.company.web.workers)}`)
// console.log(`Mobile workers --- ${JSON.stringify(evil.company.mobile.workers)}`)
// console.log(`QA workers --- ${JSON.stringify(evil.company.QA.workers)}`)
// console.log(`Web workers --- ${JSON.stringify(evil.company.web.workers.length)}`)
// console.log(`Mobile workers --- ${JSON.stringify(evil.company.mobile.workers.length)}`)
// console.log(`QA workers --- ${JSON.stringify(evil.company.QA.workers.length)}`)