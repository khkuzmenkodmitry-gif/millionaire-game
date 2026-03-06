// ==============================================
// ПОЛНАЯ ВЕРСИЯ - С РЕГИСТРАЦИЕЙ И РЕЙТИНГОМ
// ==============================================

// Глобальные переменные
let questions = [];
let players = [];
let results = [];
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

// ==============================================
// ЗАГРУЗКА И СОХРАНЕНИЕ ДАННЫХ
// ==============================================

// Загрузка всех данных
function loadData() {
    // Загружаем вопросы
    const savedQuestions = localStorage.getItem('millionaireQuestions');
    if (savedQuestions) {
        questions = JSON.parse(savedQuestions);
    } else {
        // Начальные вопросы
        questions = [
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
        ];
        saveQuestions();
    }
    
    // Загружаем игроков
    const savedPlayers = localStorage.getItem('millionairePlayers');
    if (savedPlayers) {
        players = JSON.parse(savedPlayers);
    }
    
    // Загружаем результаты
    const savedResults = localStorage.getItem('millionaireResults');
    if (savedResults) {
        results = JSON.parse(savedResults);
    }
}

// Сохранение вопросов
function saveQuestions() {
    localStorage.setItem('millionaireQuestions', JSON.stringify(questions));
}

// Сохранение игроков
function savePlayers() {
    localStorage.setItem('millionairePlayers', JSON.stringify(players));
}

// Сохранение результатов
function saveResults() {
    localStorage.setItem('millionaireResults', JSON.stringify(results));
}

// ==============================================
// УПРАВЛЕНИЕ ЭКРАНАМИ
// ==============================================

// Показать главный экран
function showMainScreen() {
    document.body.innerHTML = `
        <div class="game-container">
            <div id="mainScreen" class="main-screen">
                <h1>КТО ХОЧЕТ СТАТЬ МИЛЛИОНЕРОМ?</h1>
                
                <div id="mainMenu">
                    <button class="btn-start" onclick="showGamePreparation()">Начать игру</button>
                    <button class="btn-login" onclick="showLoginForm()">Вход для игроков</button>
                    <button class="btn-admin" onclick="showAdminLogin()">Админ панель</button>
                </div>
                
                <!-- Форма входа -->
                <div id="playerLoginForm" class="login-form hidden">
                    <h2>Вход в игру</h2>
                    <input type="text" id="loginUsername" placeholder="Логин">
                    <input type="password" id="loginPassword" placeholder="Пароль">
                    <button onclick="loginPlayer()">Войти</button>
                    <button onclick="showRegisterForm()">Регистрация</button>
                    <button onclick="backToMainMenu()">Назад</button>
                    <div id="loginError" class="error-message"></div>
                </div>
                
                <!-- Форма регистрации -->
                <div id="registerForm" class="login-form hidden">
                    <h2>Регистрация</h2>
                    <input type="text" id="regLogin" placeholder="Логин">
                    <input type="password" id="regPassword" placeholder="Пароль">
                    <input type="text" id="regName" placeholder="Ваше имя">
                    <button onclick="registerPlayer()">Зарегистрироваться</button>
                    <button onclick="backToMainMenu()">Назад</button>
                    <div id="registerError" class="error-message"></div>
                </div>
                
                <!-- Выбор игрока -->
                <div id="playerSelection" class="login-form hidden">
                    <h2>Выберите игрока</h2>
                    <select id="playerSelect"></select>
                    <button onclick="selectPlayer()">Играть</button>
                    <button onclick="backToMainMenu()">Назад</button>
                </div>
                
                <!-- Вход в админку -->
                <div id="adminLoginForm" class="login-form hidden">
                    <h2>Вход для администратора</h2>
                    <input type="password" id="adminPassword" placeholder="Пароль">
                    <button onclick="checkAdminPassword()">Войти</button>
                    <button onclick="backToMainMenu()">Назад</button>
                    <div id="adminError" class="error-message"></div>
                </div>
            </div>
        </div>
        
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: Arial, sans-serif;
                background: linear-gradient(135deg, #0B0C1E, #1A1F3A);
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                color: white;
            }
            
            .game-container {
                width: 100%;
                max-width: 1200px;
                padding: 20px;
            }
            
            .main-screen {
                text-align: center;
                padding: 40px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                backdrop-filter: blur(10px);
            }
            
            h1 {
                font-size: 48px;
                color: #FFD700;
                margin-bottom: 30px;
                text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
            }
            
            h2 {
                color: #FFD700;
                margin-bottom: 20px;
            }
            
            button {
                padding: 15px 40px;
                font-size: 18px;
                margin: 10px;
                border: none;
                border-radius: 10px;
                cursor: pointer;
                font-weight: bold;
                transition: transform 0.3s;
            }
            
            button:hover {
                transform: scale(1.05);
            }
            
            .btn-start {
                background: #00C851;
                color: white;
            }
            
            .btn-login {
                background: #aa66cc;
                color: white;
            }
            
            .btn-admin {
                background: #33b5e5;
                color: white;
            }
            
            .btn-back {
                background: #666;
                color: white;
            }
            
            .login-form {
                max-width: 400px;
                margin: 0 auto;
                padding: 20px;
            }
            
            input, select {
                width: 100%;
                padding: 12px;
                margin: 10px 0;
                border: none;
                border-radius: 5px;
                background: rgba(255, 255, 255, 0.2);
                color: white;
                font-size: 16px;
            }
            
            .hidden {
                display: none !important;
            }
            
            .error-message {
                color: #ff4444;
                margin-top: 10px;
            }
        </style>
    `;
    
    updatePlayerSelect();
}

