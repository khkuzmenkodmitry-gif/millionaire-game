// ==============================================
// КОНФИГУРАЦИЯ JSONBIN.IO - ЗАМЕНИТЕ НА СВОИ ДАННЫЕ!
// ==============================================
const BIN_ID = '69aa7ad5d0ea881f40f44c04'; // Ваш Bin ID (я взял из вашего сообщения)
const API_KEY = '$2a$10$Lrd9qr2zVXIhC0chIlbqi.pLXyeZrKVYEiNBkRIFb1pyweXfKz2cS'; // Ваш API ключ

// Глобальные переменные
let questions = [];
let players = [];
let results = [];
let currentPlayer = null;
let currentQuestions = [];
let currentQuestionIndex = 0;
let currentPrizeIndex = -1;
let gameHistory = [];

// ==============================================
// ЗАГРУЗКА И СОХРАНЕНИЕ ВОПРОСОВ В ОБЛАКО
// ==============================================

// Загрузка вопросов из JSONBin.io
async function loadQuestions() {
    try {
        // Показываем индикатор загрузки
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'loadingIndicator';
        loadingDiv.style.cssText = 'position:fixed; top:10px; right:10px; background:#FFD700; color:black; padding:10px; border-radius:5px; z-index:9999;';
        loadingDiv.textContent = '⏳ Загрузка вопросов...';
        document.body.appendChild(loadingDiv);
        
        const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
            headers: {
                'X-Master-Key': API_KEY,
                'X-Bin-Meta': false
            }
        });
        
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Проверяем структуру данных
        if (data && data.questions && Array.isArray(data.questions)) {
            questions = data.questions;
            console.log('✅ Вопросы загружены из облака:', questions.length);
        } else if (Array.isArray(data)) {
            // Если пришел просто массив
            questions = data;
            console.log('✅ Вопросы загружены из облака (массив):', questions.length);
        } else {
            console.log('⚠️ Неожиданная структура данных, использую демо');
            questions = getDemoQuestions();
        }
        
        // Сохраняем локально как резервную копию
        localStorage.setItem('millionaireQuestions', JSON.stringify(questions));
        
    } catch (error) {
        console.error('❌ Ошибка загрузки из облака:', error);
        
        // Пробуем загрузить из localStorage
        const localQuestions = localStorage.getItem('millionaireQuestions');
        if (localQuestions) {
            questions = JSON.parse(localQuestions);
            alert('⚠️ Не удалось загрузить из облака. Используются локальные вопросы.');
        } else {
            questions = getDemoQuestions();
            alert('⚠️ Не удалось загрузить вопросы. Используются демо-вопросы.');
        }
    } finally {
        // Убираем индикатор загрузки
        const loadingDiv = document.getElementById('loadingIndicator');
        if (loadingDiv) loadingDiv.remove();
    }
}

// Сохранение вопросов в JSONBin.io
async function saveQuestions(showAlert = true) {
    try {
        // Сначала сохраняем локально
        localStorage.setItem('millionaireQuestions', JSON.stringify(questions));
        
        // Сохраняем в облако
        const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': API_KEY
            },
            body: JSON.stringify({ questions: questions })
        });
        
        if (response.ok) {
            console.log('✅ Вопросы сохранены в облако');
            if (showAlert) {
                showNotification('✅ Вопросы сохранены в облако!', 'success');
            }
        } else {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
    } catch (error) {
        console.error('❌ Ошибка сохранения в облако:', error);
        if (showAlert) {
            showNotification('⚠️ Вопросы сохранены локально, но не в облако!', 'error');
        }
    }
}

// Демо-вопросы на случай если ничего нет
function getDemoQuestions() {
    return [
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
        }
    ];
}

// Показать уведомление
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#00C851' : '#ff4444'};
        color: white;
        border-radius: 5px;
        font-weight: bold;
        z-index: 10000;
        animation: slideIn 0.5s;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// ==============================================
// УПРАВЛЕНИЕ ЭКРАНАМИ
// ==============================================

