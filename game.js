// ==============================================
// ПОЛНАЯ ВЕРСИЯ ИГРЫ "КТО ХОЧЕТ СТАТЬ МИЛЛИОНЕРОМ?"
// С РЕГИСТРАЦИЕЙ, РЕЙТИНГОМ И 15 ВОПРОСАМИ
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
        // Начальные 15 вопросов
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
            },
            {
                question: "В каком городе находится Эйфелева башня?",
                answers: ["Лондон", "Рим", "Париж", "Берлин"],
                correct: 2
            },
            {
                question: "Какая самая длинная река в мире?",
                answers: ["Амазонка", "Нил", "Миссисипи", "Янцзы"],
                correct: 0
            },
            {
                question: "Кто открыл Америку?",
                answers: ["Васко да Гама", "Христофор Колумб", "Фернан Магеллан", "Америго Веспуччи"],
                correct: 1
            },
            {
                question: "Какой химический элемент обозначается символом 'O'?",
                answers: ["Золото", "Серебро", "Кислород", "Водород"],
                correct: 2
            },
            {
                question: "В каком году человек впервые высадился на Луну?",
                answers: ["1965", "1969", "1972", "1958"],
                correct: 1
            },
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
                question: "Какая самая высокая гора в мире?",
                answers: ["К2", "Эверест", "Канченджанга", "Лхоцзе"],
                correct: 1
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
            <div class="main-screen">
                <h1>💰 КТО ХОЧЕТ СТАТЬ МИЛЛИОНЕРОМ?</h1>
                
                <div id="mainMenu">
                    <button class="btn-start" onclick="showGamePreparation()">🚀 Начать игру</button>
                    <button class="btn-login" onclick="showLoginForm()">👤 Вход для игроков</button>
                    <button class="btn-admin" onclick="showAdminLogin()">⚙️ Админ панель</button>
                </div>
                
                <!-- Форма входа -->
                <div id="playerLoginForm" class="login-form hidden">
                    <h2>🔐 Вход в игру</h2>
                    <input type="text" id="loginUsername" placeholder="Логин">
                    <input type="password" id="loginPassword" placeholder="Пароль">
                    <button class="btn-login" onclick="loginPlayer()">Войти</button>
                    <button class="btn-start" onclick="showRegisterForm()">Регистрация</button>
                    <button class="btn-back" onclick="backToMainMenu()">Назад</button>
                    <div id="loginError" class="error-message"></div>
                </div>
                
                <!-- Форма регистрации -->
                <div id="registerForm" class="login-form hidden">
                    <h2>📝 Регистрация</h2>
                    <input type="text" id="regLogin" placeholder="Придумайте логин">
                    <input type="password" id="regPassword" placeholder="Придумайте пароль">
                    <input type="text" id="regName" placeholder="Ваше имя">
                    <button class="btn-start" onclick="registerPlayer()">Зарегистрироваться</button>
                    <button class="btn-back" onclick="backToMainMenu()">Назад</button>
                    <div id="registerError" class="error-message"></div>
                </div>
                
                <!-- Выбор игрока -->
                <div id="playerSelection" class="login-form hidden">
                    <h2>🎮 Выберите игрока</h2>
                    <select id="playerSelect" class="player-select"></select>
                    <button class="btn-start" onclick="selectPlayer()">Играть</button>
                    <button class="btn-back" onclick="backToMainMenu()">Назад</button>
                </div>
                
                <!-- Вход в админку -->
                <div id="adminLoginForm" class="login-form hidden">
                    <h2>🔑 Вход для администратора</h2>
                    <input type="password" id="adminPassword" placeholder="Введите пароль">
                    <button class="btn-admin" onclick="checkAdminPassword()">Войти</button>
                    <button class="btn-back" onclick="backToMainMenu()">Назад</button>
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
                font-family: 'Segoe UI', Arial, sans-serif;
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
                padding: 50px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 30px;
                backdrop-filter: blur(10px);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                border: 1px solid rgba(255, 215, 0, 0.3);
            }

            h1 {
                font-size: 52px;
                color: #FFD700;
                margin-bottom: 40px;
                text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
                letter-spacing: 2px;
            }

            h2 {
                color: #FFD700;
                margin-bottom: 25px;
                font-size: 28px;
            }

            button {
                padding: 15px 40px;
                font-size: 18px;
                margin: 10px;
                border: none;
                border-radius: 50px;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.3s ease;
                text-transform: uppercase;
                letter-spacing: 1px;
            }

            button:hover {
                transform: translateY(-3px);
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
            }

            .btn-start {
                background: linear-gradient(45deg, #00C851, #007E33);
                color: white;
                box-shadow: 0 4px 15px rgba(0, 200, 0, 0.3);
            }

            .btn-login {
                background: linear-gradient(45deg, #aa66cc, #9933CC);
                color: white;
                box-shadow: 0 4px 15px rgba(170, 102, 204, 0.3);
            }

            .btn-admin {
                background: linear-gradient(45deg, #33b5e5, #0099CC);
                color: white;
                box-shadow: 0 4px 15px rgba(51, 181, 229, 0.3);
            }

            .btn-back {
                background: #666;
                color: white;
            }

            .login-form {
                max-width: 400px;
                margin: 30px auto;
                padding: 30px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 20px;
                border: 1px solid rgba(255, 215, 0, 0.3);
            }

            input, select {
                width: 100%;
                padding: 15px;
                margin: 10px 0;
                border: none;
                border-radius: 10px;
                background: rgba(255, 255, 255, 0.15);
                color: white;
                font-size: 16px;
                transition: all 0.3s;
            }

            input:focus, select:focus {
                outline: none;
                background: rgba(255, 255, 255, 0.25);
                box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
            }

            input::placeholder {
                color: rgba(255, 255, 255, 0.7);
            }

            .player-select {
                background: rgba(255, 255, 255, 0.15);
                color: white;
                cursor: pointer;
            }

            .player-select option {
                background: #1A1F3A;
                color: white;
            }

            .hidden {
                display: none !important;
            }

            .error-message {
                color: #ff4444;
                margin-top: 15px;
                font-size: 14px;
            }
        </style>
    `;
    
    updatePlayerSelect();
}

// Показать экран подготовки к игре
function showGamePreparation() {
    if (players.length === 0) {
        alert('👤 Сначала зарегистрируйте игрока!');
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
        select.innerHTML += `<option value="${player.id}">${player.name} (🏆 ${player.bestResult || 0} ₽)</option>`;
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
        document.getElementById('registerError').textContent = '❌ Заполните все поля!';
        return;
    }
    
    if (players.find(p => p.login === login)) {
        document.getElementById('registerError').textContent = '❌ Логин уже занят!';
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
    
    alert('✅ Регистрация успешна! Теперь вы можете войти.');
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
        document.getElementById('loginError').textContent = '❌ Неверный логин или пароль!';
    }
}

// Выбор игрока из списка
function selectPlayer() {
    const select = document.getElementById('playerSelect');
    const playerId = parseInt(select.value);
    
    if (!playerId) {
        alert('❌ Выберите игрока!');
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
        document.getElementById('adminError').textContent = '❌ Неверный пароль!';
    }
}

// Показать админ панель
function showAdminPanel() {
    document.body.innerHTML = `
        <div class="admin-panel">
            <div class="admin-header">
                <h2>⚙️ АДМИН ПАНЕЛЬ</h2>
                <div class="admin-tabs">
                    <button class="tab-btn active" onclick="switchTab('questions')">📋 Вопросы</button>
                    <button class="tab-btn" onclick="switchTab('results')">📊 Результаты</button>
                    <button class="tab-btn" onclick="switchTab('players')">👥 Игроки</button>
                    <button class="tab-btn exit-btn" onclick="showMainScreen()">🚪 Выход</button>
                </div>
            </div>
            
            <!-- Вкладка с вопросами -->
            <div id="questionsTab" class="tab-content active">
                <div class="admin-section">
                    <h3>➕ ДОБАВИТЬ НОВЫЙ ВОПРОС</h3>
                    <form id="questionForm" onsubmit="event.preventDefault(); addQuestion();">
                        <div class="form-group">
                            <label>Вопрос:</label>
                            <input type="text" id="questionInput" required placeholder="Введите текст вопроса">
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
                        
                        <button type="submit" class="save-btn">💾 СОХРАНИТЬ ВОПРОС</button>
                    </form>
                </div>
                
                <div class="admin-section">
                    <h3>📋 ВСЕ ВОПРОСЫ (${questions.length})</h3>
                    <div class="questions-list" id="questionsList"></div>
                </div>
            </div>
            
            <!-- Вкладка с результатами -->
            <div id="resultsTab" class="tab-content">
                <div class="admin-section">
                    <h3>📊 РЕЗУЛЬТАТЫ ИГР</h3>
                    <div class="form-group">
                        <input type="text" id="searchResults" placeholder="🔍 Поиск по имени игрока...">
                    </div>
                    <div id="resultsContainer"></div>
                </div>
            </div>
            
            <!-- Вкладка с игроками -->
            <div id="playersTab" class="tab-content">
                <div class="admin-section">
                    <h3>👥 УПРАВЛЕНИЕ ИГРОКАМИ</h3>
                    <div id="playersList"></div>
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
                font-family: 'Segoe UI', Arial, sans-serif;
                background: linear-gradient(135deg, #0B0C1E, #1A1F3A);
                min-height: 100vh;
                padding: 20px;
                color: white;
            }

            .admin-panel {
                max-width: 1200px;
                margin: 0 auto;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 30px;
                padding: 30px;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 215, 0, 0.3);
            }

            .admin-header {
                text-align: center;
                margin-bottom: 30px;
            }

            .admin-header h2 {
                color: #FFD700;
                font-size: 36px;
                margin-bottom: 20px;
            }

            .admin-tabs {
                display: flex;
                gap: 10px;
                justify-content: center;
                flex-wrap: wrap;
            }

            .tab-btn {
                padding: 12px 25px;
                background: rgba(255, 255, 255, 0.1);
                color: white;
                border: none;
                border-radius: 25px;
                cursor: pointer;
                font-size: 16px;
                font-weight: bold;
                transition: all 0.3s;
            }

            .tab-btn:hover {
                background: rgba(255, 215, 0, 0.3);
                transform: translateY(-2px);
            }

            .tab-btn.active {
                background: #FFD700;
                color: #0B0C1E;
            }

            .exit-btn {
                background: #ff4444 !important;
            }

            .tab-content {
                display: none;
            }

            .tab-content.active {
                display: block;
            }

            .admin-section {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 20px;
                padding: 25px;
                margin-bottom: 25px;
            }

            h3 {
                color: #FFD700;
                margin-bottom: 20px;
                font-size: 22px;
            }

            .form-group {
                margin-bottom: 15px;
            }

            .form-group label {
                display: block;
                margin-bottom: 8px;
                color: #FFD700;
                font-weight: bold;
            }

            input, select, textarea {
                width: 100%;
                padding: 12px 15px;
                border-radius: 10px;
                border: none;
                background: rgba(255, 255, 255, 0.15);
                color: white;
                font-size: 16px;
                transition: all 0.3s;
            }

            input:focus, select:focus {
                outline: none;
                background: rgba(255, 255, 255, 0.25);
                box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
            }

            .answers-admin {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin: 20px 0;
            }

            .answer-input {
                display: flex;
                align-items: center;
                gap: 10px;
                background: rgba(255, 255, 255, 0.05);
                padding: 10px;
                border-radius: 10px;
            }

            .answer-input input[type="radio"] {
                width: 20px;
                height: 20px;
                cursor: pointer;
            }

            .save-btn {
                background: linear-gradient(45deg, #00C851, #007E33);
                color: white;
                padding: 15px 30px;
                border: none;
                border-radius: 25px;
                font-size: 18px;
                font-weight: bold;
                cursor: pointer;
                width: 100%;
                transition: all 0.3s;
            }

            .save-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 20px rgba(0, 200, 0, 0.3);
            }

            .questions-list {
                max-height: 400px;
                overflow-y: auto;
            }

            .question-item {
                background: rgba(255, 255, 255, 0.05);
                padding: 20px;
                border-radius: 15px;
                margin-bottom: 15px;
                border-left: 4px solid #FFD700;
            }

            .question-item p {
                margin: 5px 0;
            }

            .question-item button {
                background: #ff4444;
                color: white;
                border: none;
                padding: 8px 20px;
                border-radius: 5px;
                cursor: pointer;
                margin-top: 10px;
                font-size: 14px;
            }

            .results-table {
                width: 100%;
                border-collapse: collapse;
                color: white;
            }

            .results-table th {
                background: #FFD700;
                color: #0B0C1E;
                padding: 12px;
                text-align: left;
                font-weight: bold;
            }

            .results-table td {
                padding: 10px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .results-table tr:hover {
                background: rgba(255, 215, 0, 0.1);
            }

            .player-card {
                background: rgba(255, 255, 255, 0.05);
                padding: 20px;
                border-radius: 15px;
                margin-bottom: 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-left: 4px solid #FFD700;
            }

            .player-info {
                flex: 1;
            }

            .player-info p {
                margin: 5px 0;
            }

            .player-actions button {
                background: #ffbb33;
                color: #0B0C1E;
                border: none;
                padding: 8px 15px;
                border-radius: 5px;
                cursor: pointer;
                margin: 0 5px;
                font-weight: bold;
            }

            .player-actions button:last-child {
                background: #ff4444;
                color: white;
            }

            @media (max-width: 768px) {
                .answers-admin {
                    grid-template-columns: 1fr;
                }
                
                .player-card {
                    flex-direction: column;
                    text-align: center;
                }
                
                .player-actions {
                    margin-top: 15px;
                }
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
        list.innerHTML = '<p class="empty-message">📭 Вопросов пока нет. Добавьте первый вопрос!</p>';
        return;
    }
    
    let html = '';
    questions.forEach((q, index) => {
        html += `
            <div class="question-item">
                <p><strong>${index + 1}.</strong> ${q.question}</p>
                <p>🔹 А: ${q.answers[0]}</p>
                <p>🔹 Б: ${q.answers[1]}</p>
                <p>🔹 В: ${q.answers[2]}</p>
                <p>🔹 Г: ${q.answers[3]}</p>
                <p>✅ Правильный ответ: ${['А','Б','В','Г'][q.correct]}</p>
                <button onclick="deleteQuestion(${index})">🗑️ Удалить</button>
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
        alert('❌ Заполните все поля!');
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
    alert('✅ Вопрос успешно добавлен!');
}

// Удаление вопроса
function deleteQuestion(index) {
    if (confirm('🗑️ Удалить этот вопрос?')) {
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
        container.innerHTML = '<p class="empty-message">📊 Нет результатов</p>';
        return;
    }
    
    let html = '<table class="results-table">';
    html += '<tr><th>Игрок</th><th>Дата</th><th>Результат</th><th>Правильных</th></tr>';
    
    filteredResults.forEach(result => {
        html += `
            <tr>
                <td>${result.playerName || 'Гость'}</td>
                <td>${new Date(result.date).toLocaleString()}</td>
                <td style="color: #FFD700; font-weight: bold;">${result.winAmount}</td>
                <td>${result.correctAnswers || 0}/${result.totalQuestions || 15}</td>
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
        list.innerHTML = '<p class="empty-message">👤 Нет зарегистрированных игроков</p>';
        return;
    }
    
    let html = '';
    players.forEach(player => {
        html += `
            <div class="player-card">
                <div class="player-info">
                    <p><strong>${player.name}</strong></p>
                    <p>🔹 Логин: ${player.login}</p>
                    <p>🔹 Игр сыграно: ${player.gamesPlayed || 0}</p>
                    <p>🔹 Лучший результат: ${player.bestResult || 0} ₽</p>
                </div>
                <div class="player-actions">
                    <button onclick="resetPlayerStats(${player.id})">🔄 Сброс</button>
                    <button onclick="deletePlayer(${player.id})">🗑️ Удалить</button>
                </div>
            </div>
        `;
    });
    list.innerHTML = html;
}

// Сброс статистики игрока
function resetPlayerStats(playerId) {
    if (confirm('🔄 Сбросить статистику игрока?')) {
        const player = players.find(p => p.id === playerId);
        if (player) {
            player.gamesPlayed = 0;
            player.bestResult = 0;
            savePlayers();
            updatePlayersList();
        }
    }
}

// Удаление игрока
function deletePlayer(playerId) {
    if (confirm('🗑️ Удалить игрока? Все его результаты также будут удалены!')) {
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
        alert('❌ Нет вопросов! Сначала добавьте вопросы в админ-панели.');
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
function showGameScreen() {
    document.body.innerHTML = `
        <div class="game-wrapper">
            <div class="game-container">
                <div class="game-header">
                    <div class="player-card-header">
                        <div class="player-avatar">👤</div>
                        <div class="player-details">
                            <span class="player-name-header">${currentPlayer ? currentPlayer.name : 'Гость'}</span>
                            <span class="player-stats-header">Игр: ${currentPlayer ? currentPlayer.gamesPlayed : 0} | Лучший: ${currentPlayer ? currentPlayer.bestResult : 0} ₽</span>
                        </div>
                    </div>
                </div>
                
                <div class="game-layout">
                    <!-- Основная область с вопросом -->
                    <div class="question-area">
                        <div class="question-card">
                            <div class="question-header">
                                <span class="question-badge">ВОПРОС</span>
                                <span class="question-counter" id="questionNumber">1 / ${currentQuestions.length}</span>
                            </div>
                            
                            <div class="question-text" id="questionText"></div>
                            
                            <div class="answers-grid" id="answersContainer"></div>
                        </div>
                    </div>
                    
                    <!-- Призовая лестница -->
                    <div class="prize-area">
                        <div class="prize-ladder" id="prizeLadder">
                            <div class="prize-header">💰 ПРИЗОВАЯ ЛЕСТНИЦА</div>
                        </div>
                    </div>
                </div>
                
                <div class="game-footer">
                    <button onclick="showMainScreen()" class="exit-game-btn">🚪 Завершить игру</button>
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
                font-family: 'Segoe UI', Arial, sans-serif;
                background: linear-gradient(135deg, #0B0C1E, #1A1F3A);
                min-height: 100vh;
                color: white;
            }

            .game-wrapper {
                min-height: 100vh;
                padding: 20px;
            }

            .game-container {
                max-width: 1400px;
                margin: 0 auto;
                height: 100%;
            }

            /* Шапка игры */
            .game-header {
                margin-bottom: 30px;
            }

            .player-card-header {
                background: rgba(255, 215, 0, 0.1);
                border: 2px solid #FFD700;
                border-radius: 20px;
                padding: 20px 30px;
                display: flex;
                align-items: center;
                gap: 20px;
                backdrop-filter: blur(10px);
            }

            .player-avatar {
                width: 60px;
                height: 60px;
                background: #FFD700;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 30px;
                color: #0B0C1E;
            }

            .player-details {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }

            .player-name-header {
                font-size: 24px;
                font-weight: bold;
                color: #FFD700;
            }

            .player-stats-header {
                font-size: 16px;
                color: rgba(255, 255, 255, 0.8);
            }

            /* Основной лейаут */
            .game-layout {
                display: flex;
                gap: 30px;
                min-height: 600px;
            }

            /* Область вопроса */
            .question-area {
                flex: 3;
            }

            .question-card {
                background: linear-gradient(135deg, #1E2A5A, #0F1A4A);
                border-radius: 30px;
                padding: 40px;
                border: 3px solid #FFD700;
                box-shadow: 0 0 40px rgba(255, 215, 0, 0.2);
                height: 100%;
            }

            .question-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 30px;
            }

            .question-badge {
                background: #FFD700;
                color: #0B0C1E;
                padding: 8px 20px;
                border-radius: 25px;
                font-weight: bold;
                font-size: 18px;
            }

            .question-counter {
                font-size: 18px;
                color: #FFD700;
                font-weight: bold;
            }

            .question-text {
                font-size: 28px;
                text-align: center;
                margin: 30px 0 40px;
                line-height: 1.5;
                color: white;
                font-weight: 500;
            }

            .answers-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 20px;
            }

            .answer-btn {
                background: linear-gradient(135deg, #2A3F7A, #1A2A5A);
                border: 2px solid #4A5A9A;
                color: white;
                padding: 25px;
                font-size: 18px;
                border-radius: 15px;
                cursor: pointer;
                text-align: left;
                transition: all 0.3s;
                display: flex;
                align-items: center;
                gap: 15px;
                width: 100%;
            }

            .answer-btn:hover:not(:disabled) {
                border-color: #FFD700;
                transform: scale(1.02);
                box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
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
                width: 40px;
                height: 40px;
                background: #FFD700;
                color: #0B0C1E;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 20px;
                flex-shrink: 0;
            }

            /* Область призов */
            .prize-area {
                flex: 1;
                min-width: 280px;
            }

            .prize-ladder {
                background: rgba(0, 0, 0, 0.8);
                border-radius: 20px;
                padding: 25px;
                border: 2px solid #FFD700;
                position: sticky;
                top: 20px;
                max-height: calc(100vh - 150px);
                overflow-y: auto;
            }

            .prize-header {
                text-align: center;
                font-size: 20px;
                font-weight: bold;
                color: #FFD700;
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 2px solid #FFD700;
                letter-spacing: 2px;
            }

            .prize-item {
                padding: 12px 15px;
                margin: 5px 0;
                border-radius: 10px;
                text-align: right;
                font-size: 18px;
                font-weight: 500;
                transition: all 0.3s;
                border-left: 3px solid transparent;
            }

            .prize-item.current {
                background: #FFD700;
                color: #0B0C1E;
                font-weight: bold;
                transform: scale(1.02);
                border-left: 3px solid white;
            }

            .prize-item.reached {
                color: #00C851;
                border-left: 3px solid #00C851;
            }

            /* Подвал */
            .game-footer {
                text-align: center;
                margin-top: 30px;
            }

            .exit-game-btn {
                background: #666;
                color: white;
                padding: 15px 40px;
                border: none;
                border-radius: 25px;
                font-size: 18px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s;
            }

            .exit-game-btn:hover {
                background: #888;
                transform: translateY(-2px);
            }

            /* Адаптивность */
            @media (max-width: 1024px) {
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
            }

            @media (max-width: 768px) {
                .question-text {
                    font-size: 22px;
                }
                
                .answer-btn {
                    padding: 20px;
                }
            }
        </style>
    `;
    
    showQuestion();
}

// Показать вопрос
function showQuestion() {
    const q = currentQuestions[currentQuestionIndex];
    document.getElementById('questionNumber').textContent = `${currentQuestionIndex + 1} / ${currentQuestions.length}`;
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
            <div class="result-card">
                <h1>🏆 ИГРА ОКОНЧЕНА!</h1>
                <div class="win-amount">${winAmount}</div>
                <div class="stats">
                    <p>Правильных ответов: ${correctAnswers} из ${currentQuestions.length}</p>
                    <p>${Math.round(correctAnswers/currentQuestions.length*100)}% правильных</p>
                </div>
                <button onclick="showMainScreen()" class="btn-start">📋 В главное меню</button>
            </div>
        </div>

        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: 'Segoe UI', Arial, sans-serif;
                background: linear-gradient(135deg, #0B0C1E, #1A1F3A);
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                color: white;
            }

            .result-screen {
                width: 100%;
                max-width: 600px;
                padding: 20px;
            }

            .result-card {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 30px;
                padding: 50px;
                backdrop-filter: blur(10px);
                border: 3px solid #FFD700;
                text-align: center;
            }

            h1 {
                color: #FFD700;
                font-size: 42px;
                margin-bottom: 30px;
            }

            .win-amount {
                font-size: 64px;
                color: #FFD700;
                margin: 30px 0;
                text-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
                font-weight: bold;
            }

            .stats {
                font-size: 20px;
                margin-bottom: 40px;
                line-height: 1.6;
            }

            .stats p {
                margin: 10px 0;
            }

            .btn-start {
                background: linear-gradient(45deg, #00C851, #007E33);
                color: white;
                padding: 15px 40px;
                font-size: 20px;
                border: none;
                border-radius: 25px;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.3s;
            }

            .btn-start:hover {
                transform: translateY(-3px);
                box-shadow: 0 5px 20px rgba(0, 200, 0, 0.3);
            }
        </style>
    `;
}

// Обновление призовой лестницы
function updatePrizeLadder() {
    const ladder = document.getElementById('prizeLadder');
    if (!ladder) return;
    
    let html = '<div class="prize-header">💰 ПРИЗОВАЯ ЛЕСТНИЦА</div>';
    
    for (let i = prizeLadder.length - 1; i >= 0; i--) {
        let className = 'prize-item';
        if (i === currentPrizeIndex + 1) {
            className += ' current';
        } else if (i <= currentPrizeIndex) {
            className += ' reached';
        }
        
        html += `<div class="${className}">${prizeLadder[i]}</div>`;
    }
    
    ladder.innerHTML = html;
}

// ==============================================
// ЗАПУСК ПРИ ЗАГРУЗКЕ
// ==============================================
window.onload = function() {
    loadData();
    showMainScreen();
};
