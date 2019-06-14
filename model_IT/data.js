// for generation
let id = 0,
    num = 0;

class Director {

    constructor(name, company) {

        this.name = name;
        this.storageWaiting = {
            web: [],
            mobile: [],
            QA: []
        };
        this.hiring = [];
        this.firing = [];
        this.company = company;

    }

    checkProject () {

        for (let group of Object.keys(this.company)) {

            if (this.storageWaiting.hasOwnProperty(group)) {

                let arrProcess = this.company[group].projectInProcess.slice();

                arrProcess.forEach( (cur, ind) => {

                    if(cur.daysInWork >= cur.difficulty) {

                        cur.workers.forEach((c) => {

                            c.completeProjects.push(cur.name);
                            c.withoutWorks = 0;
                            this.company[group].workers.push(c);

                        });
                        cur.workers = [];
                        if (group != 'QA') {
                            this.storageWaiting.QA.push(cur);

                        } else {
                            this.company.completeProjects.push(cur);

                        }
                        this.company[group].projectInProcess.splice(arrProcess.indexOf(ind), 1)
                    }

                });

                this.company[group].projectInProcess.forEach( (cur) => {

                    if (group == 'QA') {
                        cur.daysInWork = 3;
                    }
                    if (group == 'mobile') {
                        cur.daysInWork += cur.workers.length;

                    }
                    if (group == 'web') {
                        cur.daysInWork += 1;

                    }
                });
            }
        }


    }

    hiringWorker() {

        for (let group of Object.keys(this.company)) {

            if (this.storageWaiting.hasOwnProperty(group)) {

                if (this.storageWaiting[group].length > 0) {

                    while (this.storageWaiting[group].length > this.company[group].workers.length) {
                        let worker = new Worker(id, group);
                        this.company[group].workers.push(worker);
                        this.hiring.push(worker);
                    }
                }
            }
        }
    }

    firingWorker() {

        for (let group of Object.keys(this.company)) {

            if (this.storageWaiting.hasOwnProperty(group)) {

                let notWorks = [];
                let arrWorks = this.company[group].workers.slice();


                arrWorks.forEach((cur) => {

                    if (cur.withoutWorks >= 3) {

                        notWorks.push(cur)

                    }

                });

                if(notWorks.length > 0) {

                    notWorks.sort( (a, b) => {
                        if (a.completeProjects.length > b.completeProjects.length) {
                            return -1;
                        }
                        if (a.completeProjects.length < b.completeProjects.length) {
                            return 1;
                        }
                        return 0;
                    });

                    this.firing.push(notWorks[0]);
                    this.company[group].workers.splice(notWorks.indexOf(0), 1)

                }

                this.company[group].workers.forEach( (cur) => {

                    cur.withoutWorks += 1;

                });
            }

        }
    }


    getProject() {

        let i = 0,
            inDay = {
                web: [],
                mobile: []
            };

        while (i < random(0, 4)) {

            let project = new Project();

            if (project.type == 'web') {
                inDay.web.unshift(project);
            } else {
                inDay.mobile.unshift(project);
            }
            i++;
        }
        if (inDay.web[0] != undefined) {
            this.storageWaiting.web.unshift(inDay.web[0]);
        }
        if (inDay.mobile[0] != undefined) {
            this.storageWaiting.mobile.unshift(inDay.mobile[0]);
        }
    }

    giveProject() {

        for (let group of Object.keys(this.company)) {
            if (this.storageWaiting.hasOwnProperty(group)) {
                if (this.storageWaiting[group].length > 0) {

                    let arr = this.storageWaiting[group].slice();

                    arr.forEach((c, i) => {

                        if (this.company[group].workers.length > this.company[group].storageProject.length) {
                            this.company[group].storageProject.push(c);
                            this.storageWaiting[group].splice(arr.indexOf(i), 1);

                        }
                    })
                }
            }
        }
    }
}

class Company {

    constructor(name, groups) {

        this.name = name;
        this.completeProjects = [];

        let group = 1;

        while (group < arguments.length) {

            this[arguments[group]] = new Groups(arguments[group]);
            group++
        }
    }

    startedWork() {

        for (let group of Object.keys(this)) {

            if (group != 'name' && group != 'completeProjects') {

                let arrProject = this[group].storageProject.slice();
                let arrWorkers = this[group].workers.slice();

                arrProject.forEach( (cur, ind) => {
                    cur.workers.push(arrWorkers[ind]);
                    this[group].projectInProcess.push(cur);
                    this[group].storageProject.splice(arrProject.indexOf(ind), 1);
                    this[group].workers.splice(arrWorkers.indexOf(ind), 1)

                });

            }

            if (group == 'mobile') {
                if (this[group].workers.length > 0 && this[group].storageProject.length == 0) {

                        let arrProcess = this[group].projectInProcess;
                        let arrWorkers = this[group].workers.slice();

                    arrProcess.forEach( (cur, ind) => {

                            while (cur.workers.length < 3) {
                                if(this[group].workers.length > 0) {
                                    cur.workers.push(arrWorkers[ind]);
                                    this[group].workers.splice(arrWorkers.indexOf(ind), 1)
                                } else {
                                    break
                                }
                            }
                    });

                }
            }
        }


    }
}
class Project {

    constructor() {
        this.name = "Project N-" + num;
        this.type = ['web', 'mobile'][random()];
        this.difficulty = random(1, 3);
        this.workers = [];
        this.daysInWork = 0;
        num++;
    }

}
class Groups {

    constructor (name) {

        this.name = name;
        this.workers = [];
        this.projectInProcess = [];
        this.storageProject = [];
    }

}

class Worker {

    constructor (name, skill) {

        this.name = 'Worker_' + name;
        this.skill = skill;
        this.completeProjects = [];
        this.withoutWorks = 0;
        id++
    }

}


function random (min = 0, max = 1) {
    return Math.round(Math.random() * (max - min) + min)
}

let qwe;

qwe = new Company('Corporation', 'web', 'mobile', 'QA');

let evil = new Director("Evil's", qwe);

function test (n) {

    let i = 0;

    while (i < n) {

        evil.getProject();
        evil.hiringWorker();
        evil.giveProject();

        evil.firingWorker();
        evil.checkProject();

        evil.company.startedWork();
        i++
    }

}

test(15);

module.exports = evil;