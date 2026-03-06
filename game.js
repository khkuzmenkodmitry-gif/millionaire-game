// ==============================================
// МАКСИМАЛЬНО ПРОСТАЯ ВЕРСИЯ
// ==============================================

// НАСТРОЙКИ JSONBIN.IO
const BIN_ID = '69aa7ad5d0ea881f40f44c04';
const MASTER_KEY = '$2a$10$BP88/0Ulf2/XGtkZei0AQuQ6v62DyLwiCUgHXKnzsSJYBkfTSLSUa';

let questions = [];

// 1. ЗАГРУЗКА ВОПРОСОВ
async function loadQuestions() {
    try {
        console.log('Загружаем вопросы...');
        
        const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
            headers: { 'X-Master-Key': MASTER_KEY }
        });
        
        if (!response.ok) throw new Error('Ошибка загрузки');
        
        const data = await response.json();
        questions = data.questions || [];
        
        console.log('Загружено вопросов:', questions.length);
        
        // Показываем меню ПОСЛЕ загрузки
        showMenu();
        
    } catch (error) {
        console.error('Ошибка:', error);
        // Если ошибка - показываем демо-вопросы
        questions = [
            {
                question: 'Столица России?',
                answers: ['Москва', 'Питер', 'Новгород', 'Казань'],
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
            }
        ];
        showMenu();
    }
}

// 2. ПОКАЗ ГЛАВНОГО МЕНЮ
function showMenu() {
    console.log('Показываем меню, вопросов:', questions.length);
    
    // Полностью перерисовываем страницу
    document.body.innerHTML = `
        <div style="
            text-align: center;
            padding: 50px 20px;
            background: linear-gradient(135deg, #0B0C1E, #1A1F3A);
            min-height: 100vh;
            color: white;
            font-family: Arial, sans-serif;
        ">
            <h1 style="color: #FFD700; font-size: 48px; margin-bottom: 20px;">
                💰 КТО ХОЧЕТ СТАТЬ МИЛЛИОНЕРОМ?
            </h1>
            
            <div style="background: rgba(255,215,0,0.1); padding: 20px; border-radius: 10px; margin: 20px auto; max-width: 400px;">
                <p style="font-size: 18px;">📚 Загружено вопросов: <strong style="color: #FFD700;">${questions.length}</strong></p>
            </div>
            
            <div style="margin: 30px 0;">
                <button onclick="startGame()" style="
                    padding: 15px 40px;
                    font-size: 20px;
                    background: #00C851;
                    color: white;
                    border: none;
                    border-radius: 10px;
                    margin: 10px;
                    cursor: pointer;
                    font-weight: bold;
                ">▶️ НАЧАТЬ ИГРУ</button>
                
                <button onclick="showAdmin()" style="
                    padding: 15px 40px;
                    font-size: 20px;
                    background: #33b5e5;
                    color: white;
                    border: none;
                    border-radius: 10px;
                    margin: 10px;
                    cursor: pointer;
                    font-weight: bold;
                ">🔧 АДМИН ПАНЕЛЬ</button>
            </div>
            
            <div style="margin-top: 50px; color: #888; font-size: 14px;">
                ${questions.length > 0 ? '✅ Готов к игре!' : '⚠️ Добавьте вопросы в админке'}
            </div>
        </div>
    `;
}

// 3. АДМИН ПАНЕЛЬ
function showAdmin() {
    const password = prompt('Введите пароль администратора:');
    if (password !== '9999') {
        alert('❌ Неверный пароль!');
        return;
    }
    
    let adminHtml = `
        <div style="
            padding: 30px;
            background: linear-gradient(135deg, #0B0C1E, #1A1F3A);
            min-height: 100vh;
            color: white;
            font-family: Arial, sans-serif;
        ">
            <h2 style="color: #FFD700; text-align: center;">УПРАВЛЕНИЕ ВОПРОСАМИ</h2>
            
            <!-- Форма добавления -->
            <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h3 style="color: #FFD700;">➕ Добавить новый вопрос</h3>
                <input id="qText" placeholder="Введите вопрос" style="width: 100%; padding: 10px; margin: 5px 0; border-radius: 5px; border: none;">
                <input id="a0" placeholder="Ответ А" style="width: 100%; padding: 10px; margin: 5px 0; border-radius: 5px; border: none;">
                <input id="a1" placeholder="Ответ Б" style="width: 100%; padding: 10px; margin: 5px 0; border-radius: 5px; border: none;">
                <input id="a2" placeholder="Ответ В" style="width: 100%; padding: 10px; margin: 5px 0; border-radius: 5px; border: none;">
                <input id="a3" placeholder="Ответ Г" style="width: 100%; padding: 10px; margin: 5px 0; border-radius: 5px; border: none;">
                
                <div style="margin: 10px 0;">
                    <label>Правильный ответ: </label>
                    <select id="correctSelect" style="padding: 10px; border-radius: 5px;">
                        <option value="0">А</option>
                        <option value="1">Б</option>
                        <option value="2">В</option>
                        <option value="3">Г</option>
                    </select>
                </div>
                
                <button onclick="addQuestion()" style="
                    background: #00C851;
                    color: white;
                    padding: 10px 30px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                ">💾 Сохранить вопрос</button>
            </div>
            
            <!-- Список вопросов -->
            <h3 style="color: #FFD700;">📋 Список вопросов (${questions.length})</h3>
            <div id="questionsList" style="max-height: 400px; overflow-y: auto;">
    `;
    
    // Добавляем каждый вопрос в список
    questions.forEach((q, index) => {
        adminHtml += `
            <div style="
                background: rgba(255,255,255,0.05);
                padding: 15px;
                margin: 10px 0;
                border-radius: 5px;
                border-left: 4px solid #FFD700;
            ">
                <p><strong>${index + 1}.</strong> ${q.question}</p>
                <p style="font-size: 14px; color: #aaa;">
                    А: ${q.answers[0]} | 
                    Б: ${q.answers[1]} | 
                    В: ${q.answers[2]} | 
                    Г: ${q.answers[3]}
                </p>
                <p style="color: #00C851;">✅ Правильный: ${['А','Б','В','Г'][q.correct]}</p>
                <button onclick="deleteQuestion(${index})" style="
                    background: #ff4444;
                    color: white;
                    border: none;
                    padding: 5px 15px;
                    border-radius: 3px;
                    cursor: pointer;
                ">🗑️ Удалить</button>
            </div>
        `;
    });
    
    adminHtml += `
            </div>
            
            <div style="margin-top: 20px; text-align: center;">
                <button onclick="saveToCloud()" style="
                    background: #FFD700;
                    color: black;
                    padding: 15px 40px;
                    border: none;
                    border-radius: 5px;
                    margin: 10px;
                    cursor: pointer;
                    font-weight: bold;
                ">💾 СОХРАНИТЬ В ОБЛАКО</button>
                
                <button onclick="showMenu()" style="
                    background: #666;
                    color: white;
                    padding: 15px 40px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                ">◀️ НАЗАД В МЕНЮ</button>
            </div>
        </div>
    `;
    
    document.body.innerHTML = adminHtml;
}

