// Данные
let questions = [];
let players = [];
let results = [];

// Текущее состояние
let currentPlayer = null;
let currentQuestions = [];
let currentQuestionIndex = 0;
let currentPrizeIndex = -1;
let gameHistory = [];

// Призовая лестница
const prizeLadder = [
    '100 ₽', '200 ₽', '300 ₽', '500 ₽', '1 000 ₽',
    '2 000 ₽', '4 000 ₽', '8 000 ₽', '16 000 ₽', '32 000 ₽',
    '64 000 ₽', '125 000 ₽', '250 000 ₽', '500 000 ₽', '1 000 000 ₽'
];

// Загрузка данных при старте
function loadData() {
    const savedQuestions = localStorage.getItem('millionaireQuestions');
    const savedPlayers = localStorage.getItem('millionairePlayers');
    const savedResults = localStorage.getItem('millionaireResults');
    
    questions = savedQuestions ? JSON.parse(savedQuestions) : [];
    players = savedPlayers ? JSON.parse(savedPlayers) : [];
    results = savedResults ? JSON.parse(savedResults) : [];
    
    // Добавляем демо-вопросы если нет ни одного
    if (questions.length === 0) {
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
            }
        ];
        saveQuestions();
    }
}

// Сохранение данных
function saveQuestions() {
    localStorage.setItem('millionaireQuestions', JSON.stringify(questions));
}

function savePlayers() {
    localStorage.setItem('millionairePlayers', JSON.stringify(players));
}

function saveResults() {
    localStorage.setItem('millionaireResults', JSON.stringify(results));
}

// Управление экранами
function showScreen(screenName) {
    // Скрываем все экраны
    document.getElementById('mainScreen').classList.remove('hidden');
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
    select.innerHTML = '<option value="">-- Выберите игрока --</option>';
    players.forEach(player => {
        select.innerHTML += `<option value="${player.id}">${player.name} (Лучший: ${player.bestResult} ₽)</option>`;
    });
}

// Регистрация игрока
function registerPlayer() {
    const login = document.getElementById('regLogin').value.trim();
    const password = document.getElementById('regPassword').value;
    const name = document.getElementById('regName').value.trim();
    
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
    savePlayers();
    
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
    const login = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
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
    const playerId = parseInt(select.value);
    
    if (!playerId) {
        alert('Выберите игрока!');
        return;
    }
    
    currentPlayer = players.find(p => p.id === playerId);
    startGame();
}

// Проверка пароля админа
function checkAdminPassword() {
    const password = document.getElementById('adminPassword').value;
    
    if (password === '9999') {
        document.getElementById('adminError').textContent = '';
        document.getElementById('mainScreen').classList.add('hidden');
        document.getElementById('adminPanel').classList.remove('hidden');
        updateQuestionsList();
        updateResultsList();
        updatePlayersList();
    } else {
        document.getElementById('adminError').textContent = 'Неверный пароль!';
    }
}

// Переключение вкладок в админке
function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tab + 'Tab').classList.add('active');
}

// Обновление списка вопросов в админке
function updateQuestionsList() {
    const list = document.getElementById('questionsList');
    list.innerHTML = '';
    
    questions.forEach((q, index) => {
        const div = document.createElement('div');
        div.className = 'question-item';
        div.innerHTML = `
            <div>
                <strong>Вопрос ${index + 1}:</strong> ${q.question}
            </div>
            <button class="delete-btn" onclick="deleteQuestion(${index})">Удалить</button>
        `;
        list.appendChild(div);
    });
}

// Удаление вопроса
function deleteQuestion(index) {
    if (confirm('Удалить вопрос?')) {
        questions.splice(index, 1);
        saveQuestions();
        updateQuestionsList();
    }
}

// Обновление списка результатов
function updateResultsList() {
    const container = document.getElementById('resultsContainer');
    const searchText = document.getElementById('searchResults')?.value.toLowerCase() || '';
    
    let filteredResults = [...results].reverse();
    if (searchText) {
        filteredResults = filteredResults.filter(r => 
            r.playerName.toLowerCase().includes(searchText)
        );
    }
    
    if (filteredResults.length === 0) {
        container.innerHTML = '<p>Нет результатов</p>';
        return;
    }
    
    let html = '<table class="results-table">';
    html += '<tr><th>Игрок</th><th>Дата</th><th>Результат</th><th>Правильных ответов</th></tr>';
    
    filteredResults.forEach(result => {
        html += `
            <tr>
                <td>${result.playerName}</td>
                <td>${new Date(result.date).toLocaleString()}</td>
                <td style="color: #FFD700;">${result.winAmount}</td>
                <td>${result.correctAnswers}/15</td>
            </tr>
        `;
    });
    
    html += '</table>';
    container.innerHTML = html;
}

// Поиск по результатам
document.getElementById('searchResults')?.addEventListener('input', updateResultsList);

// Обновление списка игроков
function updatePlayersList() {
    const list = document.getElementById('playersList');
    list.innerHTML = '';
    
    players.forEach(player => {
        const div = document.createElement('div');
        div.className = 'player-card';
        div.innerHTML = `
            <div>
                <strong>${player.name}</strong><br>
                Логин: ${player.login}<br>
                Игр: ${player.gamesPlayed}<br>
                Лучший: ${player.bestResult} ₽
            </div>
            <div class="player-actions">
                <button onclick="resetPlayerStats(${player.id})" style="background: #ffbb33;">Сброс</button>
                <button onclick="deletePlayer(${player.id})" style="background: #ff4444;">Удалить</button>
            </div>
        `;
        list.appendChild(div);
    });
}

