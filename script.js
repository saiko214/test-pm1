// script.js
let currentQuizQuestions = []; // Тестке арналған ағымдағы сұрақтар
let currentQuestionIndex = 0;
let userAnswers = {};
const TOTAL_QUESTIONS_IN_TEST = 30; // Әр тест 30 сұрақтан тұрады

// DOM элементтерін алу (Қайта тексерілді)
const mainMenu = document.getElementById('main-menu');
const variantSelection = document.getElementById('variant-selection');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');
const questionContainer = document.getElementById('question-container');
const nextButton = document.getElementById('next-button');
const finishButton = document.getElementById('finish-button');
const progressText = document.getElementById('progress-text');
const quizTitle = document.getElementById('quiz-title');

// Экрандарды ауыстыру функциясы
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        // Экран ауысқанда беттің жоғарғы жағына өту
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
    }
}

function showMainMenu() {
    showScreen('main-menu');
}

function showVariantSelection() {
    // Егер 150 сұрақтың дерекқоры жүктелмесе, ескерту беру
    if (typeof allQuestions === 'undefined' || allQuestions.length === 0) {
        alert("Сұрақтар жүктелмеген! 'questions.js' файлын тексеріңіз.");
        return;
    }
    showScreen('variant-selection');
}

/**
 * Вариантқа сәйкес тестті бастау
 */
function startSpecificTest(variantKey) {
    let start, end;
    
    // Сұрақтардың басталу және аяқталу ID-лерін анықтау
    switch (variantKey) {
        case 'variant1': start = 1; end = 30; quizTitle.textContent = "Тест: 1-Вариант (Сұрақ 1-30)"; break;
        case 'variant2': start = 31; end = 60; quizTitle.textContent = "Тест: 2-Вариант (Сұрақ 31-60)"; break;
        case 'variant3': start = 61; end = 90; quizTitle.textContent = "Тест: 3-Вариант (Сұрақ 61-90)"; break;
        case 'variant4': start = 91; end = 120; quizTitle.textContent = "Тест: 4-Вариант (Сұрақ 91-120)"; break;
        case 'variant5': start = 121; end = 150; quizTitle.textContent = "Тест: 5-Вариант (Сұрақ 121-150)"; break;
        default: return;
    }

    // `allQuestions` массивінен сұрақтарды кесу
    // Қазақ тіліндегі сұрақ ID-лері 1-ден басталады, ал массив индексі 0-ден басталатынын ескеріңіз.
    currentQuizQuestions = allQuestions.slice(start - 1, end);
    initTest();
}

/**
 * Кездейсоқ 30 сұрақтан тұратын тестті бастау
 */
function startRandomTest() {
    if (typeof allQuestions === 'undefined' || allQuestions.length < TOTAL_QUESTIONS_IN_TEST) {
        alert("Тест бастау үшін сұрақтар жеткіліксіз немесе жүктелмеген!");
        showMainMenu();
        return;
    }
    
    // allQuestions массивін араластыру
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    
    // Алғашқы 30 сұрақты алу
    currentQuizQuestions = shuffled.slice(0, TOTAL_QUESTIONS_IN_TEST);
    quizTitle.textContent = "Тест: Кездейсоқ 30 Сұрақ";

    initTest();
}

// Тестті бастапқы қалыпқа келтіру
function initTest() {
    currentQuestionIndex = 0;
    userAnswers = {};
    
    // Егер сұрақтар саны 0 болса, тестті бастамау
    if (currentQuizQuestions.length === 0) {
        alert("Тест үшін сұрақтар табылмады.");
        showMainMenu();
        return;
    }

    nextButton.classList.remove('hidden');
    finishButton.classList.add('hidden');
    showScreen('quiz-screen');
    loadQuestion(currentQuestionIndex);
}

// Сұрақты жүктеу және көрсету
function loadQuestion(index) {
    const questionData = currentQuizQuestions[index];
    const questionNumber = index + 1;
    const totalQuestions = currentQuizQuestions.length;

    progressText.textContent = `${questionNumber} / ${totalQuestions}`;

    // Тестті аяқтау немесе келесі сұрақ түймелерін көрсету логикасы
    if (questionNumber === totalQuestions) {
        nextButton.classList.add('hidden');
        finishButton.classList.remove('hidden');
    } else {
        nextButton.classList.remove('hidden');
        finishButton.classList.add('hidden');
    }

    let optionsHtml = '';
    const questionId = questionData.id;

    // Сұрақ нұсқаларын генерациялау
    for (const key in questionData.options) {
        const optionValue = questionData.options[key];
        // Пайдаланушының бұрынғы жауабын тексеру және белгілеу
        const isChecked = userAnswers[questionId] === key ? 'checked' : '';
        
        optionsHtml += `
            <li>
                <label class="option-label">
                    <input type="radio" 
                           name="question-${questionId}" 
                           value="${key}" 
                           onclick="saveAnswer(${questionId}, '${key}')"
                           ${isChecked}>
                    ${key}) ${optionValue}
                </label>
            </li>
        `;
    }

    questionContainer.innerHTML = `
        <h3>${questionData.id} Сұрақ. ${questionData.question}</h3>
        <ul class="options-list">
            ${optionsHtml}
        </ul>
    `;
}

