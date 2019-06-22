let project_id = 0
let worker_id = 0

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
      let project = new Project(random())
      this.projectNotGiven.push(project)
      i++
    }
  }

  giveProjects () {
    for (let groupName of Object.keys(this.company.groups)) {
      if (this.company.groups[groupName] instanceof Group) {
        if (this.projectNotGiven) {
          let arr = this.projectNotGiven.slice()

          arr.forEach((curProj) => {
            let projectsGroup = this.company.groups.storageProject.filter((curProject) => {
              return (curProject.spec == this.company.groups[groupName].specialization)
            }).length

            if (this.company.groups[groupName].workers.length > projectsGroup) {
              this.company.groups.storageProject.push(curProj)
              curProj.status = 'in waiting'
              remEl(curProj.name, this.projectNotGiven, 'name')
            }
          })
        }
      }
    }
  }

  hiringWorker () {
    for (let groupName of Object.keys(this.company.groups)) {
      if (this.company.groups[groupName] instanceof Group) {
        if (this.projectNotGiven.length) {
          let projectsGroup = this.projectNotGiven.filter((curProject) => {
            return (curProject.spec == this.company.groups[groupName].specialization)
          }).length
          while (this.company.groups[groupName].workers.length < projectsGroup) {
            let worker = dataFactory('worker', worker_id, this.company.groups[groupName].specialization)
            this.company.groups[groupName].workers.push(worker)
            this.hiring.push(worker)
          }
        }
        let projectsGroup = this.company.groups.storageProject.filter((cur) => {
          return cur.status == 'for test'
        }).length
        while (this.company.groups[groupName].specialization == 'QA' && this.company.groups[groupName].workers < projectsGroup) {
          let worker = dataFactory('worker', worker_id, this.company.groups[groupName].specialization)
          this.company.groups[groupName].workers.push(worker)
          this.hiring.push(worker)
        }
      }
    }
  }
}

function random (min = 0, max = 1) {
  return Math.round(Math.random() * (max - min) + min)
};

class Company {
  constructor (name = 'Corporation', [groups, spec]) {
    let group = 1

    this.name = name
    this.groups = {
      storageProject: [],
      startWorking () {
        for (let groupName of Object.keys(this)) {
          if (this[groupName] instanceof Group) {
            this.storageProject.forEach((curProj) => {
              if (this[groupName].workers.length) {
                let arrWorkers = this[groupName].workers.slice()
                if (arrWorkers[0].skill == curProj.spec && curProj.status == 'in waiting') {
                  curProj.addWorker(arrWorkers[0])
                  remEl(arrWorkers[0].name, this[groupName].workers, 'name')
                }
              }
            })

            if (this[groupName]._method == 'teamDevelopers') {
              let projectsGroup = this.storageProject.filter((curProj) => {
                return this[groupName].specialization == curProj.spec
              }).length

              if (this[groupName].workers.length && projectsGroup == 0) {
                this.storageProject.forEach((curProj) => {
                  if (curProj.status == 'in work' && curProj.spec == this[groupName].specialization) {
                    if (this[groupName].workers.length) {
                      let workers = this[groupName].workers.slice()

                      workers.forEach((curWorker) => {
                        if (curProj.workers.length < 3) {
                          curProj.addWorker(curWorker)
                          remEl(curWorker.name, this[groupName].workers, 'name')
                        }
                      })
                    }
                  }
                })
              }
            }
            if (this[groupName]._method == 'test') {
                this.storageProject.forEach((curProj) => {
                  if (curProj.status == 'for test') {
                    if (this[groupName].workers.length) {
                        curProj.addWorker(this[groupName].workers[0], 'testing')
                        remEl(this[groupName].workers[0].name, this[groupName].workers, 'name')
                        curProj.daysInWork = 0
                    }
                  }
                })
              }
            }
          }
      },
      checkWork () {
        for (let groupName of Object.keys(this)) {
          if (this[groupName] instanceof Group) {
            this.storageProject.forEach((curProj) => {
              if (curProj.daysInWork >= curProj.difficulty) {
                curProj.workers.forEach((curWorker) => {
                  curWorker.finishWork(curProj)
                  this[groupName].workers.push(curWorker)
                })
                if (curProj.status == 'in work') {
                  curProj.status = 'for test'
                  curProj.workers = []
                } else if (curProj.status == 'testing'){
                  curProj.status = 'complete'
                  curProj.workers = []
                }
                curProj.daysInWork = 0
              }
              curProj.workDay()
            })
            this[groupName].firingWorkers()
          }
        }
      }
    }
    while (group < arguments.length) {
      this.groups[arguments[group][1]] = dataFactory('group', arguments[group][0], arguments[group][1])
      group++
    }
  }
}

