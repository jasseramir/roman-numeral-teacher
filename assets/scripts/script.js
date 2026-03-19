const numberEl = document.getElementById('number');
const answerEl = document.getElementById('answerInput');
const submitBtn = document.getElementById('submit');
const resetBtn = document.getElementById('reset');
const scoreEl = document.getElementById('score');
const confirmBox = document.getElementById('confirmOverlay');
const confirmYes = document.getElementById('confirmYes');
const confirmNo = document.getElementById('confirmNo');

let score = Number(localStorage.getItem('score')) || 0;
scoreEl.textContent = score;

function toRoman(num) {
    const romanNumerals = [
    ['M', 1000], ['CM', 900], ['D', 500], ['CD', 400], ['C', 100],
    ['XC', 90], ['L', 50], ['XL', 40], ['X', 10], 
    ['IX', 9], ['V', 5], ['IV', 4], ['I', 1]
    ];
    
    let result = '';
    for (const [roman, value] of romanNumerals) {
        while (num >= value) {
            result += roman;
            num -= value;
        }
    }
    return result;
}

function generateQuestion() {
    currentNumber = Math.floor(Math.random() * 3999) + 1;
    numberEl.textContent = toRoman(currentNumber);
}

let currentNumber;
generateQuestion();

let timeId;

function checkAnswer() {
    clearTimeout(timeId);
    answerEl.classList.remove('correct', 'incorrect');
    const answer = answerEl.value;
    if (Number(answer) === currentNumber) {
        score++;
        scoreEl.textContent = score;
        answerEl.value = '';
        generateQuestion();
        
        answerEl.classList.add('correct');
        timeId = setTimeout(() => {
            answerEl.classList.remove('correct');
        }, 500);
    } else {
        if (answer !== '') {
            if (score > 0) {
                score--;
                scoreEl.textContent = score;
                answerEl.value = '';
                generateQuestion();
            } else if (score === 0) {
                answerEl.value = '';
                generateQuestion();
            }
        }
        
        answerEl.classList.add('incorrect');
        timeId = setTimeout(() => {
            answerEl.classList.remove('incorrect');
        }, 500);
        navigator.vibrate?.(200);
    }
    
    localStorage.setItem('score', score);
}

function resetGame() {
    score = 0;
    scoreEl.textContent = score;
    answerEl.value = '';
    generateQuestion();
    confirmBox.classList.remove('is-visible');
    localStorage.setItem('score', score);
}

answerEl.addEventListener('input', () => {
    answerEl.value = answerEl.value.replace(/[^0-9]/g, '');
});

answerEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        checkAnswer();
        answerEl.focus();
    }
});

submitBtn.addEventListener('click', () => {
    checkAnswer();
    answerEl.focus();
});

resetBtn.addEventListener('click', () => {
    confirmBox.classList.add('is-visible');
});

confirmNo.addEventListener('click', () => {
    confirmBox.classList.remove('is-visible');
})

confirmYes.addEventListener('click', resetGame);