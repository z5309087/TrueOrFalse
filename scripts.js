const questions = [
    { question: "The sky is blue.", answer: true },
    { question: "Cats can fly.", answer: false },
    { question: "2+2 equals 4.", answer: true },
    { question: "The earth is flat.", answer: false },
    { question: "Water freezes at 0 degrees Celsius.", answer: true },
    { question: "The sun rises in the west.", answer: false },
    { question: "Humans have walked on the moon.", answer: true },
    { question: "Sharks are mammals.", answer: false },
    { question: "Gold is a metal.", answer: true },
    { question: "Penguins can fly.", answer: false },
    { question: "Light travels faster than sound.", answer: true },
    { question: "Bats are blind.", answer: false },
    { question: "The Great Wall of China is visible from space.", answer: false },
    { question: "Venus is the closest planet to the sun.", answer: false },
    { question: "Electric cars are powered by gasoline.", answer: false },
    { question: "Sound travels in waves.", answer: true },
    { question: "The human body has four lungs.", answer: false },
    { question: "Mount Everest is the highest mountain on Earth.", answer: true },
    { question: "The Pacific Ocean is the largest ocean on Earth.", answer: true },
    { question: "There are 26 letters in the English alphabet.", answer: true }
];

let userAnswers = [];
let selectedQuestions = [];

function startGame() {
    const questionCountInput = document.getElementById('questionCountInput');
    const questionCount = parseInt(questionCountInput.value, 10);
    if (isNaN(questionCount) || questionCount <= 0) {
        alert('Please enter a valid number of questions.');
        return;
    }

    document.getElementById('questionCountInput').style.display = 'none';
    document.getElementById('startButton').style.display = 'none';
    document.getElementById('title').innerText = 'Trivia Questions';

    const container = document.getElementById('questionsContainer');
    container.innerHTML = '';
    selectedQuestions = [];
    for (let i = 0; i < questionCount; i++) {
        const question = questions[Math.floor(Math.random() * questions.length)];
        selectedQuestions.push(question); // Store the selected questions
        const questionHTML = `
            <div>
                <p>${question.question}</p>
                <label for="confidence${i}">What is the probability that this statement is true? (0-100%)</label>
                <input type="range" id="confidence${i}" name="confidence" min="0" max="100" value="50" oninput="document.getElementById('confidenceValue${i}').innerText = this.value + '%'">
                <span id="confidenceValue${i}">50%</span>
            </div>
        `;
        container.innerHTML += questionHTML;
    }
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
    localStorage.setItem('score', meanSquaredError);
    window.location.href = 'result.html';
}