class Group {
  constructor (name = '', specialization = '', method) {
    this._method = method // teamDevelopers, singleDeveloper, test
    this.name = name
    this.specialization = specialization
    this.workers = []
    this.firing = []
  }

  firingWorkers () {
    let notWorks = this.workers.filter( (curWorker) => {
      return curWorker.withoutWorks >= 3
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
      remEl(notWorks[0].name, this.workers, 'name')
    }

    this.workers.forEach((curWorker) => {
      curWorker.withoutWorks += 1
    })
  }
}

class Web extends Group {
  constructor (name = 'web') {
    super(name, 'web', 'singleDeveloper')
  }
}

class Mobile extends Group {
  constructor (name = 'mobile') {
    super(name, 'mobile', 'teamDevelopers')
  }
}

class QA extends Group {
  constructor (name = 'QA') {
    super(name, 'QA', 'test')
  }
}

class Worker {
  constructor (name, skill) {
    this.name = 'Worker_' + name
    this.skill = skill
    this.completeProjects = []
    this.withoutWorks = 0
    worker_id++
  }
  finishWork (project) {
    this.completeProjects.push(project.name)
    this.withoutWorks = 0
  }
}

class Project {
  constructor (spec) {
    this.name = 'Project N-' + project_id
    this.spec = ['web', 'mobile'][spec]
    this.difficulty = random(1, 3)
    this.workers = []
    this.daysInWork = 0
    this.status = ''
    project_id++
  }
  workDay () {
    if (this.workers.length && this.status == 'testing') {
      this.daysInWork = this.difficulty
    }
    if (this.workers.length > 1) {
      this.daysInWork += this.workers.length
    }
    if (this.workers.length == 1 && this.status == 'in work') {
      this.daysInWork += 1
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

function dataFactory (who, name, param) {
  if (who == 'project') {
    return new Project()
  }
  if (who == 'group') {
    if (name == 'web') {
      return new Web(param)
    }
    if (name == 'mobile') {
      return new Mobile(param)
    }
    if (name == 'test') {
      return new QA(param)
    }
  }
  if (who == 'worker') {
    return new Worker(name, param)
  }
}
let evil = new Director('Evil', new Company('Corporation', ['web', 'web-dev'], ['mobile', 'mobile-dev'], ['test', 'QA']))

function test (n) {
  let i = 0

  while (i < n) {
    evil.getProjects()
    evil.giveProjects()
    evil.hiringWorker()
    evil.company.groups.startWorking()
    evil.company.groups.checkWork()
    i++
  }
}

test(25)

console.log(evil)
console.log(`release --- ${JSON.stringify(evil.company.groups.storageProject.filter((cur) => {
  return cur.status == 'complete'
}))}`)

console.log(`Hiring All --- ${JSON.stringify(evil.hiring)}`)

console.log(`In work --- ${JSON.stringify(evil.company.groups.storageProject.filter((cur) => {
  return cur.status == 'in work'
}))}`)

console.log(`STORAGE --- ${JSON.stringify(evil.company.groups.storageProject)}`)

console.log(`Web firing --- ${JSON.stringify(evil.company.groups['web-dev'].firing)}`)

console.log(`Mobile firing --- ${JSON.stringify(evil.company.groups['mobile-dev'].firing)}`)

console.log(`QA firing --- ${JSON.stringify(evil.company.groups['QA'].firing)}`)

console.log(`Web workers --- ${JSON.stringify(evil.company.groups['web-dev'].workers)}`)

console.log(`Mobile workers --- ${JSON.stringify(evil.company.groups['mobile-dev'].workers)}`)

console.log(`QA workers --- ${JSON.stringify(evil.company.groups['QA'].workers)}`)
