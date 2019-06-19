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
        while (this.company.groups[groupName]._method == 'test' && this.company.groups[groupName].workers < projectsGroup) {
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
                  curProj.workers.push(arrWorkers[0])
                  curProj.status = 'in work'
                  remEl(arrWorkers[0].name, this[groupName].workers, 'name')
                }
              if (arrWorkers[0].skill == curProj.spec)
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
                          curProj.workers.push(curWorker)
                          remEl(curWorker.name, this[groupName].workers, 'name')
                        }
                      })
                    }
                  }
                })
              }
            }
            if (this[groupName]._method == 'test') {
              let projectsGroup = this.storageProject.filter((curProj) => {
                return curProj.status = 'for test'
              }).length

              if (this[groupName].workers.length && projectsGroup == 0) {
                this.storageProject.forEach((curProj) => {
                  if (curProj.status == 'for test') {
                    if (this[groupName].workers.length) {
                      curProj.workers.push(this[groupName].workers[0])
                      remEl(this[groupName].workers[0].name, this[groupName].workers, 'name')
                      curProj.daysInWork = 0
                    }
                  }
                })
              }
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
                if (curProj.status != 'test') {
                  curProj.status = 'for test'
                  curProj.workers = []
                } else {
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
    if (this.workers.length && this.status == 'for test') {
      this.daysInWork = this.difficulty
    } else if (this.workers.length > 1) {
      this.daysInWork += this.workers.length
    } else if (this.workers.length == 1 && this.status == 'in work') {
      this.daysInWork += 1
    }
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

test(300)

console.log(evil)
console.log(evil.company.groups.storageProject.filter((cur) => {
  return cur.status == 'complete'
}))

console.log(evil.hiring)
console.log(evil.company.groups['web-dev'].firing)
console.log(evil.company.groups['mobile-dev'].firing)
console.log(evil.company.groups['QA'].firing)
