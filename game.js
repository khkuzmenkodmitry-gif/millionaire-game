// ==============================================
// ПРОСТАЯ РАБОЧАЯ ВЕРСИЯ
// ==============================================

// Вопросы (встроенные)
let questions = [
    {
        question: "Какая планета называется 'Красной планетой'?",
        answers: ["Венера", "Марс", "Юпитер", "Сатурн"],
        correct: 1
    },
    {
        question: "Кто написал картину 'Мона Лиза'?",
        answers: ["Ван Гог", "Пикассо", "Леонардо да Винчи", "Микеланджело"],
        correct: 2
    },
    {
        question: "Какое животное является символом Олимпийских игр?",
        answers: ["Лев", "Орёл", "Медведь", "Панда"],
        correct: 3
    }
    {
    question: "Какое озеро является самым глубоким в мире?",
    answers: ["Байкал", "Виктория", "Верхнее", "Титикака"],
    correct: 0
},
{
    question: "Кто написал 'Евгения Онегина'?",
    answers: ["Лермонтов", "Пушкин", "Гоголь", "Тургенев"],
    correct: 1
},
{
    question: "Какой металл является жидким при комнатной температуре?",
    answers: ["Ртуть", "Свинец", "Олово", "Цинк"],
    correct: 0
},
{
    question: "В каком году началась Вторая мировая война?",
    answers: ["1937", "1938", "1939", "1940"],
    correct: 2
},
{
    question: "Какое животное имеет самый длинный язык?",
    answers: ["Жираф", "Хамелеон", "Муравьед", "Дятел"],
    correct: 1
},
{
    question: "Кто изобрёл радио?",
    answers: ["Попов", "Маркони", "Тесла", "Эдисон"],
    correct: 0
},
{
    question: "Какая самая маленькая птица в мире?",
    answers: ["Воробей", "Колибри", "Королёк", "Синица"],
    correct: 1
},
{
    question: "В какой стране находится Великая Китайская стена?",
    answers: ["Япония", "Корея", "Китай", "Монголия"],
    correct: 2
},
{
    question: "Какой химический элемент обозначается символом 'Fe'?",
    answers: ["Фтор", "Фосфор", "Фермий", "Железо"],
    correct: 3
},
{
    question: "Кто был первым космонавтом?",
    answers: ["Титов", "Гагарин", "Леонов", "Армстронг"],
    correct: 1
},
{
    question: "Какое море не имеет берегов?",
    answers: ["Саргассово", "Карибское", "Средиземное", "Красное"],
    correct: 0
},
{
    question: "Сколько хромосом у здорового человека?",
    answers: ["42", "44", "46", "48"],
    correct: 2
}
];

let currentGameQuestions = [];
let currentQuestionIndex = 0;
let currentScore = 0;

// ПОКАЗ ГЛАВНОГО МЕНЮ
function showMenu() {
    document.body.innerHTML = `
        <div style="text-align:center; padding:50px; background:linear-gradient(135deg, #0B0C1E, #1A1F3A); min-height:100vh; color:white; font-family:Arial;">
            <h1 style="color:#FFD700; font-size:48px; margin-bottom:20px;">💰 КТО ХОЧЕТ СТАТЬ МИЛЛИОНЕРОМ?</h1>
            
            <div style="background:rgba(255,215,0,0.1); padding:20px; border-radius:10px; margin:20px auto; max-width:400px;">
                <p style="font-size:18px;">📚 Загружено вопросов: <strong style="color:#FFD700; font-size:24px;">${questions.length}</strong></p>
            </div>
            
            <div style="margin:30px 0;">
                <button onclick="startGame()" style="padding:15px 40px; font-size:20px; background:#00C851; color:white; border:none; border-radius:10px; margin:10px; cursor:pointer; font-weight:bold;">
                    ▶️ НАЧАТЬ ИГРУ
                </button>
                
                <button onclick="showAdmin()" style="padding:15px 40px; font-size:20px; background:#33b5e5; color:white; border:none; border-radius:10px; margin:10px; cursor:pointer; font-weight:bold;">
                    🔧 АДМИН ПАНЕЛЬ
                </button>
            </div>
        </div>
    `;
}

// НАЧАЛО ИГРЫ
function startGame() {
    if (questions.length === 0) {
        alert('❌ Нет вопросов!');
        return;
    }
    
    // Перемешиваем вопросы
    currentGameQuestions = [...questions].sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    currentScore = 0;
    
    showQuestion();
}