// 4. ДОБАВЛЕНИЕ ВОПРОСА
window.addQuestion = function() {
    const question = {
        question: document.getElementById('qText').value,
        answers: [
            document.getElementById('a0').value,
            document.getElementById('a1').value,
            document.getElementById('a2').value,
            document.getElementById('a3').value
        ],
        correct: parseInt(document.getElementById('correctSelect').value)
    };
    
    // Проверка на пустые поля
    if (!question.question || !question.answers[0] || !question.answers[1] || !question.answers[2] || !question.answers[3]) {
        alert('❌ Заполните все поля!');
        return;
    }
    
    questions.push(question);
    alert('✅ Вопрос добавлен локально! Не забудьте сохранить в облако.');
    showAdmin(); // Обновляем страницу админки
}

// 5. УДАЛЕНИЕ ВОПРОСА
window.deleteQuestion = function(index) {
    if (confirm('Удалить вопрос?')) {
        questions.splice(index, 1);
        showAdmin();
    }
}

// 6. СОХРАНЕНИЕ В ОБЛАКО
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
            alert('✅ Вопросы успешно сохранены в облако!');
        } else {
            alert('❌ Ошибка сохранения в облако');
        }
    } catch (error) {
        alert('❌ Ошибка соединения с облаком');
    }
}

// 7. НАЧАЛО ИГРЫ
window.startGame = function() {
    if (questions.length === 0) {
        alert('❌ Сначала добавьте вопросы в админке!');
        return;
    }
    
    // Перемешиваем вопросы
    const gameQuestions = [...questions].sort(() => Math.random() - 0.5);
    let currentIndex = 0;
    let score = 0;
    
    function showQuestion() {
        const q = gameQuestions[currentIndex];
        
        document.body.innerHTML = `
            <div style="
                padding: 30px;
                background: linear-gradient(135deg, #0B0C1E, #1A1F3A);
                min-height: 100vh;
                color: white;
                font-family: Arial, sans-serif;
            ">
                <div style="text-align: center; max-width: 800px; margin: 0 auto;">
                    <div style="background: rgba(255,215,0,0.1); padding: 10px; border-radius: 5px; margin-bottom: 20px;">
                        Вопрос ${currentIndex + 1} из ${gameQuestions.length}
                    </div>
                    
                    <h2 style="color: #FFD700; margin-bottom: 30px;">${q.question}</h2>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        ${q.answers.map((answer, i) => `
                            <button onclick="answer(${i})" style="
                                padding: 20px;
                                background: #2A3F7A;
                                color: white;
                                border: 2px solid #4A5A9A;
                                border-radius: 10px;
                                cursor: pointer;
                                font-size: 16px;
                                text-align: left;
                                transition: 0.3s;
                            ">
                                <span style="
                                    background: #FFD700;
                                    color: black;
                                    width: 30px;
                                    height: 30px;
                                    display: inline-block;
                                    border-radius: 50%;
                                    text-align: center;
                                    line-height: 30px;
                                    margin-right: 10px;
                                ">${['А','Б','В','Г'][i]}</span>
                                ${answer}
                            </button>
                        `).join('')}
                    </div>
                    
                    <button onclick="showMenu()" style="
                        margin-top: 30px;
                        padding: 10px 30px;
                        background: #666;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                    ">Выйти в меню</button>
                </div>
            </div>
        `;
    }
    
    window.answer = function(selected) {
        const q = gameQuestions[currentIndex];
        
        if (selected === q.correct) {
            // Правильный ответ
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
            alert(`❌ Неправильно! Игра окончена. Вы выиграли ${score} ₽`);
            showMenu();
        }
    };
    
    showQuestion();
}

// 8. ЗАПУСК ПРИ ЗАГРУЗКЕ
window.onload = function() {
    console.log('Страница загружена, начинаем загрузку вопросов...');
    loadQuestions();
};