function showScreen(screenName) {
    // Скрываем все экраны
    document.getElementById('mainScreen').classList.add('hidden');
    document.getElementById('gameScreen').classList.add('hidden');
    document.getElementById('adminPanel').classList.add('hidden');
    document.getElementById('gameResultScreen').classList.add('hidden');
    
    // Показываем главное меню
    document.getElementById('mainMenu').classList.remove('hidden');
    document.getElementById('playerLoginScreen').classList.add('hidden');
    document.getElementById('registerScreen').classList.add('hidden');
    document.getElementById('playerSelectScreen').classList.add('hidden');
    document.getElementById('adminLoginScreen').classList.add('hidden');
    
    if (screenName === 'main') {
        document.getElementById('mainMenu').classList.remove('hidden');
    } else if (screenName === 'playerLogin') {
        document.getElementById('mainMenu').classList.add('hidden');
        document.getElementById('playerLoginScreen').classList.remove('hidden');
    } else if (screenName === 'playerRegister') {
        document.getElementById('playerLoginScreen').classList.add('hidden');
        document.getElementById('registerScreen').classList.remove('hidden');
    } else if (screenName === 'gamePreparation') {
        if (players.length === 0) {
            alert('Сначала зарегистрируйте игрока!');
            showScreen('playerRegister');
            return;
        }
        document.getElementById('mainMenu').classList.add('hidden');
        document.getElementById('playerSelectScreen').classList.remove('hidden');
        updatePlayerSelect();
    } else if (screenName === 'adminLogin') {
        document.getElementById('mainMenu').classList.add('hidden');
        document.getElementById('adminLoginScreen').classList.remove('hidden');
    }
}

// Обновление списка игроков для выбора
function updatePlayerSelect() {
    const select = document.getElementById('playerSelect');
    if (!select) return;
    
    select.innerHTML = '<option value="">-- Выберите игрока --</option>';
    players.forEach(player => {
        select.innerHTML += `<option value="${player.id}">${player.name} (Лучший: ${player.bestResult} ₽)</option>`;
    });
}

// ==============================================
// РЕГИСТРАЦИЯ И ВХОД
// ==============================================

// Регистрация игрока
function registerPlayer() {
    const login = document.getElementById('regLogin')?.value.trim();
    const password = document.getElementById('regPassword')?.value;
    const name = document.getElementById('regName')?.value.trim();
    
    if (!login || !password || !name) {
        document.getElementById('registerError').textContent = 'Заполните все поля!';
        return;
    }
    
    if (players.find(p => p.login === login)) {
        document.getElementById('registerError').textContent = 'Логин уже занят!';
        return;
    }
    
    const newPlayer = {
        id: Date.now(),
        login: login,
        password: password,
        name: name,
        gamesPlayed: 0,
        bestResult: 0
    };
    
    players.push(newPlayer);
    localStorage.setItem('millionairePlayers', JSON.stringify(players));
    
    alert('Регистрация успешна!');
    showScreen('playerLogin');
    
    // Очищаем форму
    document.getElementById('regLogin').value = '';
    document.getElementById('regPassword').value = '';
    document.getElementById('regName').value = '';
    document.getElementById('registerError').textContent = '';
}

// Вход игрока
function loginPlayer() {
    const login = document.getElementById('loginUsername')?.value;
    const password = document.getElementById('loginPassword')?.value;
    
    const player = players.find(p => p.login === login && p.password === password);
    
    if (player) {
        currentPlayer = player;
        document.getElementById('loginError').textContent = '';
        startGame();
    } else {
        document.getElementById('loginError').textContent = 'Неверный логин или пароль!';
    }
}

// Выбор игрока из списка
function selectPlayer() {
    const select = document.getElementById('playerSelect');
    if (!select) return;
    
    const playerId = parseInt(select.value);
    
    if (!playerId) {
        alert('Выберите игрока!');
        return;
    }
    
    currentPlayer = players.find(p => p.id === playerId);
    startGame();
}

// ==============================================
// АДМИН ПАНЕЛЬ
// ==============================================

// Проверка пароля админа
function checkAdminPassword() {
    const password = document.getElementById('adminPassword')?.value;
    
    if (password === '9999') {
        document.getElementById('adminError').textContent = '';
        document.getElementById('mainScreen').classList.add('hidden');
        document.getElementById('adminPanel').classList.remove('hidden');
        
        // Загружаем свежие вопросы при входе в админку
        loadQuestions().then(() => {
            updateQuestionsList();
            updateResultsList();
            updatePlayersList();
        });
    } else {
        document.getElementById('adminError').textContent = 'Неверный пароль!';
    }
}

// Переключение вкладок в админке
function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    if (event && event.target) {
        event.target.classList.add('active');
    }
    document.getElementById(tab + 'Tab').classList.add('active');
    
    if (tab === 'results') updateResultsList();
    if (tab === 'players') updatePlayersList();
}

