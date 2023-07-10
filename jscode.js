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

    //Функция для создания основных блоков
    function createBlockQuestions() {
        let div_main = document.getElementById("main");
        let div_block_questions = document.createElement("div");
        div_block_questions.classList.add("block_questions");
        div_block_questions.id = "block_questions_" + current_task;
        div_main.appendChild(div_block_questions);
        let div_question = document.createElement("div");
        div_question.classList.add("question");
        div_question.innerHTML = tasks[current_task].num + "<br>" + tasks[current_task].text_task;
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

    //Функция для перемещения назад
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
            autoFocus(block);
            let num = document.getElementById("num_№" + (current_block_task + 2));
            num.style.backgroundColor = "rgb(226, 220, 208)";
            let num_prev = document.getElementById("num_№" + (current_block_task + 1));
            if (num_prev.classList.contains("back_later_color")) {
                num_prev.classList.remove("back_later_color");
            }
            num_prev.style.backgroundColor = "rgb(255, 202, 95)";
        }
    }

    //Функция для перемещения вперёд
    function next() {
        let isOK = true;
        if (current_block_task != current_task - 1) {
            let block = document.getElementById("block_questions_" + current_block_task);
            block.style.display = "none";
            current_block_task++;
            block = document.getElementById("block_questions_" + current_block_task);
            block.style.display = "grid";
            autoFocus(block);
            let num = document.getElementById("num_№" + (current_block_task + 1));
            if (num.classList.contains("back_later_color")) {
                num.classList.remove("back_later_color");
            }
            num.style.backgroundColor = "rgb(255, 202, 95)";
            let num_prev = document.getElementById("num_№" + (current_block_task));
            num_prev.style.backgroundColor = "rgb(226, 220, 208)";

        }
        else {
            let nums = document.querySelectorAll(".quest_num");
            for (const q of nums) {
                if (q.classList.contains("back_later_color")) {
                    isOK = confirm("Есть вопросы к которым вы хотели вернуться. \nВы уверены, что хотите закончить тест?");
                    break;
                }
            }
            if (isOK) {
                for (const q of nums) {
                    if (q.classList.contains("back_later_color")) {
                        q.classList.remove("back_later_color");
                    }
                }
                let button = document.getElementById(`button_next_№${current_task}`);
                checkAnswers();
                button.remove();
                let elements = document.querySelectorAll(".user_answer");
                //Убираем возможность выделения элементов
                toggle = false;
                for (const q of elements) {
                    q.style.pointerEvents = "none";
                }
            }
        }
    }

    let toggle = true;
    //Функция для автоматического выделения блоков с вводом ответа
    function autoFocus(block) {
        if (tasks[current_block_task].select == "false" && toggle) {
            let id = Number(block.id.replace(/[^0-9]/g, ""));
            id++;
            let input_txt = document.getElementById("№" + id);
            input_txt.focus();
        }
    }

    function parseAns(arr) {
        arr = arr.split(";");
        for (let i = 0; i < arr.length; i++) {
            arr[i] = arr[i].trim();
        }
        return arr;
    }

    //Функция проверки ответов
    function checkAnswers() {
        let f2 = false;
        for (let i = 0; i < tasks.length; i++) {
            let k = 0;
            let k2 = 0;
            let check = document.getElementById(`№${i + 1}`);
            let quest_num = document.getElementById(`num_№${i + 1}`);
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
                            f2 = true;
                        }
                    }
                    if (k > 0) {
                        score += (k / tasks[i].correct_answers.length);
                    }
                    if (k == tasks[i].correct_answers.length) {
                        quest_num.classList.add("green");
                    }
                    else if (k == 0 && f2) {
                        quest_num.classList.add("yellow");
                    }
                    else if (k > 0) {
                        quest_num.classList.add("yellow");
                    }
                    else if (k <= 0) {
                        quest_num.classList.add("red");
                    }
                } else {
                    for (const f of ans_radio) {
                        if (f.checked && tasks[i].correct_answers.includes(f.value)) {
                            k2++;
                            score += k2;
                        }
                    }
                    if (k2 > 0) {
                        quest_num.classList.add("green");
                    } else {
                        quest_num.classList.add("red");
                    }
                }
            }
            else {
                if (tasks[i].correct_answers.includes(check.value)) {
                    quest_num.classList.add("green");
                    score++;
                } else {
                    quest_num.classList.add("red");
                }
            }
        }
        clearInterval(timer);
        save_results();
    }

    let back_later_check = false;
    //Функция для создания блока с перемещением по вопросам
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
        div_time.style.textAlign = "center";
        transformTime();
        div_time.textContent =
            (time[0] > 9 ? time[0] : "0" + time[0]) + ":" +
            (time[1] > 9 ? time[1] : "0" + time[1]) + ":" +
            "00";
        block_teleport_head.appendChild(div_time);
        let div_quest = document.createElement("div");
        div_quest.style.textAlign = "center";
        div_quest.innerHTML = "Задания";
        div_quest.style.borderTop = "1px dashed";
        div_quest.style.alignSelf = "center";
        block_teleport_head.appendChild(div_quest);
        let div_back_later = document.createElement("div");
        div_back_later.classList.add("back_later");
        div_back_later.style.borderBottom = "2px solid";
        block_teleport_head.appendChild(div_back_later);
        let div_text_back = document.createElement("div");
        div_text_back.innerHTML = "Вернуться к вопросу позже";
        div_text_back.id = "back_later";
        div_back_later.appendChild(div_text_back);
        div_text_back.onclick = function () {
            let num = document.getElementById("num_№" + (current_block_task + 1));
            num.classList.add("back_later_color");
        }
        for (let i = 0; i < tasks.length; i++) {
            let div_quest_num = document.createElement("div");
            div_quest_num.classList.add("quest_num");
            div_quest_num.innerHTML = tasks[i].num;
            div_quest_num.id = "num_" + tasks[i].num;
            div_quest_num.onclick = move;
            block_teleport_body.appendChild(div_quest_num);
        }
        let x = Math.trunc(tasks.length/5) + 1;
        block_teleport_body.style.cssText = `grid-template-rows: repeat(${x},1fr); grid-template-columns: repeat(${5},1fr);`;
        let num_1 = document.getElementById("num_№1");
        num_1.style.backgroundColor = "rgb(255, 202, 95)";
    }

    function move() {
        this.style.backgroundColor = "rgb(255, 202, 95)";
        if (this.classList.contains("back_later_color")) {
            this.classList.remove("back_later_color");
        }
        let num = this.id;
        num = Number(num.replace(/[^0-9]/g, ""));
        num--;
        let div_block_questions = document.getElementById("block_questions_" + current_block_task);
        div_block_questions.style.display = "none";
        let num_prev = document.getElementById("num_№" + (current_block_task + 1));
        num_prev.style.backgroundColor = "rgb(226, 220, 208)";
        current_block_task = num;
        div_block_questions = document.getElementById("block_questions_" + current_block_task);
        div_block_questions.style.display = "grid";
        autoFocus(div_block_questions);
    }

    //Функция для создания блока для старта теста
    function info() {
        div_main = document.getElementById("main");
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
            block_teleport.style.display = "grid";
            start_timer();
            div_main.removeChild(info);
        };
    }

    function transformTime() {
        if (time[1] > 60) {
            time[0] += Math.trunc(time[1] / 60);
            time[1] = time[1] % 60
        }
    }

    let timer;
    //Функция для таймера
    function start_timer() {
        let hours;
        let minutes;
        let sec = 0;
        hours = time[0];
        minutes = time[1];
        div_time = document.getElementById("time");
        timer = setInterval(function () {
            if (sec == 0 && minutes != 0) {
                minutes--;
                sec = 60;
                if (minutes == 0 && hours != 0) {
                    hours--;
                    minutes = 60;
                }
            }
            sec--;
            div_time.textContent =
                (hours > 9 ? hours : "0" + hours) + ":" +
                (minutes > 9 ? minutes : "0" + minutes) + ":" +
                (sec > 9 ? sec : "0" + sec);
            if (hours == 0 && minutes == 0 && sec == 0) {
                clearInterval(timer);
                checkAnswers();
            }
        }, 1000)
    }

    //Функция для создания блока с результатом
    function createResultsWindow() {
        div_main = document.getElementById("main");
        let modal_window = document.createElement("div");
        modal_window.classList.add("modal_window");
        document.body.appendChild(modal_window);
        let modal_grid = document.createElement("div");
        modal_grid.classList.add("modal_grid");
        modal_window.appendChild(modal_grid);
        let modal_body = document.createElement("div");
        modal_body.classList.add("modal_body");
        modal_body.id = ("modal_body");
        modal_grid.appendChild(modal_body);
        modal_grid.appendChild(document.createElement("div"));
        let form = document.createElement("form");
        form.method = "post";
        //адрес отправки результата
        form.action = "#";
        modal_grid.appendChild(form);
        let hidden_input = document.createElement("input");
        hidden_input.name = "mark";
        hidden_input.type = "hidden";
        hidden_input.id = "mark";
        form.appendChild(hidden_input);
        let button_grid = document.createElement("div");
        button_grid.classList.add("button_grid");
        form.appendChild(button_grid);
        let button_retry = document.createElement("button");
        button_retry.type = "button";
        button_retry.id = "retry";
        button_retry.innerHTML = "Повторить";
        button_grid.onclick = function () {
            location.reload();
        };
        button_grid.appendChild(button_retry);
        let submit = document.createElement("input");
        submit.type = "submit";
        button_grid.appendChild(submit);
        modal_window.style.display = "grid";
    }

    //Функция для подсчёта результата
    function save_results() {
        createResultsWindow();
        score = score.toFixed(2);
        let percent = score / tasks.length * 100;
        percent = percent.toFixed(2);
        percent = Number(percent);
        let modal_body = document.getElementById("modal_body");
        modal_body.style.fontWeight = "bold";
        modal_body.innerHTML = `<br>Результат ${score} из ${tasks.length} (${percent}%)`;
        let mark = document.getElementById("mark");
        mark.value = percent;
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
                for (let i = 0; i < time.length; i++) {
                    time[i] = Number(time[i].replace(/[^0-9]/g, ""));
                }
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
                createBlockTeleport();
                info();
            };
            reader.readAsText(file);
        });
    }
    document.addEventListener("DOMContentLoaded", () => { main() })
})()