// Сброс статистики игрока
function resetPlayerStats(playerId) {
    const player = players.find(p => p.id === playerId);
    if (player) {
        player.gamesPlayed = 0;
        player.bestResult = 0;
        savePlayers();
        updatePlayersList();
    }
}

// Удаление игрока
function deletePlayer(playerId) {
    if (confirm('Удалить игрока?')) {
        players = players.filter(p => p.id !== playerId);
        results = results.filter(r => r.playerId !== playerId);
        savePlayers();
        saveResults();
        updatePlayersList();
        updateResultsList();
    }
}

// Сохранение вопроса
document.getElementById('questionForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const question = document.getElementById('questionInput').value;
    const answerA = document.getElementById('answerA').value;
    const answerB = document.getElementById('answerB').value;
    const answerC = document.getElementById('answerC').value;
    const answerD = document.getElementById('answerD').value;
    const correct = document.querySelector('input[name="correctAnswer"]:checked').value;
    
    questions.push({
        question: question,
        answers: [answerA, answerB, answerC, answerD],
        correct: parseInt(correct)
    });
    
    saveQuestions();
    updateQuestionsList();
    
    // Очищаем форму
    this.reset();
    alert('Вопрос добавлен!');
});

// Начало игры
function startGame() {
    if (questions.length < 15) {
        alert('Нужно минимум 15 вопросов! Сейчас: ' + questions.length);
        showScreen('main');
        return;
    }
    
    // Перемешиваем и берем 15 вопросов
    currentQuestions = shuffleArray([...questions]).slice(0, 15);
    currentQuestionIndex = 0;
    currentPrizeIndex = -1;
    gameHistory = [];
    
    document.getElementById('mainScreen').classList.add('hidden');
    document.getElementById('gameScreen').classList.remove('hidden');
    
    document.getElementById('currentPlayerName').textContent = currentPlayer.name;
    document.getElementById('playerGames').textContent = currentPlayer.gamesPlayed;
    document.getElementById('playerBest').textContent = currentPlayer.bestResult;
    
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
    const question = currentQuestions[currentQuestionIndex];
    document.getElementById('questionNumber').textContent = `Вопрос ${currentQuestionIndex + 1} из 15`;
    document.getElementById('questionText').textContent = question.question;
    
    const container = document.getElementById('answersContainer');
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
    
    // Записываем в историю
    gameHistory.push({
        question: question.question,
        selected: selectedIndex,
        correct: question.correct,
        isCorrect: selectedIndex === question.correct
    });
    
    // Блокируем кнопки
    buttons.forEach(btn => btn.disabled = true);
    
    // Подсвечиваем ответы
    buttons.forEach((btn, index) => {
        if (index === question.correct) {
            btn.classList.add('correct');
        } else if (index === selectedIndex && index !== question.correct) {
            btn.classList.add('wrong');
        }
    });
    
    // Проверяем правильность
    if (selectedIndex === question.correct) {
        currentPrizeIndex++;
        updatePrizeLadder();
        
        setTimeout(() => {
            if (currentQuestionIndex === 14) {
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
    
    if (isWin) {
        winAmount = '1 000 000 ₽';
        winValue = 1000000;
    } else if (currentPrizeIndex >= 0) {
        if (currentPrizeIndex >= 9) {
            winAmount = '32 000 ₽';
            winValue = 32000;
        } else if (currentPrizeIndex >= 4) {
            winAmount = '1 000 ₽';
            winValue = 1000;
        } else if (currentPrizeIndex >= 0) {
            winAmount = '100 ₽';
            winValue = 100;
        }
    }
    
    // Сохраняем результат
    results.push({
        id: Date.now(),
        playerId: currentPlayer.id,
        playerName: currentPlayer.name,
        date: new Date().toISOString(),
        winAmount: winAmount,
        winValue: winValue,
        correctAnswers: correctAnswers
    });
    saveResults();
    
    // Обновляем статистику игрока
    currentPlayer.gamesPlayed++;
    if (winValue > currentPlayer.bestResult) {
        currentPlayer.bestResult = winValue;
    }
    savePlayers();
    
    // Показываем результат
    document.getElementById('gameScreen').classList.add('hidden');
    document.getElementById('gameResultScreen').classList.remove('hidden');
    document.getElementById('finalWinAmount').textContent = winAmount;
    document.getElementById('finalStats').textContent = `Правильных ответов: ${correctAnswers} из 15`;
}

// Обновление призовой лестницы
function updatePrizeLadder() {
    const ladder = document.getElementById('prizeLadder');
    ladder.innerHTML = '<h3>Призы:</h3>';
    
    for (let i = prizeLadder.length - 1; i >= 0; i--) {
        const item = document.createElement('div');
        item.className = 'prize-item';
        
        if (i === currentPrizeIndex + 1) {
            item.classList.add('current');
        } else if (i <= currentPrizeIndex) {
            item.classList.add('reached');
        }
        
        item.textContent = prizeLadder[i];
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

// Инициализация при загрузке
window.onload = function() {
    loadData();
    showScreen('main');
};