// ПОКАЗ ВОПРОСА
function showQuestion() {
    const q = currentGameQuestions[currentQuestionIndex];
    
    document.body.innerHTML = `
        <div style="padding:20px; background:linear-gradient(135deg, #0B0C1E, #1A1F3A); min-height:100vh; color:white; font-family:Arial;">
            <div style="text-align:center; max-width:800px; margin:0 auto;">
                <div style="background:#FFD700; color:black; padding:10px; border-radius:5px; margin-bottom:20px;">
                    Вопрос ${currentQuestionIndex + 1} из ${currentGameQuestions.length}
                </div>
                
                <h2 style="color:#FFD700; margin-bottom:30px;">${q.question}</h2>
                
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px;">
                    <button onclick="checkAnswer(0)" style="padding:20px; background:#2A3F7A; color:white; border:2px solid #4A5A9A; border-radius:10px; cursor:pointer; font-size:16px; text-align:left;">
                        <span style="background:#FFD700; color:black; width:30px; height:30px; display:inline-block; border-radius:50%; text-align:center; line-height:30px; margin-right:10px;">А</span> ${q.answers[0]}
                    </button>
                    <button onclick="checkAnswer(1)" style="padding:20px; background:#2A3F7A; color:white; border:2px solid #4A5A9A; border-radius:10px; cursor:pointer; font-size:16px; text-align:left;">
                        <span style="background:#FFD700; color:black; width:30px; height:30px; display:inline-block; border-radius:50%; text-align:center; line-height:30px; margin-right:10px;">Б</span> ${q.answers[1]}
                    </button>
                    <button onclick="checkAnswer(2)" style="padding:20px; background:#2A3F7A; color:white; border:2px solid #4A5A9A; border-radius:10px; cursor:pointer; font-size:16px; text-align:left;">
                        <span style="background:#FFD700; color:black; width:30px; height:30px; display:inline-block; border-radius:50%; text-align:center; line-height:30px; margin-right:10px;">В</span> ${q.answers[2]}
                    </button>
                    <button onclick="checkAnswer(3)" style="padding:20px; background:#2A3F7A; color:white; border:2px solid #4A5A9A; border-radius:10px; cursor:pointer; font-size:16px; text-align:left;">
                        <span style="background:#FFD700; color:black; width:30px; height:30px; display:inline-block; border-radius:50%; text-align:center; line-height:30px; margin-right:10px;">Г</span> ${q.answers[3]}
                    </button>
                </div>
                
                <button onclick="showMenu()" style="margin-top:30px; padding:10px 30px; background:#666; color:white; border:none; border-radius:5px; cursor:pointer;">
                    Выйти в меню
                </button>
            </div>
        </div>
    `;
}

// ПРОВЕРКА ОТВЕТА
function checkAnswer(selected) {
    const q = currentGameQuestions[currentQuestionIndex];
    
    if (selected === q.correct) {
        // Правильный ответ
        const prizes = [100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000, 250000, 500000, 1000000];
        currentScore += prizes[currentQuestionIndex] || 1000;
        
        if (currentQuestionIndex + 1 < currentGameQuestions.length) {
            currentQuestionIndex++;
            showQuestion();
        } else {
            alert(`🎉 ПОБЕДА! Вы выиграли ${currentScore} ₽!`);
            showMenu();
        }
    } else {
        alert(`❌ Неправильно! Игра окончена. Ваш выигрыш: ${currentScore} ₽`);
        showMenu();
    }
}

