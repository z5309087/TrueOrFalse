let triviaSets = {};
let userAnswers = [];
let selectedQuestions = [];

document.addEventListener('DOMContentLoaded', () => {
    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            triviaSets = data;
        })
        .catch(error => console.error('Error loading questions:', error));
});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startGame() {
    const triviaSetSelect = document.getElementById('triviaSetSelect').value;
    const selectedTriviaSet = triviaSets[triviaSetSelect];

    const questionCountInput = document.getElementById('questionCountInput');
    const questionCount = parseInt(questionCountInput.value, 10);
    if (isNaN(questionCount) || questionCount <= 0 || questionCount > selectedTriviaSet.length) {
        alert(`Please enter a valid number of questions (1-${selectedTriviaSet.length}).`);
        return;
    }

    document.getElementById('triviaSetSelect').style.display = 'none';
    document.getElementById('questionCountInput').style.display = 'none';
    document.getElementById('startButton').style.display = 'none';
    document.getElementById('title').innerText = 'Trivia Questions';
    document.getElementById('sliderExplanation').style.display = 'block';

    shuffleArray(selectedTriviaSet);
    selectedQuestions = selectedTriviaSet.slice(0, questionCount);

    const container = document.getElementById('questionsContainer');
    container.innerHTML = '';
    selectedQuestions.forEach((question, i) => {
        const questionHTML = `
            <div>
                <p>${question.question}</p>
                <input type="range" id="confidence${i}" name="confidence" min="0" max="100" value="50" oninput="document.getElementById('confidenceValue${i}').innerText = this.value + '%'">
                <span id="confidenceValue${i}">50%</span>
            </div>
        `;
        container.innerHTML += questionHTML;
    });

    document.getElementById('submitAnswers').style.display = 'block';
}

function submitAnswers() {
    userAnswers = [];
    for (let i = 0; i < selectedQuestions.length; i++) {
        const confidenceElement = document.getElementById(`confidence${i}`);
        if (confidenceElement) {
            const confidence = confidenceElement.value;
            userAnswers.push({ confidence: parseInt(confidence, 10) });
        } else {
            alert('Please set the confidence levels for all questions.');
            return;
        }
    }
    calculateScore();
}

function calculateScore() {
    let sumOfSquares = 0;
    userAnswers.forEach((userAnswer, index) => {
        const correctAnswer = selectedQuestions[index].answer;
        const error = correctAnswer ? (100 - userAnswer.confidence) : userAnswer.confidence;
        sumOfSquares += Math.pow(error, 2);
    });
    const meanSquaredError = sumOfSquares / userAnswers.length;
    const normalizedScore = meanSquaredError / 10000;
    localStorage.setItem('score', normalizedScore);
    window.location.href = 'result.html';
}
