document.addEventListener("DOMContentLoaded", function () {
    class Task {
        constructor(num, select, text_task, several_correct_answers, answers, correct_answers) {
            this.num = num; // Номер задания
            this.select = select; // Написать ответ (false) / выбрать из вариантов (true)
            this.text_task = text_task; // Текст задания 
            this.several_correct_answers = several_correct_answers; // Может быть несколько различных вариантов ответа (false = нет, true = да) 
            this.answers = answers; // варианты ответов
            this.correct_answers = correct_answers; // верные ответы
        }
    }
    // Массив заданий
    let tasks = [];

    //Загрузка файла
    document.getElementById("file").addEventListener("change", function (e) {
        let file = e.target.files[0];
        let output = document.getElementById("output");
        let reader = new FileReader();
        reader.onload = function (e) {
            let text = e.target.result;
            let array = text.split("\n");
            for (let i = 0; i < array.length; i++) {
                array[i] = array[i].split("|");
            }
            for (let i = 0; i < array.length; i++) {
                if (array[i][1] == "false") {
                    array[i][5] = parseAns(array[i][5]);
                    tasks[i] = new Task(array[i][0], array[i][1], array[i][2], false, "Нужно вписать один ответ", array[i][5]);
                }
                else if (array[i][1] == "true") {
                    array[i][4] = parseAns(array[i][4]);
                    array[i][5] = parseAns(array[i][5]);
                    tasks[i] = new Task(array[i][0], array[i][1], array[i][2], array[i][3], array[i][4], array[i][5]);
                }
            }
            document.getElementById("load_questions").style.display = "none";
            createBlockQuestionsLine();
        };
        reader.readAsText(file);

    });
    // Функция создания блока с вписываемым ответом
    let current_task = 0;
    let main = document.getElementById("main");
    function createBlockQuestionsLine() {
        let div = document.createElement("div");
        div.classList.add("block_questions");
        main.appendChild(div);
        let div_question = document.createElement("div");
        div_question.classList.add("question");
        div_question.innerHTML = tasks[current_task].text_task;
        div.appendChild(div_question);
        let div_userAnswer = document.createElement("div");
        div_userAnswer.classList.add("user_answer");
        div.appendChild(div_userAnswer);

    }
    // Функция создания блока с одиночным выбором ответа
    function createBlockQuestionsChoice() {
        return;
    }
    // Функция создания блока с множественным выбором ответа
    function createBlockQuestionsMultiChoice() {
        return;
    }

    function parseAns(arr) {
        arr = arr.split(";");
        for (let i = 0; i < arr.length; i++) {
            arr[i] = arr[i].trim();
        }
        return arr;
    }



    /*  let div = document.createElement("div");
     div.classList.add("block_questions");
     div.style.display = "grid";
     div.innerHTML = "Текст";
     document.body.appendChild(div); */

})