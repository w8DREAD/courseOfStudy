// for generation
let id = 0
let num = 0

class Director {
  constructor (name, company) {
    this.name = name
    this.storageWaiting = {
      web: [],
      mobile: [],
      QA: []
    }
    this.hiring = []
    this.firing = []
    this.company = company
  }

  clearProject () {
    for (let group of Object.keys(this.company)) {
      if (this.storageWaiting.hasOwnProperty(group)) {
        let arrProcess = this.company[group].projectInProcess.slice()

        arrProcess.forEach((curProj) => {
          if (curProj.daysInWork >= curProj.difficulty) {
            let workers = curProj.workers.slice()

            workers.forEach((curWorker) => {
              curWorker.completeProjects.push(curProj.name)
              curWorker.withoutWorks = 0
              this.company[group].workers.push(curWorker)
            })

            curProj.workers = []

            if (group != 'QA') {
              this.storageWaiting.QA.push(curProj)
              curProj.daysInWork = 0
            } else {
              this.company.completeProjects.push(curProj)
            }
            remEl(curProj.name, this.company[group].projectInProcess, 'name')
          }
        })
      }
    }
  }

  checkProject () {
    for (let group of Object.keys(this.company)) {
      if (this.storageWaiting.hasOwnProperty(group)) {
        this.company[group].projectInProcess.forEach((curProj) => {
          if (group == 'QA') {
            curProj.daysInWork = curProj.difficulty
          } else if (group == 'mobile') {
            curProj.daysInWork += curProj.workers.length
          } else {
            curProj.daysInWork += 1
          }
        })
      }
    }
  }

  hiringWorker () {
    for (let group of Object.keys(this.company)) {
      if (this.storageWaiting.hasOwnProperty(group)) {
        if (this.storageWaiting[group].length > 0) {
          while (this.storageWaiting[group].length > this.company[group].workers.length) {
            let worker = new Worker(id, group)
            this.company[group].workers.push(worker)
            this.hiring.push(worker)
          }
        }
      }
    }
  }

  firingWorker () {
    for (let group of Object.keys(this.company)) {
      if (this.storageWaiting.hasOwnProperty(group)) {
        let notWorks = []
        let arrWorks = this.company[group].workers.slice()

        arrWorks.forEach((curWorker) => {
          if (curWorker.withoutWorks >= 3) {
            notWorks.push(curWorker)
          }
        })

        if (notWorks.length > 0) {
          notWorks.sort((a, b) => {
            if (a.completeProjects.length > b.completeProjects.length) {
              return -1
            }
            if (a.completeProjects.length < b.completeProjects.length) {
              return 1
            }
            return 0
          })

          this.firing.push(notWorks[0])
          remEl(notWorks[0].name, this.company[group].workers, 'name')
        }

        this.company[group].workers.forEach((curWorker) => {
          curWorker.withoutWorks += 1
        })
      }
    }
  }

  getProject () {
    let i = 0
    let inDay = {
      web: [],
      mobile: []
    }

    while (i < random(0, 4)) {
      let project = new Project()

      if (project.type == 'web') {
        inDay.web.unshift(project)
      } else {
        inDay.mobile.unshift(project)
      }
      i++
    }
    if (inDay.web[0] != undefined) {
      this.storageWaiting.web.unshift(inDay.web[0])
    }
    if (inDay.mobile[0] != undefined) {
      this.storageWaiting.mobile.unshift(inDay.mobile[0])
    }
  }

  giveProject () {
    for (let group of Object.keys(this.company)) {
      if (this.storageWaiting.hasOwnProperty(group)) {
        if (this.storageWaiting[group].length > 0) {
          let arr = this.storageWaiting[group].slice()

          arr.forEach((curProj) => {
            if (this.company[group].workers.length > this.company[group].storageProject.length) {
              this.company[group].storageProject.push(curProj)
              remEl(curProj.name, this.storageWaiting[group], 'name')
            }
          })
        }
      }
    }
  }
}

class Company {
  constructor (name, groups) {
    this.name = name
    this.completeProjects = []

    let group = 1

    while (group < arguments.length) {
      this[arguments[group]] = new Groups(arguments[group])
      group++
    }
  }

  startedWork () {
    for (let group of Object.keys(this)) {
      if (group != 'name' && group != 'completeProjects') {
        let arrProject = this[group].storageProject.slice()
        let arrWorkers

        arrProject.forEach((curProj) => {
          arrWorkers = this[group].workers.slice()

          if (arrWorkers.length > 0) {
            curProj.workers.push(arrWorkers[0])
            this[group].projectInProcess.push(curProj)
            remEl(curProj.name, this[group].storageProject, 'name')
            remEl(arrWorkers[0].name, this[group].workers, 'name')
          }
        })
        if (group.name == 'mobile') {
          if (this[group].workers.length > 0 && this[group].storageProject.length == 0) {
            let arrProcess = this[group].projectInProcess

            arrProcess.forEach((curProj) => {
              if (this[group].workers.length > 0) {
                let workers = this[group].workers.slice()

                workers.forEach((curWorker) => {
                  if (curProj.workers.length < 3) {
                    curProj.workers.push(curWorker)
                    remEl(curWorker.name, this[group].workers, 'name')
                  }
                })
              }

              remEl(curProj.name, this[group].projectInProcess, 'name')
              this[group].projectInProcess.push(curProj)
            })
          }
        }
      }
    }
  }
}
class Project {
  constructor () {
    this.name = 'Project N-' + num
    this.type = ['web', 'mobile'][random()]
    this.difficulty = random(1, 3)
    this.workers = []
    this.daysInWork = 0
    num++
  }
}
class Groups {
  constructor (name) {
    this.name = name
    this.workers = []
    this.projectInProcess = []
    this.storageProject = []
  }
}

class Worker {
  constructor (name, skill) {
    this.name = 'Worker_' + name
    this.skill = skill
    this.completeProjects = []
    this.withoutWorks = 0
    id++
  }
}

function random (min = 0, max = 1) {
  return Math.round(Math.random() * (max - min) + min)
}

let qwe

qwe = new Company("Evil's Corporation", 'web', 'mobile', 'QA')

let evil = new Director('Evil', qwe)

function test (n) {
  let i = 0

  while (i < n) {
    evil.getProject()
    evil.giveProject()
    evil.hiringWorker()
    evil.company.startedWork()
    evil.clearProject()
    evil.checkProject()
    evil.firingWorker()
    i++
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

test(50)

module.exports = evil