// АДМИН ПАНЕЛЬ
function showAdmin() {
    const password = prompt('Введите пароль администратора:');
    if (password !== '9999') {
        alert('❌ Неверный пароль!');
        return;
    }
    
    let adminHtml = `
        <div style="padding:20px; background:linear-gradient(135deg, #0B0C1E, #1A1F3A); min-height:100vh; color:white; font-family:Arial;">
            <h2 style="color:#FFD700; text-align:center;">УПРАВЛЕНИЕ ВОПРОСАМИ</h2>
            
            <div style="background:rgba(255,255,255,0.1); padding:20px; border-radius:10px; margin:20px 0;">
                <h3 style="color:#FFD700;">➕ ДОБАВИТЬ НОВЫЙ ВОПРОС</h3>
                <input id="qText" placeholder="Введите вопрос" style="width:100%; padding:10px; margin:5px 0; border-radius:5px; border:none;"><br>
                <input id="a0" placeholder="Ответ А" style="width:100%; padding:10px; margin:5px 0; border-radius:5px; border:none;"><br>
                <input id="a1" placeholder="Ответ Б" style="width:100%; padding:10px; margin:5px 0; border-radius:5px; border:none;"><br>
                <input id="a2" placeholder="Ответ В" style="width:100%; padding:10px; margin:5px 0; border-radius:5px; border:none;"><br>
                <input id="a3" placeholder="Ответ Г" style="width:100%; padding:10px; margin:5px 0; border-radius:5px; border:none;"><br>
                
                <div style="margin:10px 0;">
                    <label style="color:#FFD700;">Правильный ответ: </label>
                    <select id="correctSelect" style="padding:10px; border-radius:5px;">
                        <option value="0">А</option>
                        <option value="1">Б</option>
                        <option value="2">В</option>
                        <option value="3">Г</option>
                    </select>
                </div>
                
                <button onclick="addQuestion()" style="background:#00C851; color:white; padding:10px 30px; border:none; border-radius:5px; cursor:pointer; font-size:16px;">
                    ✅ ДОБАВИТЬ ВОПРОС
                </button>
            </div>
            
            <h3 style="color:#FFD700;">📋 СПИСОК ВСЕХ ВОПРОСОВ (${questions.length})</h3>
            <div style="max-height:400px; overflow-y:auto;">
    `;
    
    questions.forEach((q, index) => {
        adminHtml += `
            <div style="background:rgba(255,255,255,0.05); padding:15px; margin:10px 0; border-radius:5px; border-left:4px solid #FFD700;">
                <p><strong>${index + 1}.</strong> ${q.question}</p>
                <p style="color:#aaa; font-size:14px;">
                    А: ${q.answers[0]}<br>
                    Б: ${q.answers[1]}<br>
                    В: ${q.answers[2]}<br>
                    Г: ${q.answers[3]}
                </p>
                <p style="color:#00C851;">✅ Правильный ответ: ${['А','Б','В','Г'][q.correct]}</p>
                <button onclick="deleteQuestion(${index})" style="background:#ff4444; color:white; border:none; padding:5px 15px; border-radius:3px; cursor:pointer;">
                    🗑️ Удалить
                </button>
            </div>
        `;
    });
    
    adminHtml += `
            </div>
            <div style="margin-top:20px; text-align:center;">
                <button onclick="saveQuestions()" style="background:#FFD700; color:black; padding:15px 30px; border:none; border-radius:5px; margin:5px; cursor:pointer; font-weight:bold;">
                    💾 СОХРАНИТЬ ВСЕ
                </button>
                <button onclick="showMenu()" style="background:#666; color:white; padding:15px 30px; border:none; border-radius:5px; cursor:pointer;">
                    ◀️ В ГЛАВНОЕ МЕНЮ
                </button>
            </div>
        </div>
    `;
    
    document.body.innerHTML = adminHtml;
}

// ДОБАВЛЕНИЕ ВОПРОСА
function addQuestion() {
    const newQuestion = {
        question: document.getElementById('qText').value,
        answers: [
            document.getElementById('a0').value,
            document.getElementById('a1').value,
            document.getElementById('a2').value,
            document.getElementById('a3').value
        ],
        correct: parseInt(document.getElementById('correctSelect').value)
    };
    
    if (!newQuestion.question || !newQuestion.answers[0] || !newQuestion.answers[1] || !newQuestion.answers[2] || !newQuestion.answers[3]) {
        alert('❌ Заполните все поля!');
        return;
    }
    
    questions.push(newQuestion);
    saveQuestions();
    showAdmin();
}

// УДАЛЕНИЕ ВОПРОСА
function deleteQuestion(index) {
    if (confirm('Удалить этот вопрос?')) {
        questions.splice(index, 1);
        saveQuestions();
        showAdmin();
    }
}

// СОХРАНЕНИЕ ВОПРОСОВ
function saveQuestions() {
    localStorage.setItem('millionaireQuestions', JSON.stringify(questions));
    alert('✅ Вопросы сохранены!');
}

// ЗАГРУЗКА ПРИ СТАРТЕ
function loadQuestions() {
    const saved = localStorage.getItem('millionaireQuestions');
    if (saved) {
        questions = JSON.parse(saved);
    }
    showMenu();
}

// ЗАПУСК
window.onload = loadQuestions;

