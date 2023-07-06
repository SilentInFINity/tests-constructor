(() => {
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
    let current_task = 0;
    let current_block_task = 0;
    let score = 0;
    let tasks = [];

    function createBlockQuestions() {
        let div_main = document.getElementById("main");
        let div_block_questions = document.createElement("div");
        div_block_questions.classList.add("block_questions");
        div_block_questions.id = "block_questions_" + current_task;
        div_main.appendChild(div_block_questions);
        let div_question = document.createElement("div");
        div_question.classList.add("question");
        div_question.innerHTML = tasks[current_task].text_task;
        div_block_questions.appendChild(div_question);
        let div_userAnswer = document.createElement("div");
        div_userAnswer.classList.add("user_answer");
        div_block_questions.appendChild(div_userAnswer);
        let div_buttons_area = document.createElement("div");
        div_buttons_area.classList.add("buttons_area");
        div_block_questions.appendChild(div_buttons_area);
        let div1 = document.createElement("div");
        let div2 = document.createElement("div");
        div_buttons_area.appendChild(div1);
        div_buttons_area.appendChild(div2);
        let button_prev = document.createElement("button");
        button_prev.id = "button_prev_" + tasks[current_task].num;
        let button_next = document.createElement("button");
        button_next.id = "button_next_" + tasks[current_task].num;
        button_prev.innerHTML = "Назад";
        button_next.innerHTML = "Дальше";
        if (current_task == tasks.length - 1) {
            button_next.innerHTML = "Сохранить результат";
        }
        button_prev.onclick = prev;
        button_next.onclick = next;
        div1.appendChild(button_prev);
        div2.appendChild(button_next);
        /*  if (current_task == 0) {
             div_block_questions.style.display = "grid";
         } */
        if (tasks[current_task].select == "false") {
            createBlockUserAnswerLine(div_userAnswer);
        }
        else if (tasks[current_task].select == "true") {
            createBlockUserAnswerChoice(div_userAnswer);
        }
        else {
            alert("Ошибка при обработке фалйа");
        }

    }
    // Функция создания блока с вписываемым ответом
    function createBlockUserAnswerLine(div_userAnswer) {
        let input_txt = document.createElement("input");
        input_txt.type = "text";
        input_txt.setAttribute("autocomplete", "off");
        input_txt.classList.add("write");
        input_txt.id = tasks[current_task].num;
        div_userAnswer.appendChild(input_txt);
        current_task++;
    }
    // Функция создания блока с одиночным выбором ответа
    function createBlockUserAnswerChoice(div_userAnswer) {
        let div_check = document.createElement("div");
        div_check.classList.add("check");
        div_userAnswer.appendChild(div_check);
        div_check.id = tasks[current_task].num;
        if (tasks[current_task].several_correct_answers == "true") {
            createBlockUserAnswerMultiChoice(div_check);
        }
        else if (tasks[current_task].several_correct_answers == "false") {
            for (let i = 0; i < tasks[current_task].answers.length; i++) {
                let input_radio = document.createElement("input");
                input_radio.type = "radio";
                input_radio.name = tasks[current_task].num;
                input_radio.value = tasks[current_task].answers[i];
                div_check.appendChild(input_radio);
                let div = document.createElement("div");
                div.innerHTML = tasks[current_task].answers[i];
                div_check.appendChild(div);
            }
            current_task++;
        }
        else {
            throw new Error(alert("Ошибка при обработке файла"));

        }
    }
    // Функция создания блока с множественным выбором ответа
    function createBlockUserAnswerMultiChoice(div_check) {
        for (let i = 0; i < tasks[current_task].answers.length; i++) {
            let input_checkbox = document.createElement("input");
            input_checkbox.type = "checkbox";
            input_checkbox.name = tasks[current_task].num;
            input_checkbox.value = tasks[current_task].answers[i];
            div_check.appendChild(input_checkbox);
            let div = document.createElement("div");
            div.innerHTML = tasks[current_task].answers[i];
            div_check.appendChild(div);
        }

        current_task++;
    }
    function prev() {
        if (current_block_task == 0) {
            return;
        }
        else {
            let block = document.getElementById("block_questions_" + current_block_task);
            block.style.display = "none";
            current_block_task--;
            block = document.getElementById("block_questions_" + current_block_task);
            block.style.display = "grid";
        }
    }
    function next() {
        if (current_block_task != current_task - 1) {
            let block = document.getElementById("block_questions_" + current_block_task);
            block.style.display = "none";
            current_block_task++;
            block = document.getElementById("block_questions_" + current_block_task);
            block.style.display = "grid";
        }
        else {
            //Нужна функция для сохранения и отправки результата
            let button = document.getElementById(`button_next_№${current_task}`);
            checkAnswers();
            return;
        }
    }

    function parseAns(arr) {
        arr = arr.split(";");
        for (let i = 0; i < arr.length; i++) {
            arr[i] = arr[i].trim();
        }
        return arr;
    }

    function checkAnswers() {
        let k = 0;
        for (let i = 0; i < tasks.length; i++) {
            let check = document.getElementById(`№${i + 1}`);
            if (check.classList.contains("check")) {
                const ans_radio = document.querySelectorAll(`input[name = "${tasks[i].num}"][type = "radio"]`)
                const ans_box = document.querySelectorAll(`input[name = "${tasks[i].num}"][type = "checkbox"]`)
                if (ans_box.length != 0) {
                    for (const f of ans_box) {
                        if (f.checked && tasks[i].correct_answers.includes(f.value)) {
                            k++;
                        }
                        if (f.checked && !tasks[i].correct_answers.includes(f.value)) {
                            k--;
                        }
                    }
                    if (k > 0) {
                        score += (k / tasks[i].correct_answers.length);
                    }
                }
                for (const f of ans_radio) {
                    if (f.checked && tasks[i].correct_answers.includes(f.value)) {
                        score++;
                    }
                }
            }
            else {
                if (tasks[i].correct_answers.includes(check.value)) {
                    score++;
                }
            }
        }
        console.log(score);
    }

    function createBlockTeleport() {
        let div_main = document.getElementById("main");
        let block_teleport = document.createElement("div");
        block_teleport.classList.add("block_teleport");
        block_teleport.id = "block_teleport";
        div_main.appendChild(block_teleport);
        let block_teleport_head = document.createElement("div");
        block_teleport_head.classList.add("block_teleport_head");
        block_teleport.appendChild(block_teleport_head);
        let block_teleport_body = document.createElement("div");
        block_teleport_body.classList.add("block_teleport_body");
        block_teleport.appendChild(block_teleport_body);
        let div_time = document.createElement("div");
        div_time.id = "time";
        block_teleport_head.appendChild(div_time);
        let div_quest = document.createElement("div");
        div_quest.style.textAlign = "center";
        div_quest.innerHTML = "Задания";
        block_teleport_head.appendChild(div_quest);
        for (let i = 0; i < tasks.length; i++) {
            let div_quest_num = document.createElement("div");
            div_quest_num.classList.add("quest_num");
            div_quest_num.innerHTML = tasks[i].num;
            div_quest_num.id = "num_" + tasks[i].num;
            div_quest_num.onclick = move;
            block_teleport_body.appendChild(div_quest_num);
        }
        let x, y;
        x = tasks.length;
        if (x % 2 != 0) x++;
        for (let i = 10; i > 0; i--) {
            if (x % i == 0) {
                x /= i;
                break;
            }
        }
        y = (tasks.length) / x;
        block_teleport_body.style.cssText = `grid-template-rows: repeat(${y},1fr); grid-template-columns: repeat(${x},1fr);`;
        block_teleport.style.display = "grid";
        block_teleport.style.width = block_teleport_body.offsetWidth + "px";
        console.log(block_teleport_body.offsetWidth)
    }

    function move(q) {
        let num = this.id;
        num = Number(num.replace(/[^0-9]/g, ""));
        num--;
        let div_block_questions = document.getElementById("block_questions_" + current_block_task);
        div_block_questions.style.display = "none";
        current_block_task = num;
        div_block_questions = document.getElementById("block_questions_" + current_block_task);
        div_block_questions.style.display = "grid";

    }

    function info() {
        let div_main = document.getElementById("main");
        let info = document.createElement("div");
        info.classList.add("load_questions");
        div_main.appendChild(info);
        let info_txt = document.createElement("div");
        info_txt.style.textAlign = "center";
        info_txt.innerHTML = `Время на выполнение теста:<br> ${time[0]} ч. ${time[1]} м.`;
        info.appendChild(info_txt);
        let button_start = document.createElement("button");
        button_start.innerHTML = "Начать";
        button_start.id = "button_start";
        info.appendChild(button_start);
        button_start.onclick = function () {
            let block_question_0 = document.getElementById("block_questions_0").style.display = "grid";
            createBlockTeleport();
            div_main.removeChild(info);
        };
    }

    let time;
    function main() {
        //Загрузка файла
        document.getElementById("file").addEventListener("change", function (e) {
            let file = e.target.files[0];
            let reader = new FileReader();
            reader.onload = function (e) {
                let text = e.target.result;
                let array = text.split("\n");
                time = array.shift();
                time = time.split(":");
                for (let i = 0; i < array.length; i++) {
                    array[i] = array[i].split("|");
                }
                for (let i = 0; i < array.length; i++) {
                    if (array[i][1] == "false") {
                        array[i][5] = parseAns(array[i][5]);
                        tasks[i] = new Task(array[i][0], array[i][1], array[i][2], "false", "Нужно вписать один ответ", array[i][5]);
                    }
                    else if (array[i][1] == "true") {
                        array[i][4] = parseAns(array[i][4]);
                        array[i][5] = parseAns(array[i][5]);
                        tasks[i] = new Task(array[i][0], array[i][1], array[i][2], array[i][3], array[i][4], array[i][5]);

                    } else {
                        throw new Error(alert("Ошибка при обработке файла"));
                    }
                }
                document.getElementById("load_questions").style.display = "none";
                while (current_task != tasks.length) {
                    createBlockQuestions();
                }
                info();
            };
            reader.readAsText(file);
        });
    }
    document.addEventListener("DOMContentLoaded", () => { main() })
})()