// Обновление списка вопросов
function updateQuestionsList() {
    const list = document.getElementById('questionsList');
    if (!list) return;
    
    if (questions.length === 0) {
        list.innerHTML = '<p>📭 Вопросов пока нет. Добавьте первый вопрос!</p>';
        return;
    }
    
    let html = '';
    questions.forEach((q, index) => {
        const answers = q.answers.map((a, i) => {
            const letter = ['А', 'Б', 'В', 'Г'][i];
            return `${letter}: ${a}${i === q.correct ? ' ✓' : ''}`;
        }).join('<br>');
        
        html += `
            <div class="question-item" style="margin-bottom: 15px; padding: 15px; background: rgba(255,255,255,0.1); border-radius: 5px;">
                <div style="margin-bottom: 10px;">
                    <strong>Вопрос ${index + 1}:</strong> ${q.question}
                </div>
                <div style="font-size: 14px; color: #aaa; margin-bottom: 10px;">
                    ${answers}
                </div>
                <div>
                    <button onclick="deleteQuestion(${index})" style="background: #ff4444; padding: 5px 15px; margin-right: 5px;">🗑️ Удалить</button>
                    <button onclick="testQuestion(${index})" style="background: #33b5e5; padding: 5px 15px;">👁️ Тест</button>
                </div>
            </div>
        `;
    });
    list.innerHTML = html;
}

// Тест вопроса (показать правильный ответ)
function testQuestion(index) {
    const q = questions[index];
    const answers = q.answers.map((a, i) => `${['А', 'Б', 'В', 'Г'][i]}: ${a}`).join('\n');
    alert(`Правильный ответ: ${['А', 'Б', 'В', 'Г'][q.correct]}\n\n${answers}`);
}

// Удаление вопроса
async function deleteQuestion(index) {
    if (confirm('Удалить вопрос?')) {
        questions.splice(index, 1);
        await saveQuestions(true);
        updateQuestionsList();
    }
}

// Сохранение вопроса из формы
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('questionForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const questionText = document.getElementById('questionInput')?.value;
            const answerA = document.getElementById('answerA')?.value;
            const answerB = document.getElementById('answerB')?.value;
            const answerC = document.getElementById('answerC')?.value;
            const answerD = document.getElementById('answerD')?.value;
            
            // Получаем выбранный правильный ответ
            const correctRadio = document.querySelector('input[name="correctAnswer"]:checked');
            if (!correctRadio) {
                alert('Выберите правильный ответ!');
                return;
            }
            const correct = parseInt(correctRadio.value);
            
            if (!questionText || !answerA || !answerB || !answerC || !answerD) {
                alert('Заполните все поля!');
                return;
            }
            
            const newQuestion = {
                question: questionText,
                answers: [answerA, answerB, answerC, answerD],
                correct: correct
            };
            
            questions.push(newQuestion);
            await saveQuestions(true);
            
            // Очищаем форму
            form.reset();
            // Сбрасываем радио на первый ответ
            document.querySelector('input[name="correctAnswer"][value="0"]').checked = true;
            
            updateQuestionsList();
            alert('✅ Вопрос успешно добавлен в облако!');
        });
    }
});

// Обновление списка результатов
function updateResultsList() {
    const container = document.getElementById('resultsContainer');
    if (!container) return;
    
    const searchText = document.getElementById('searchResults')?.value?.toLowerCase() || '';
    
    let filteredResults = [...results].reverse();
    if (searchText) {
        filteredResults = filteredResults.filter(r => 
            r.playerName?.toLowerCase().includes(searchText)
        );
    }
    
    if (filteredResults.length === 0) {
        container.innerHTML = '<p>📊 Нет результатов</p>';
        return;
    }
    
    let html = '<table class="results-table">';
    html += '<tr><th>Игрок</th><th>Дата</th><th>Результат</th><th>Правильных ответов</th></tr>';
    
    filteredResults.forEach(result => {
        html += `
            <tr>
                <td>${result.playerName || 'Гость'}</td>
                <td>${new Date(result.date).toLocaleString()}</td>
                <td style="color: #FFD700;">${result.winAmount || '0 ₽'}</td>
                <td>${result.correctAnswers || 0}/${result.totalQuestions || '?'}</td>
            </tr>
        `;
    });
    
    html += '</table>';
    container.innerHTML = html;
}

// Поиск по результатам
if (document.getElementById('searchResults')) {
    document.getElementById('searchResults').addEventListener('input', updateResultsList);
}