// Показать экран подготовки к игре
function showGamePreparation() {
    if (players.length === 0) {
        alert('Сначала зарегистрируйте игрока!');
        showRegisterForm();
        return;
    }
    
    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('playerSelection').classList.remove('hidden');
    updatePlayerSelect();
}

// Показать форму входа
function showLoginForm() {
    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('playerLoginForm').classList.remove('hidden');
}

// Показать форму регистрации
function showRegisterForm() {
    document.getElementById('playerLoginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.remove('hidden');
}

// Показать вход в админку
function showAdminLogin() {
    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('adminLoginForm').classList.remove('hidden');
}

// Вернуться в главное меню
function backToMainMenu() {
    document.getElementById('mainMenu').classList.remove('hidden');
    document.getElementById('playerLoginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.add('hidden');
    document.getElementById('playerSelection').classList.add('hidden');
    document.getElementById('adminLoginForm').classList.add('hidden');
}

// Обновить список игроков
function updatePlayerSelect() {
    const select = document.getElementById('playerSelect');
    if (!select) return;
    
    select.innerHTML = '<option value="">-- Выберите игрока --</option>';
    players.forEach(player => {
        select.innerHTML += `<option value="${player.id}">${player.name} (Лучший: ${player.bestResult || 0} ₽)</option>`;
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
    savePlayers();
    
    alert('Регистрация успешна!');
    backToMainMenu();
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
        showAdminPanel();
    } else {
        document.getElementById('adminError').textContent = 'Неверный пароль!';
    }
}

// Показать админ панель
function showAdminPanel() {
    document.body.innerHTML = `
        <div class="admin-panel">
            <div class="admin-tabs">
                <button class="tab-btn active" onclick="switchTab('questions')">Вопросы</button>
                <button class="tab-btn" onclick="switchTab('results')">Результаты</button>
                <button class="tab-btn" onclick="switchTab('players')">Игроки</button>
                <button class="tab-btn" onclick="showMainScreen()">Выход</button>
            </div>
            
            <!-- Вкладка с вопросами -->
            <div id="questionsTab" class="tab-content active">
                <h2>УПРАВЛЕНИЕ ВОПРОСАМИ</h2>
                <form id="questionForm" onsubmit="event.preventDefault(); addQuestion();">
                    <div class="form-group">
                        <label>Вопрос:</label>
                        <input type="text" id="questionInput" required>
                    </div>
                    
                    <div class="answers-admin">
                        <div class="answer-input">
                            <input type="radio" name="correctAnswer" value="0" checked>
                            <input type="text" id="answerA" placeholder="Ответ А" required>
                        </div>
                        <div class="answer-input">
                            <input type="radio" name="correctAnswer" value="1">
                            <input type="text" id="answerB" placeholder="Ответ Б" required>
                        </div>
                        <div class="answer-input">
                            <input type="radio" name="correctAnswer" value="2">
                            <input type="text" id="answerC" placeholder="Ответ В" required>
                        </div>
                        <div class="answer-input">
                            <input type="radio" name="correctAnswer" value="3">
                            <input type="text" id="answerD" placeholder="Ответ Г" required>
                        </div>
                    </div>
                    
                    <button type="submit" class="save-btn">Сохранить вопрос</button>
                </form>
                
                <div class="questions-list" id="questionsList"></div>
            </div>
            
            <!-- Вкладка с результатами -->
            <div id="resultsTab" class="tab-content">
                <h2>РЕЗУЛЬТАТЫ ИГР</h2>
                <div class="form-group">
                    <input type="text" id="searchResults" placeholder="Поиск по имени игрока...">
                </div>
                <div id="resultsContainer"></div>
            </div>
            
            <!-- Вкладка с игроками -->
            <div id="playersTab" class="tab-content">
                <h2>УПРАВЛЕНИЕ ИГРОКАМИ</h2>
                <div id="playersList"></div>
            </div>
        </div>
        
        <style>
            .admin-panel {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                padding: 30px;
                backdrop-filter: blur(10px);
                max-height: 80vh;
                overflow-y: auto;
                color: white;
                font-family: Arial;
            }
            
            .admin-tabs {
                display: flex;
                gap: 10px;
                margin-bottom: 20px;
                flex-wrap: wrap;
            }
            
            .tab-btn {
                padding: 10px 20px;
                background: rgba(255, 255, 255, 0.1);
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }
            
            .tab-btn.active {
                background: #FFD700;
                color: #0B0C1E;
            }
            
            .tab-content {
                display: none;
            }
            
            .tab-content.active {
                display: block;
            }
            
            .form-group {
                margin-bottom: 15px;
            }
            
            .form-group label {
                display: block;
                margin-bottom: 5px;
                color: #FFD700;
            }
            
            input, select, textarea {
                width: 100%;
                padding: 10px;
                border-radius: 5px;
                border: none;
                background: rgba(255, 255, 255, 0.2);
                color: white;
            }
            
            .answers-admin {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
                margin: 15px 0;
            }
            
            .answer-input {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .answer-input input[type="radio"] {
                width: auto;
            }
            
            .save-btn {
                background: #00C851;
                color: white;
                padding: 15px;
                border: none;
                border-radius: 10px;
                font-size: 18px;
                cursor: pointer;
                width: 100%;
            }
            
            .question-item {
                background: rgba(255, 255, 255, 0.05);
                padding: 15px;
                border-radius: 5px;
                margin-bottom: 10px;
            }
            
            .results-table {
                width: 100%;
                border-collapse: collapse;
                color: white;
            }
            
            .results-table th {
                background: #FFD700;
                color: #0B0C1E;
                padding: 10px;
            }
            
            .results-table td {
                padding: 8px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .player-card {
                background: rgba(255, 255, 255, 0.05);
                padding: 15px;
                border-radius: 5px;
                margin-bottom: 10px;
            }
        </style>
    `;
    
    updateQuestionsList();
    updateResultsList();
    updatePlayersList();
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
        list.innerHTML = '<p>Вопросов пока нет</p>';
        return;
    }
    
    let html = '';
    questions.forEach((q, index) => {
        html += `
            <div class="question-item">
                <p><strong>${index + 1}.</strong> ${q.question}</p>
                <p>А: ${q.answers[0]}</p>
                <p>Б: ${q.answers[1]}</p>
                <p>В: ${q.answers[2]}</p>
                <p>Г: ${q.answers[3]}</p>
                <p>✅ Правильный: ${['А','Б','В','Г'][q.correct]}</p>
                <button onclick="deleteQuestion(${index})" style="background:#ff4444;">Удалить</button>
            </div>
        `;
    });
    list.innerHTML = html;
}

// Добавление вопроса
function addQuestion() {
    const question = {
        question: document.getElementById('questionInput').value,
        answers: [
            document.getElementById('answerA').value,
            document.getElementById('answerB').value,
            document.getElementById('answerC').value,
            document.getElementById('answerD').value
        ],
        correct: parseInt(document.querySelector('input[name="correctAnswer"]:checked').value)
    };
    
    if (!question.question || !question.answers[0] || !question.answers[1] || !question.answers[2] || !question.answers[3]) {
        alert('Заполните все поля!');
        return;
    }
    
    questions.push(question);
    saveQuestions();
    
    // Очистка формы
    document.getElementById('questionInput').value = '';
    document.getElementById('answerA').value = '';
    document.getElementById('answerB').value = '';
    document.getElementById('answerC').value = '';
    document.getElementById('answerD').value = '';
    document.querySelector('input[name="correctAnswer"][value="0"]').checked = true;
    
    updateQuestionsList();
    alert('Вопрос добавлен!');
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
    if (!container) return;
    
    const searchText = document.getElementById('searchResults')?.value?.toLowerCase() || '';
    
    let filteredResults = [...results].reverse();
    if (searchText) {
        filteredResults = filteredResults.filter(r => 
            r.playerName?.toLowerCase().includes(searchText)
        );
    }
    
    if (filteredResults.length === 0) {
        container.innerHTML = '<p>Нет результатов</p>';
        return;
    }
    
    let html = '<table class="results-table">';
    html += '<tr><th>Игрок</th><th>Дата</th><th>Результат</th></tr>';
    
    filteredResults.forEach(result => {
        html += `
            <tr>
                <td>${result.playerName}</td>
                <td>${new Date(result.date).toLocaleString()}</td>
                <td style="color:#FFD700;">${result.winAmount}</td>
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
        list.innerHTML = '<p>Нет игроков</p>';
        return;
    }
    
    let html = '';
    players.forEach(player => {
        html += `
            <div class="player-card">
                <p><strong>${player.name}</strong></p>
                <p>Логин: ${player.login}</p>
                <p>Игр: ${player.gamesPlayed || 0}</p>
                <p>Лучший: ${player.bestResult || 0} ₽</p>
                <button onclick="resetPlayerStats(${player.id})">Сбросить статистику</button>
                <button onclick="deletePlayer(${player.id})">Удалить</button>
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

// ==============================================
// ИГРОВАЯ ЛОГИКА
// ==============================================

// Начало игры
function startGame() {
    if (questions.length === 0) {
        alert('Добавьте вопросы в админ-панели!');
        showMainScreen();
        return;
    }
    
    // Перемешиваем вопросы
    currentQuestions = [...questions].sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    currentPrizeIndex = -1;
    gameHistory = [];
    
    showGameScreen();
}

// Показать игровой экран
// Показать игровой экран
function showGameScreen() {
    document.body.innerHTML = `
        <div class="game-container">
            <div class="game-header">
                <div class="player-info">
                    <span class="player-name">${currentPlayer ? currentPlayer.name : 'Гость'}</span>
                    <div class="player-stats">
                        <span>Игр: <span id="playerGames">${currentPlayer ? currentPlayer.gamesPlayed : 0}</span></span>
                        <span>Лучший: <span id="playerBest">${currentPlayer ? currentPlayer.bestResult : 0}</span> ₽</span>
                    </div>
                </div>
            </div>
            
            <div class="game-layout">
                <div class="question-area">
                    <div class="question-section">
                        <div class="question-number" id="questionNumber">Вопрос 1 из ${currentQuestions.length}</div>
                        <div class="question-text" id="questionText"></div>
                        <div class="answers-grid" id="answersContainer"></div>
                    </div>
                </div>
                
                <div class="prize-area">
                    <div class="prize-ladder" id="prizeLadder"></div>
                </div>
            </div>
            
            <div class="game-footer">
                <button onclick="showMainScreen()" class="btn-back">Выйти в меню</button>
            </div>
        </div>
        
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: Arial, sans-serif;
                background: linear-gradient(135deg, #0B0C1E, #1A1F3A);
                min-height: 100vh;
                color: white;
            }
            
            .game-container {
                max-width: 1400px;
                margin: 0 auto;
                padding: 20px;
                min-height: 100vh;
                display: flex;
                flex-direction: column;
            }
            
            /* Шапка игры */
            .game-header {
                margin-bottom: 20px;
            }
            
            .player-info {
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: rgba(255, 215, 0, 0.1);
                padding: 15px 25px;
                border-radius: 10px;
                border: 1px solid #FFD700;
                width: 100%;
            }
            
            .player-name {
                font-size: 24px;
                color: #FFD700;
                font-weight: bold;
            }
            
            .player-stats {
                display: flex;
                gap: 20px;
            }
            
            /* Основной лейаут */
            .game-layout {
                display: flex;
                gap: 30px;
                flex: 1;
                margin-bottom: 20px;
            }
            
            /* Область вопросов (слева) */
            .question-area {
                flex: 3;
                min-width: 0; /* Для предотвращения переполнения */
            }
            
            .question-section {
                background: linear-gradient(135deg, #1E2A5A, #0F1A4A);
                border-radius: 20px;
                padding: 30px;
                border: 2px solid #FFD700;
                box-shadow: 0 0 30px rgba(255, 215, 0, 0.3);
                height: 100%;
            }
            
            .question-number {
                text-align: center;
                color: #FFD700;
                font-size: 18px;
                margin-bottom: 20px;
            }
            
            .question-text {
                font-size: 28px;
                text-align: center;
                margin-bottom: 30px;
                line-height: 1.4;
                word-wrap: break-word;
            }
            
            .answers-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 15px;
            }
            
            .answer-btn {
                background: linear-gradient(135deg, #2A3F7A, #1A2A5A);
                border: 2px solid #4A5A9A;
                color: white;
                padding: 20px;
                font-size: 18px;
                border-radius: 10px;
                cursor: pointer;
                text-align: left;
                transition: all 0.3s;
                width: 100%;
                word-wrap: break-word;
            }
            
            .answer-btn:hover:not(:disabled) {
                border-color: #FFD700;
                transform: scale(1.02);
            }
            
            .answer-btn.correct {
                background: #00C851;
                border-color: #FFD700;
            }
            
            .answer-btn.wrong {
                background: #ff4444;
                border-color: #ff4444;
            }
            
            .answer-letter {
                display: inline-block;
                width: 30px;
                height: 30px;
                background: #FFD700;
                color: #0B0C1E;
                border-radius: 50%;
                text-align: center;
                line-height: 30px;
                font-weight: bold;
                margin-right: 10px;
                flex-shrink: 0;
            }
            
            /* Область призов (справа) */
            .prize-area {
                flex: 1;
                min-width: 250px;
            }
            
            .prize-ladder {
                background: rgba(0, 0, 0, 0.8);
                border-radius: 15px;
                padding: 20px;
                border: 1px solid #FFD700;
                position: sticky;
                top: 20px;
                max-height: calc(100vh - 200px);
                overflow-y: auto;
            }
            
            .prize-ladder h3 {
                color: #FFD700;
                text-align: center;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 1px solid #FFD700;
            }
            
            .prize-item {
                padding: 10px;
                margin: 5px 0;
                border-radius: 8px;
                text-align: right;
                transition: all 0.3s;
                font-size: 16px;
            }
            
            .prize-item.current {
                background: #FFD700;
                color: #0B0C1E;
                font-weight: bold;
                transform: scale(1.02);
            }
            
            .prize-item.reached {
                color: #00C851;
            }
            
            /* Подвал */
            .game-footer {
                text-align: center;
                margin-top: auto;
            }
            
            .btn-back {
                background: #666;
                color: white;
                padding: 10px 30px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
                transition: all 0.3s;
            }
            
            .btn-back:hover {
                background: #888;
                transform: scale(1.05);
            }
            
            /* Адаптивность для мобильных */
            @media (max-width: 768px) {
                .game-layout {
                    flex-direction: column;
                }
                
                .prize-area {
                    order: -1;
                    margin-bottom: 20px;
                }
                
                .prize-ladder {
                    position: static;
                    max-height: 300px;
                }
                
                .answers-grid {
                    grid-template-columns: 1fr;
                }
                
                .question-text {
                    font-size: 22px;
                }
            }
        </style>
    `;
    
    showQuestion();
}
    
    showQuestion();
}

// Показать вопрос
function showQuestion() {
    const q = currentQuestions[currentQuestionIndex];
    document.getElementById('questionNumber').textContent = `Вопрос ${currentQuestionIndex + 1} из ${currentQuestions.length}`;
    document.getElementById('questionText').textContent = q.question;
    
    const container = document.getElementById('answersContainer');
    container.innerHTML = '';
    
    const letters = ['А', 'Б', 'В', 'Г'];
    
    q.answers.forEach((answer, index) => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.innerHTML = `<span class="answer-letter">${letters[index]}</span> ${answer}`;
        btn.onclick = () => checkAnswer(index);
        container.appendChild(btn);
    });
    
    updatePrizeLadder();
}

// Проверка ответа
function checkAnswer(selectedIndex) {
    const q = currentQuestions[currentQuestionIndex];
    const buttons = document.querySelectorAll('.answer-btn');
    
    gameHistory.push({
        question: q.question,
        selected: selectedIndex,
        correct: q.correct,
        isCorrect: selectedIndex === q.correct
    });
    
    buttons.forEach(btn => btn.disabled = true);
    
    buttons.forEach((btn, index) => {
        if (index === q.correct) {
            btn.classList.add('correct');
        } else if (index === selectedIndex && index !== q.correct) {
            btn.classList.add('wrong');
        }
    });
    
    if (selectedIndex === q.correct) {
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
    
    if (isWin) {
        winAmount = prizeLadder[prizeLadder.length - 1];
        winValue = 1000000;
    } else if (currentPrizeIndex >= 0) {
        winAmount = prizeLadder[currentPrizeIndex];
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
        totalQuestions: currentQuestions.length
    });
    saveResults();
    
    if (currentPlayer) {
        currentPlayer.gamesPlayed = (currentPlayer.gamesPlayed || 0) + 1;
        if (winValue > (currentPlayer.bestResult || 0)) {
            currentPlayer.bestResult = winValue;
        }
        savePlayers();
    }
    
    showResultScreen(winAmount, correctAnswers);
}

// Показать экран результата
function showResultScreen(winAmount, correctAnswers) {
    document.body.innerHTML = `
        <div class="result-screen">
            <h2>ИГРА ОКОНЧЕНА!</h2>
            <div class="win-amount">${winAmount}</div>
            <div class="stats">Правильных ответов: ${correctAnswers} из ${currentQuestions.length}</div>
            <button onclick="showMainScreen()" class="btn-start">В главное меню</button>
        </div>
        
        <style>
            .result-screen {
                text-align: center;
                padding: 50px;
                background: linear-gradient(135deg, #0B0C1E, #1A1F3A);
                min-height: 100vh;
                color: white;
                font-family: Arial;
            }
            
            .win-amount {
                font-size: 56px;
                color: #FFD700;
                margin: 30px 0;
                text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
            }
            
            .stats {
                font-size: 24px;
                margin-bottom: 30px;
            }
        </style>
    `;
}

// Обновление призовой лестницы
function updatePrizeLadder() {
    const ladder = document.getElementById('prizeLadder');
    if (!ladder) return;
    
    ladder.innerHTML = '<h3>ПРИЗЫ:</h3>';
    
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

// ==============================================
// ЗАПУСК ПРИ ЗАГРУЗКЕ
// ==============================================
window.onload = function() {
    loadData();
    showMainScreen();
};

