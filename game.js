// ==============================================
// ВЕРСИЯ С GITHUB GIST (РАБОТАЕТ ЧЕРЕЗ VPN)
// ==============================================

// ⚠️ ЗАМЕНИТЕ НА СВОЙ URL ИЗ ШАГА 2!
const GIST_URL = 'https://gist.githubusercontent.com/khkuzmenkodmitry-gif/768233eec608b32bcf9a52a7e22a3f85/raw/questions.json
';

let questions = [];

// Загрузка вопросов из GitHub Gist
async function loadQuestions() {
    try {
        console.log('Загружаем вопросы из GitHub Gist...');
        
        // Добавляем параметр для избежания кэширования
        const response = await fetch(`${GIST_URL}?t=${Date.now()}`);
        
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        
        questions = await response.json();
        
        // Проверяем, что загрузился массив
        if (!Array.isArray(questions)) {
            throw new Error('Неверный формат данных');
        }
        
        console.log(`✅ Загружено ${questions.length} вопросов`);
        showMenu();
        
    } catch (error) {
        console.error('❌ Ошибка загрузки:', error);
        
        // Если не загрузилось, показываем демо-вопросы
        questions = getDemoQuestions();
        alert('⚠️ Не удалось загрузить вопросы. Используются демо-вопросы.');
        showMenu();
    }
}

// Демо-вопросы на всякий случай
function getDemoQuestions() {
    return [
        {
            question: "Столица России?",
            answers: ["Москва", "Питер", "Новгород", "Казань"],
            correct: 0
        },
        {
            question: "Сколько планет в Солнечной системе?",
            answers: ["7", "8", "9", "10"],
            correct: 1
        },
        {
            question: "Какой язык программирования используется для веб-страниц?",
            answers: ["Python", "Java", "JavaScript", "C++"],
            correct: 2
        }
    ];
}

// Сохранение в локальное хранилище (для админки)
async function saveQuestions() {
    try {
        localStorage.setItem('millionaireQuestions', JSON.stringify(questions));
        alert('✅ Вопросы сохранены локально!');
        
        // Примечание: GitHub Gist только для чтения
        alert('📝 Для постоянного сохранения обновите файл в Gist вручную');
        
    } catch (error) {
        alert('❌ Ошибка сохранения');
    }
}

// ПОКАЗ ГЛАВНОГО МЕНЮ
function showMenu() {
    document.body.innerHTML = `
        <div style="text-align:center; padding:50px; background:linear-gradient(135deg, #0B0C1E, #1A1F3A); min-height:100vh; color:white; font-family:Arial;">
            <h1 style="color:#FFD700; font-size:48px; margin-bottom:20px;">💰 КТО ХОЧЕТ СТАТЬ МИЛЛИОНЕРОМ?</h1>
            
            <div style="background:rgba(255,215,0,0.1); padding:20px; border-radius:10px; margin:20px auto; max-width:400px;">
                <p style="font-size:18px;">📚 Загружено вопросов: <strong style="color:#FFD700; font-size:24px;">${questions.length}</strong></p>
                <p style="color:#aaa; font-size:12px;">Источник: GitHub Gist</p>
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
                <h3 style="color:#FFD700;">➕ ДОБАВИТЬ ВОПРОС</h3>
                <input id="qText" placeholder="Вопрос" style="width:100%; padding:10px; margin:5px 0;"><br>
                <input id="a0" placeholder="Ответ А" style="width:100%; padding:10px; margin:5px 0;"><br>
                <input id="a1" placeholder="Ответ Б" style="width:100%; padding:10px; margin:5px 0;"><br>
                <input id="a2" placeholder="Ответ В" style="width:100%; padding:10px; margin:5px 0;"><br>
                <input id="a3" placeholder="Ответ Г" style="width:100%; padding:10px; margin:5px 0;"><br>
                
                <div style="margin:10px 0;">
                    <label>Правильный ответ: </label>
                    <select id="correctSelect" style="padding:10px;">
                        <option value="0">А</option>
                        <option value="1">Б</option>
                        <option value="2">В</option>
                        <option value="3">Г</option>
                    </select>
                </div>
                
                <button onclick="addQuestion()" style="background:#00C851; color:white; padding:10px 30px; border:none; border-radius:5px; cursor:pointer;">
                    ✅ ДОБАВИТЬ
                </button>
            </div>
            
            <div style="background:rgba(255,215,0,0.1); padding:15px; border-radius:5px; margin:20px 0;">
                <p style="color:#FFD700;">⚠️ Важно:</p>
                <p>Изменения сохраняются только локально. Чтобы сделать их постоянными:</p>
                <ol style="text-align:left;">
                    <li>Зайдите на <a href="https://gist.github.com" target="_blank" style="color:#FFD700;">Gist</a></li>
                    <li>Откройте ваш файл questions.json</li>
                    <li>Нажмите "Edit" и обновите вопросы вручную</li>
                </ol>
            </div>
            
            <h3 style="color:#FFD700;">📋 ВСЕ ВОПРОСЫ (${questions.length})</h3>
            <div style="max-height:400px; overflow-y:auto;">
    `;
    
    questions.forEach((q, i) => {
        adminHtml += `
            <div style="background:rgba(255,255,255,0.05); padding:15px; margin:10px 0; border-radius:5px;">
                <p><strong>${i+1}.</strong> ${q.question}</p>
                <p style="color:#aaa; font-size:14px;">
                    А: ${q.answers[0]}<br>
                    Б: ${q.answers[1]}<br>
                    В: ${q.answers[2]}<br>
                    Г: ${q.answers[3]}
                </p>
                <p style="color:#00C851;">✅ Правильный: ${['А','Б','В','Г'][q.correct]}</p>
                <button onclick="deleteQuestion(${i})" style="background:#ff4444; color:white; border:none; padding:5px 15px; border-radius:3px; cursor:pointer;">
                    🗑️ Удалить
                </button>
            </div>
        `;
    });
    
    adminHtml += `
            </div>
            <div style="margin-top:20px; text-align:center;">
                <button onclick="saveQuestions()" style="background:#FFD700; color:black; padding:15px 30px; border:none; border-radius:5px; margin:5px; cursor:pointer; font-weight:bold;">
                    💾 СОХРАНИТЬ ЛОКАЛЬНО
                </button>
                <button onclick="showMenu()" style="background:#666; color:white; padding:15px 30px; border:none; border-radius:5px; cursor:pointer;">
                    ◀️ НАЗАД
                </button>
            </div>
        </div>
    `;
    
    document.body.innerHTML = adminHtml;
}