// Обновление списка игроков
function updatePlayersList() {
    const list = document.getElementById('playersList');
    if (!list) return;
    
    if (players.length === 0) {
        list.innerHTML = '<p>👤 Нет зарегистрированных игроков</p>';
        return;
    }
    
    let html = '';
    players.forEach(player => {
        html += `
            <div class="player-card" style="margin-bottom: 10px; padding: 15px; background: rgba(255,255,255,0.1); border-radius: 5px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong style="color: #FFD700;">${player.name}</strong><br>
                        Логин: ${player.login}<br>
                        Игр: ${player.gamesPlayed || 0}<br>
                        Лучший: ${player.bestResult || 0} ₽
                    </div>
                    <div>
                        <button onclick="resetPlayerStats(${player.id})" style="background: #ffbb33; padding: 5px 10px; margin-right: 5px;">🔄 Сброс</button>
                        <button onclick="deletePlayer(${player.id})" style="background: #ff4444; padding: 5px 10px;">🗑️ Удалить</button>
                    </div>
                </div>
            </div>
        `;
    });
    list.innerHTML = html;
}

// Сброс статистики игрока
function resetPlayerStats(playerId) {
    const player = players.find(p => p.id === playerId);
    if (player) {
        player.gamesPlayed = 0;
        player.bestResult = 0;
        localStorage.setItem('millionairePlayers', JSON.stringify(players));
        updatePlayersList();
    }
}

// Удаление игрока
function deletePlayer(playerId) {
    if (confirm('Удалить игрока?')) {
        players = players.filter(p => p.id !== playerId);
        results = results.filter(r => r.playerId !== playerId);
        localStorage.setItem('millionairePlayers', JSON.stringify(players));
        localStorage.setItem('millionaireResults', JSON.stringify(results));
        updatePlayersList();
        updateResultsList();
    }
}

// ==============================================
// ИГРОВАЯ ЛОГИКА
// ==============================================

// Генерация призовой лестницы
function generatePrizeLadder(numQuestions) {
    const basePrizes = [100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000, 250000, 500000, 1000000];
    const prizes = [];
    
    for (let i = 0; i < numQuestions; i++) {
        if (i < basePrizes.length) {
            prizes.push(basePrizes[i] + ' ₽');
        } else {
            const extraPrize = 1000000 * Math.pow(1.2, i - 14);
            prizes.push(Math.round(extraPrize / 1000) * 1000 + ' ₽');
        }
    }
    
    return prizes;
}

// Начало игры
async function startGame() {
    // Убеждаемся, что вопросы загружены
    if (questions.length === 0) {
        await loadQuestions();
    }
    
    if (questions.length === 0) {
        alert('Добавьте хотя бы один вопрос в админ-панели!');
        showScreen('main');
        return;
    }
    
    // Перемешиваем вопросы
    currentQuestions = shuffleArray([...questions]);
    currentQuestionIndex = 0;
    currentPrizeIndex = -1;
    gameHistory = [];
    
    // Обновляем счетчики
    const totalSpan = document.getElementById('totalQuestionsNum');
    if (totalSpan) totalSpan.textContent = currentQuestions.length;
    
    document.getElementById('mainScreen').classList.add('hidden');
    document.getElementById('gameScreen').classList.remove('hidden');
    
    if (currentPlayer) {
        const nameSpan = document.getElementById('currentPlayerName');
        const gamesSpan = document.getElementById('playerGames');
        const bestSpan = document.getElementById('playerBest');
        
        if (nameSpan) nameSpan.textContent = currentPlayer.name;
        if (gamesSpan) gamesSpan.textContent = currentPlayer.gamesPlayed;
        if (bestSpan) bestSpan.textContent = currentPlayer.bestResult;
    }
    
    updatePrizeLadder();
    showQuestion();
}

// Перемешивание массива
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Показать вопрос
function showQuestion() {
    if (!currentQuestions || currentQuestions.length === 0) return;
    
    const question = currentQuestions[currentQuestionIndex];
    
    // Обновляем номера вопросов
    const currentSpan = document.getElementById('currentQuestionNum');
    const totalSpan = document.getElementById('totalQuestionsNum');
    
    if (currentSpan) currentSpan.textContent = currentQuestionIndex + 1;
    if (totalSpan) totalSpan.textContent = currentQuestions.length;
    
    const questionText = document.getElementById('questionText');
    if (questionText) questionText.textContent = question.question;
    
    const container = document.getElementById('answersContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    const letters = ['А', 'Б', 'В', 'Г'];
    
    question.answers.forEach((answer, index) => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.innerHTML = `<span class="answer-letter">${letters[index]}</span> ${answer}`;
        btn.onclick = () => checkAnswer(index);
        container.appendChild(btn);
    });
}

