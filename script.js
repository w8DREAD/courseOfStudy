var course =
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
                    }],
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
                    }],
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
                    }],
            }

    };




function answer(id) {

    let myDiv = document.getElementById(id);

    lab = document.createElement('label');
    lab.innerHTML = `<input type="radio" name="myname" value="0">Гоша`;
    myDiv.insertAdjacentElement("beforeend", lab);
    myDiv.insertAdjacentHTML("beforeend", `</br>`);
}

function theme(id) {

    for (key in course) {

        let div = document.createElement('div');

        div.id = id;
        div.innerHTML = `<h2>${(course[key].theme)}</h2></br>`;
        document.body.appendChild(div);
}
}

theme(123);

for (key in course) {
    console.log(course[key])
}


//course.themeMultiple.quests[2].rightAnswer

    // calc.onclick = function(){
//     let myForm = this.form,
//         chbx = myForm['precipitation'],
//         chbxSum = 0;
//     for(var i = 0; i < chbx.length; i++){
//         if(chbx[i].checked) {
//             chbxSum += +chbx[i].value;
//         }
//     }
//     myForm.result.value = +myForm.myname.value + +myForm.street.value + chbxSum;
// }