// ДОБАВЛЕНИЕ ВОПРОСА
window.addQuestion = function() {
    const q = {
        question: document.getElementById('qText').value,
        answers: [
            document.getElementById('a0').value,
            document.getElementById('a1').value,
            document.getElementById('a2').value,
            document.getElementById('a3').value
        ],
        correct: parseInt(document.getElementById('correctSelect').value)
    };
    
    if (!q.question || !q.answers[0] || !q.answers[1] || !q.answers[2] || !q.answers[3]) {
        alert('❌ Заполните все поля!');
        return;
    }
    
    questions.push(q);
    saveQuestions();
    showAdmin();
}

// УДАЛЕНИЕ ВОПРОСА
window.deleteQuestion = function(index) {
    if (confirm('Удалить вопрос?')) {
        questions.splice(index, 1);
        saveQuestions();
        showAdmin();
    }
}

// НАЧАЛО ИГРЫ
window.startGame = function() {
    if (questions.length === 0) {
        alert('❌ Нет вопросов!');
        return;
    }
    
    const gameQuestions = [...questions].sort(() => Math.random() - 0.5);
    let currentIndex = 0;
    let score = 0;
    
    function showQuestion() {
        const q = gameQuestions[currentIndex];
        
        document.body.innerHTML = `
            <div style="padding:20px; background:linear-gradient(135deg, #0B0C1E, #1A1F3A); min-height:100vh; color:white; font-family:Arial;">
                <div style="text-align:center; max-width:800px; margin:0 auto;">
                    <div style="background:#FFD700; color:black; padding:10px; border-radius:5px; margin-bottom:20px;">
                        Вопрос ${currentIndex + 1} из ${gameQuestions.length}
                    </div>
                    
                    <h2 style="color:#FFD700; margin-bottom:30px;">${q.question}</h2>
                    
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px;">
                        ${q.answers.map((answer, i) => `
                            <button onclick="checkAnswer(${i})" style="
                                padding:20px;
                                background:#2A3F7A;
                                color:white;
                                border:2px solid #4A5A9A;
                                border-radius:10px;
                                cursor:pointer;
                                font-size:16px;
                                text-align:left;
                            ">
                                <span style="background:#FFD700; color:black; width:30px; height:30px; display:inline-block; border-radius:50%; text-align:center; line-height:30px; margin-right:10px;">
                                    ${['А','Б','В','Г'][i]}
                                </span>
                                ${answer}
                            </button>
                        `).join('')}
                    </div>
                    
                    <button onclick="showMenu()" style="margin-top:30px; padding:10px 30px; background:#666; color:white; border:none; border-radius:5px; cursor:pointer;">
                        Выйти
                    </button>
                </div>
            </div>
        `;
    }
    
    window.checkAnswer = function(selected) {
        const q = gameQuestions[currentIndex];
        
        if (selected === q.correct) {
            const prizes = [100,200,300,500,1000,2000,4000,8000,16000,32000,64000,125000,250000,500000,1000000];
            score += prizes[currentIndex] || 1000;
            
            if (currentIndex + 1 < gameQuestions.length) {
                currentIndex++;
                showQuestion();
            } else {
                alert(`🎉 ПОБЕДА! Вы выиграли ${score} ₽!`);
                showMenu();
            }
        } else {
            alert(`❌ Неправильно! Игра окончена. Выигрыш: ${score} ₽`);
            showMenu();
        }
    };
    
    showQuestion();
}

// ЗАПУСК
window.onload = loadQuestions;