// Пайдаланушы жауабын сақтау
function saveAnswer(questionId, answerKey) {
    userAnswers[questionId] = answerKey;
}

// Келесі сұраққа өту
function nextQuestion() {
    const currentQuestion = currentQuizQuestions[currentQuestionIndex];
    if (!currentQuestion) return; // Қателіктерді болдырмау

    const currentQuestionId = currentQuestion.id;
    
    // Жауап берілмеген болса, ескерту беру
    if (!userAnswers[currentQuestionId]) {
        alert("Жауапты таңдаңыз!");
        return;
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuizQuestions.length) {
        loadQuestion(currentQuestionIndex);
    } else {
        // Егер бұл соңғы сұрақ болса, тестті аяқтау
        finishTest();
    }
}

// Тестті аяқтау және нәтижелерді көрсету
function finishTest() {
    if (currentQuizQuestions.length === 0) {
        alert("Есептеу үшін сұрақтар жоқ. Тест дұрыс басталмаған.");
        showMainMenu();
        return;
    }
    
    const totalQuestions = currentQuizQuestions.length;
    let correctCount = 0;
    let incorrectAnswers = [];

    currentQuizQuestions.forEach(q => {
        const userAnswer = userAnswers[q.id];
        
        if (userAnswer && userAnswer === q.answer) {
            correctCount++;
        } else {
            // Қате жауаптарға (жауап берілмесе де) немесе мүлдем жауап берілмесе
            incorrectAnswers.push({
                id: q.id,
                question: q.question,
                userAnswer: userAnswer || "Жауап берілмеген",
                correctAnswer: q.answer
            });
        }
    });

    // Нәтижелерді есептеу
    const percentage = (correctCount / totalQuestions) * 100;
    // 100 баллдық шкала: (Дұрыс жауап саны / Жалпы сұрақ саны) * 100
    const score = Math.round(percentage); 

    // 1. Дұрыс жауаптар саны
    document.getElementById('correct-count').textContent = correctCount;
    // 2. Дұрыс жауап пайызы
    document.getElementById('percentage').textContent = `${percentage.toFixed(1)}%`;
    // 4. Жалпы балл
    document.getElementById('score').textContent = `${score} / 100`;

    // 3. Қате жауаптар тізімін генерациялау
    const incorrectAnswersDiv = document.getElementById('incorrect-answers');
    const noIncorrectAnswersP = document.getElementById('no-incorrect-answers');
    incorrectAnswersDiv.innerHTML = '';
    
    if (incorrectAnswers.length > 0) {
        noIncorrectAnswersP.style.display = 'none';

        // Дұрыс жауаптары бар сұрақтарды тізімнен алып тастау
        const finalIncorrectList = incorrectAnswers.filter(item => item.userAnswer !== allQuestions.find(q => q.id === item.id).answer);

        finalIncorrectList.forEach(item => {
            const originalQuestion = allQuestions.find(q => q.id === item.id);
            const userOptionText = originalQuestion.options[item.userAnswer] || "Жауап берілмеген";
            const correctOptionText = originalQuestion.options[item.correctAnswer];
            
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('incorrect-answer-item');
            itemDiv.innerHTML = `
                <p><strong>Сұрақ ${item.id}:</strong> ${item.question}</p>
                <p>Сіздің жауабыңыз: <strong style="color: #dc3545;">${item.userAnswer}) ${userOptionText}</strong></p>
                <p>Дұрыс жауап: <strong style="color: #28a745;">${item.correctAnswer}) ${correctOptionText}</strong></p>
            `;
            incorrectAnswersDiv.appendChild(itemDiv);
        });

    } else {
        // Барлық сұраққа дұрыс жауап берілсе
        incorrectAnswersDiv.innerHTML = '';
        noIncorrectAnswersP.style.display = 'block';
    }

    // Нәтижелер бетін көрсету
    showScreen('results-screen');
}

// Бастапқы бетті жүктеу
window.onload = function() {
    showMainMenu();
};