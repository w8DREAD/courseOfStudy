var data =
    {
      themePlus:
            {
              theme: 'Сложение',
              quests:
                    [{
                      quest: 'Сколько 2 + 2?',
                      rightAnswer: '4',
                      wrongAnswer: ['1', '2', '3']
                    },
                    {
                      quest: 'Сколько 2 + 1?',
                      rightAnswer: '3',
                      wrongAnswer: ['1', '2', '4']
                    },
                    {
                      quest: 'Сколько 1 + 1?',
                      rightAnswer: '2',
                      wrongAnswer: ['4', '1', '3']
                    }]
            },

      themeMinus:
            {
              theme: 'Вычитание',
              quests:
                    [{
                      quest: 'Сколько 6 - 2?',
                      rightAnswer: '4',
                      wrongAnswer: ['1', '2', '3']
                    },
                    {
                      quest: 'Сколько 2 - 1?',
                      rightAnswer: '1',
                      wrongAnswer: ['4', '2', '3']
                    },
                    {
                      quest: 'Сколько 2 - 2?',
                      rightAnswer: '0',
                      wrongAnswer: ['4', '2', '3']
                    }]
            },

      themeMultiple:
            {
              theme: 'Умножение',
              quests:
                    [{
                      quest: 'Сколько 2 * 2?',
                      rightAnswer: '4',
                      wrongAnswer: ['1', '2', '3']
                    },
                    {
                      quest: 'Сколько 1 * 1?',
                      rightAnswer: '1',
                      wrongAnswer: ['4', '2', '3']
                    },
                    {
                      quest: 'Сколько 2 * 0?',
                      rightAnswer: ['0', '1'],
                      wrongAnswer: ['4', '2', '3']
                    }]
            }

    }

var i = 0
var score
var arrHTML
let myForm = document.getElementById('form')

function test (course) {

  var valueId = 0
  for (key in course) {
    let div = document.createElement('div')


    div.id = 'id_' + i
    div.insertAdjacentHTML('beforeend', `<h2>${(course[key].theme)}</h2></br>`)

    for (arrQuest = 0; arrQuest < course[key].quests.length; arrQuest++) {
      div.insertAdjacentHTML('beforeend', `<h4>${(course[key].quests[arrQuest].quest)}</h4>`)
      myForm.insertAdjacentElement('beforeend', div)

      if (Array.isArray(course[key].quests[arrQuest].rightAnswer)) {
        let myDiv = document.getElementById('id_' + i)

        point('checkbox', 'checks' + valueId, arrQuest, data)
        for (htmlarr of arrHTML.sort(arrRandom)) {
          myDiv.insertAdjacentElement('beforeend', htmlarr)
          myDiv.insertAdjacentHTML('beforeend', `</br>`)
        }
      } else {
        let myDiv = document.getElementById('id_' + i)
        point('radio', 'myname' + valueId, arrQuest, data)

        for (htmlarr of arrHTML.sort(arrRandom)) {
          myDiv.insertAdjacentElement('beforeend', htmlarr)
          myDiv.insertAdjacentHTML('beforeend', `</br>`)
        }
      }
      valueId++
    }
    i++
  }
}

function point (type, myName, arrQuest, course) {
  arrHTML = []

  if (course[key].quests[arrQuest].rightAnswer) {
    score = 1

    for (let i = 0; i < course[key].quests[arrQuest].rightAnswer.length; i++) {
      lab = document.createElement('label')
      lab.innerHTML = `<input type=${type} name=${myName} value=${score}>${((course[key].quests[arrQuest].rightAnswer[i]))}`
      arrHTML.push(lab)
    }
  }

  score = 0

  for (let i = 0; i < course[key].quests[arrQuest].wrongAnswer.length; i++) {
    lab = document.createElement('label')
    lab.innerHTML = `<input type=${type} name=${myName} value=${score}>${((course[key].quests[arrQuest].wrongAnswer[i]))}`
    arrHTML.push(lab)
  }
}

function arrRandom () {
  return Math.random() - 0.5
};


test(data)
function calc () {
  var result = 0
  var allChecked = 0
  var allTag = document.getElementsByTagName('input')

  for (let i = 0; i < allTag.length; i++) {
    var checks = document.getElementsByName('checks' + i)

    if (checks.length > 0) {
      allChecked = 0
      for (let i = 0; i < checks.length; i++) {
        if (checks[i].checked == true) {
          allChecked++
        }
      }
    }
    if (allTag[i].checked) {
      if (allChecked <= 2) { result += +allTag[i].value }
    }
  }
};

var checks = document.getElementsByName('checks' + i)

module.exports = test()

console.log(checks)
