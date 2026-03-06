// ==============================================
// ДИАГНОСТИЧЕСКАЯ ВЕРСИЯ
// ==============================================

const BIN_ID = '69aa7ad5d0ea881f40f44c04';
const MASTER_KEY = '$2a$10$BP88/0Ulf2/XGtkZei0AQuQ6v62DyLwiCUgHXKnzsSJYBkfTSLSUa';

let questions = [];

// ЗАГРУЗКА С ДИАГНОСТИКОЙ
async function loadQuestions() {
    try {
        console.log('1. Начинаем загрузку...');
        console.log('2. BIN_ID:', BIN_ID);
        console.log('3. MASTER_KEY (первые 10 символов):', MASTER_KEY.substring(0, 10) + '...');
        
        // Показываем сообщение о загрузке
        document.body.innerHTML = `
            <div style="text-align:center; padding:50px; background:#0B0C1E; color:white; font-family:Arial;">
                <h2 style="color:#FFD700;">⏳ Загрузка вопросов...</h2>
                <p>Проверяем соединение с JSONBin.io...</p>
                <p style="color:#aaa; font-size:12px;">BIN: ${BIN_ID}</p>
            </div>
        `;
        
        const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
            headers: { 'X-Master-Key': MASTER_KEY }
        });
        
        console.log('4. Статус ответа:', response.status);
        console.log('5. Статус текстом:', response.statusText);
        
        if (!response.ok) {
            throw new Error(`HTTP ошибка: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('6. Получены данные:', data);
        
        // Проверяем структуру данных
        if (data && data.questions && Array.isArray(data.questions)) {
            questions = data.questions;
            console.log('7. Найдены вопросы в data.questions:', questions.length);
        } else if (Array.isArray(data)) {
            questions = data;
            console.log('7. Найден массив вопросов:', questions.length);
        } else {
            console.log('7. Непонятная структура данных:', data);
            questions = [];
        }
        
        console.log('8. Итоговое количество вопросов:', questions.length);
        
        // Показываем результат
        if (questions.length > 0) {
            showMenu();
        } else {
            // Если вопросов нет, показываем сообщение
            document.body.innerHTML = `
                <div style="text-align:center; padding:50px; background:#0B0C1E; color:white; font-family:Arial;">
                    <h2 style="color:#FFD700;">⚠️ Нет вопросов</h2>
                    <p>В вашем JSONBin.io бине нет вопросов.</p>
                    <p>Зайдите в <a href="https://jsonbin.io/app/dashboard" target="_blank" style="color:#FFD700;">JSONBin.io</a> и добавьте вопросы в формате:</p>
                    <pre style="background:#333; padding:20px; text-align:left; margin:20px;">
{
  "questions": [
    {
      "question": "Столица России?",
      "answers": ["Москва", "Питер", "Новгород", "Казань"],
      "correct": 0
    }
  ]
}
                    </pre>
                    <button onclick="useDemoQuestions()" style="padding:15px 30px; background:#00C851; color:white; border:none; border-radius:5px; margin:10px; cursor:pointer;">
                        🔧 Использовать демо-вопросы
                    </button>
                    <button onclick="location.reload()" style="padding:15px 30px; background:#33b5e5; color:white; border:none; border-radius:5px; cursor:pointer;">
                        🔄 Попробовать снова
                    </button>
                </div>
            `;
        }
        
    } catch (error) {
        console.error('❌ Ошибка:', error);
        
        document.body.innerHTML = `
            <div style="text-align:center; padding:50px; background:#0B0C1E; color:white; font-family:Arial;">
                <h2 style="color:#ff4444;">❌ Ошибка загрузки</h2>
                <p style="color:#ff8888;">${error.message}</p>
                <p>Проверьте:</p>
                <ul style="list-style:none; padding:0;">
                    <li>✓ Правильный ли BIN_ID?</li>
                    <li>✓ Правильный ли MASTER_KEY?</li>
                    <li>✓ Есть ли интернет?</li>
                </ul>
                <button onclick="useDemoQuestions()" style="padding:15px 30px; background:#00C851; color:white; border:none; border-radius:5px; margin:10px; cursor:pointer;">
                    🔧 Использовать демо-вопросы
                </button>
                <button onclick="location.reload()" style="padding:15px 30px; background:#33b5e5; color:white; border:none; border-radius:5px; cursor:pointer;">
                    🔄 Попробовать снова
                </button>
            </div>
        `;
    }
}

// Использовать демо-вопросы
window.useDemoQuestions = function() {
    questions = [
        {
            question: 'Столица России?',
            answers: ['Москва', 'Санкт-Петербург', 'Новосибирск', 'Казань'],
            correct: 0
        },
        {
            question: 'Сколько планет в Солнечной системе?',
            answers: ['7', '8', '9', '10'],
            correct: 1
        },
        {
            question: 'Какой язык программирования используется для веб-страниц?',
            answers: ['Python', 'Java', 'JavaScript', 'C++'],
            correct: 2
        },
        {
            question: 'Кто написал "Войну и мир"?',
            answers: ['Достоевский', 'Толстой', 'Чехов', 'Пушкин'],
            correct: 1
        },
        {
            question: 'Какая самая высокая гора в мире?',
            answers: ['К2', 'Эверест', 'Канченджанга', 'Лхоцзе'],
            correct: 1
        }
    ];
    alert(`✅ Загружено ${questions.length} демо-вопросов!`);
    showMenu();
}

// ПОКАЗ МЕНЮ
function showMenu() {
    document.body.innerHTML = `
        <div style="text-align:center; padding:50px; background:linear-gradient(135deg, #0B0C1E, #1A1F3A); min-height:100vh; color:white; font-family:Arial;">
            <h1 style="color:#FFD700; font-size:48px; margin-bottom:20px;">💰 КТО ХОЧЕТ СТАТЬ МИЛЛИОНЕРОМ?</h1>
            
            <div style="background:rgba(255,215,0,0.1); padding:20px; border-radius:10px; margin:20px auto; max-width:400px;">
                <p style="font-size:18px;">📚 Загружено вопросов: <strong style="color:#FFD700; font-size:24px;">${questions.length}</strong></p>
            </div>
            
            <div style="margin:30px 0;">
                <button onclick="startGame()" style="padding:15px 40px; font-size:20px; background:#00C851; color:white; border:none; border-radius:10px; margin:10px; cursor:pointer; font-weight:bold;">
                    ▶️ НАЧАТЬ ИГРУ (${questions.length} вопросов)
                </button>
                
                <button onclick="showAdmin()" style="padding:15px 40px; font-size:20px; background:#33b5e5; color:white; border:none; border-radius:10px; margin:10px; cursor:pointer; font-weight:bold;">
                    🔧 АДМИН ПАНЕЛЬ
                </button>
            </div>
            
            ${questions.length === 0 ? `
                <div style="background:#ff4444; padding:15px; border-radius:5px; max-width:400px; margin:20px auto;">
                    ⚠️ Нет вопросов! Зайдите в админ-панель и добавьте вопросы.
                </div>
            ` : ''}
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
            
            <h3 style="color:#FFD700;">📋 ВСЕ ВОПРОСЫ (${questions.length})</h3>
            <div id="questionsList" style="max-height:400px; overflow-y:auto;">
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
                <button onclick="saveToCloud()" style="background:#FFD700; color:black; padding:15px 30px; border:none; border-radius:5px; margin:5px; cursor:pointer; font-weight:bold;">
                    💾 СОХРАНИТЬ В ОБЛАКО
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
    alert('✅ Вопрос добавлен!');
    showAdmin();
}

// УДАЛЕНИЕ ВОПРОСА
window.deleteQuestion = function(index) {
    if (confirm('Удалить вопрос?')) {
        questions.splice(index, 1);
        showAdmin();
    }
}

// СОХРАНЕНИЕ В ОБЛАКО
window.saveToCloud = async function() {
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': MASTER_KEY
            },
            body: JSON.stringify({ questions: questions })
        });
        
        if (response.ok) {
            alert('✅ Вопросы сохранены в облако!');
        } else {
            alert('❌ Ошибка сохранения');
        }
    } catch (error) {
        alert('❌ Ошибка соединения');
    }
}

// НАЧАЛО ИГРЫ
window.startGame = function() {
    if (questions.length === 0) {
        alert('❌ Нет вопросов! Сначала добавьте вопросы в админке.');
        return;
    }
    
    // Перемешиваем вопросы
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