// Проверка ответа
function checkAnswer(selectedIndex) {
    const question = currentQuestions[currentQuestionIndex];
    const buttons = document.querySelectorAll('.answer-btn');
    
    gameHistory.push({
        question: question.question,
        selected: selectedIndex,
        correct: question.correct,
        isCorrect: selectedIndex === question.correct
    });
    
    buttons.forEach(btn => btn.disabled = true);
    
    buttons.forEach((btn, index) => {
        if (index === question.correct) {
            btn.classList.add('correct');
        } else if (index === selectedIndex && index !== question.correct) {
            btn.classList.add('wrong');
        }
    });
    
    if (selectedIndex === question.correct) {
        currentPrizeIndex++;
        updatePrizeLadder();
        
        setTimeout(() => {
            if (currentQuestionIndex === currentQuestions.length - 1) {
                gameOver(true);
            } else {
                currentQuestionIndex++;
                showQuestion();
            }
        }, 1500);
    } else {
        setTimeout(() => gameOver(false), 1500);
    }
}

// Завершение игры
function gameOver(isWin) {
    let winAmount = '0 ₽';
    let winValue = 0;
    const correctAnswers = gameHistory.filter(h => h.isCorrect).length;
    const totalQuestions = currentQuestions.length;
    
    if (isWin) {
        const prizes = generatePrizeLadder(totalQuestions);
        winAmount = prizes[prizes.length - 1];
        winValue = parseInt(winAmount.replace(/[^0-9]/g, ''));
    } else if (currentPrizeIndex >= 0) {
        const prizes = generatePrizeLadder(totalQuestions);
        winAmount = prizes[currentPrizeIndex];
        winValue = parseInt(winAmount.replace(/[^0-9]/g, ''));
    }
    
    // Сохраняем результат
    results.push({
        id: Date.now(),
        playerId: currentPlayer?.id || 0,
        playerName: currentPlayer?.name || 'Гость',
        date: new Date().toISOString(),
        winAmount: winAmount,
        winValue: winValue,
        correctAnswers: correctAnswers,
        totalQuestions: totalQuestions
    });
    localStorage.setItem('millionaireResults', JSON.stringify(results));
    
    if (currentPlayer) {
        currentPlayer.gamesPlayed = (currentPlayer.gamesPlayed || 0) + 1;
        if (winValue > (currentPlayer.bestResult || 0)) {
            currentPlayer.bestResult = winValue;
        }
        localStorage.setItem('millionairePlayers', JSON.stringify(players));
    }
    
    // Показываем результат
    document.getElementById('gameScreen').classList.add('hidden');
    document.getElementById('gameResultScreen').classList.remove('hidden');
    
    const winSpan = document.getElementById('finalWinAmount');
    const statsSpan = document.getElementById('finalStats');
    
    if (winSpan) winSpan.textContent = winAmount;
    if (statsSpan) statsSpan.textContent = `Правильных ответов: ${correctAnswers} из ${totalQuestions}`;
}

// Обновление призовой лестницы
function updatePrizeLadder() {
    if (!currentQuestions || currentQuestions.length === 0) return;
    
    const prizes = generatePrizeLadder(currentQuestions.length);
    const ladder = document.getElementById('prizeLadder');
    if (!ladder) return;
    
    ladder.innerHTML = '<h3>💰 Призы:</h3>';
    
    for (let i = prizes.length - 1; i >= 0; i--) {
        const item = document.createElement('div');
        item.className = 'prize-item';
        
        if (i === currentPrizeIndex + 1) {
            item.classList.add('current');
        } else if (i <= currentPrizeIndex) {
            item.classList.add('reached');
        }
        
        item.textContent = prizes[i];
        ladder.appendChild(item);
    }
}

// Возврат в меню
function backToMenu() {
    currentPlayer = null;
    document.getElementById('mainScreen').classList.remove('hidden');
    document.getElementById('gameScreen').classList.add('hidden');
    document.getElementById('adminPanel').classList.add('hidden');
    document.getElementById('gameResultScreen').classList.add('hidden');
    showScreen('main');
}

// ==============================================
// ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ
// ==============================================

window.onload = async function() {
    console.log('🚀 Игра загружается...');
    
    // Добавляем стили для анимаций
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Загружаем вопросы из облака
    await loadQuestions();
    
    // Загружаем игроков и результаты из localStorage
    const savedPlayers = localStorage.getItem('millionairePlayers');
    const savedResults = localStorage.getItem('millionaireResults');
    
    players = savedPlayers ? JSON.parse(savedPlayers) : [];
    results = savedResults ? JSON.parse(savedResults) : [];
    
    console.log('📊 Игроков:', players.length);
    console.log('📈 Результатов:', results.length);
    
    showScreen('main');
};
