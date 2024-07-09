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
    let selectedTriviaSet;

    if (triviaSetSelect === 'All') {
        selectedTriviaSet = [];
        for (let set in triviaSets) {
            selectedTriviaSet = selectedTriviaSet.concat(triviaSets[set]);
        }
    } else {
        selectedTriviaSet = triviaSets[triviaSetSelect];
    }

    if (!selectedTriviaSet || selectedTriviaSet.length === 0) {
        alert('Selected trivia set not found or no questions available.');
        return;
    }

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
            const confidence = parseInt(confidenceElement.value, 10);
            const normalizedConfidence = confidence < 50 ? 100 - confidence : confidence;
            const correct = selectedQuestions[i].answer === (confidence > 50);
            userAnswers.push({ confidence: normalizedConfidence, correct });
        } else {
            alert('Please set the confidence levels for all questions.');
            return;
        }
    }
    calculateScore();
}

function calculateScore() {
    let sumOfSquares = 0;
    let confidenceData = {};

    userAnswers.forEach((userAnswer, index) => {
        const { confidence, correct } = userAnswer;
        const error = correct ? (100 - confidence) : confidence;
        sumOfSquares += Math.pow(error, 2);

        if (!confidenceData[confidence]) {
            confidenceData[confidence] = { correct: 0, total: 0 };
        }
        confidenceData[confidence].total += 1;
        if (correct) {
            confidenceData[confidence].correct += 1;
        }
    });

    let accuracyData = [];
    for (let confidence in confidenceData) {
        const accuracy = (confidenceData[confidence].correct / confidenceData[confidence].total) * 100;
        accuracyData.push({ confidence: parseInt(confidence), accuracy });
    }

    accuracyData.sort((a, b) => a.confidence - b.confidence);

    const meanSquaredError = sumOfSquares / userAnswers.length;
    const normalizedScore = meanSquaredError / 10000;  // Normalize score to range 0-1

    console.log('Sum of Squares:', sumOfSquares);
    console.log('Normalized Score:', normalizedScore);
    console.log('Accuracy Data:', accuracyData);

    localStorage.setItem('score', normalizedScore);
    localStorage.setItem('accuracyData', JSON.stringify(accuracyData));
    window.location.href = 'result.html';
}
