class QuizApp {
    constructor() {
        this.questions = [
            {
                question: "What is the capital of France?",
                options: ["London", "Berlin", "Paris", "Madrid"],
                correctAnswer: "Paris"
            },
            {
                question: "Which planet is known as the Red Planet?",
                options: ["Venus", "Mars", "Jupiter", "Saturn"],
                correctAnswer: "Mars"
            },
            {
                question: "What is 7 × 8?",
                options: ["54", "56", "62", "64"],
                correctAnswer: "56"
            },
            {
                question: "Who painted the Mona Lisa?",
                options: ["Van Gogh", "Da Vinci", "Picasso", "Rembrandt"],
                correctAnswer: "Da Vinci"
            },
            {
                question: "What is the largest mammal in the world?",
                options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
                correctAnswer: "Blue Whale"
            }
        ];
        
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.timeLeft = 60;
        this.timerInterval = null;
        this.userAnswers = [];

        this.initializeDOM();
        this.initializeEventListeners();
    }

    initializeDOM() {
        // Ensure all necessary DOM elements are selected
        this.quizScreen = document.getElementById('quiz-screen');
        this.resultScreen = document.getElementById('result-screen');
        this.reviewScreen = document.getElementById('review-screen');
        this.reviewContainer = document.getElementById('review-questions-container');
        this.questionText = document.getElementById('question-text');
        this.answerOptions = document.getElementById('answer-options');
        this.currentScoreElement = document.getElementById('current-score');
        this.timerElement = document.getElementById('timer');
        this.finalScoreElement = document.getElementById('final-score');

        this.restartBtn = document.getElementById('restart-btn');
        this.reviewBtn = document.getElementById('review-btn');
        this.backToResultBtn = document.getElementById('back-to-result-btn');
    }

    initializeEventListeners() {
        // Ensure event listeners are properly set up
        if (this.restartBtn) {
            this.restartBtn.addEventListener('click', () => this.restartQuiz());
        }

        if (this.reviewBtn) {
            this.reviewBtn.addEventListener('click', () => this.showReviewScreen());
        }

        if (this.backToResultBtn) {
            this.backToResultBtn.addEventListener('click', () => this.backToResultScreen());
        }
        
        this.loadQuestion();
        this.startTimer();
    }

    loadQuestion() {
        // Check if we've reached the end of questions
        if (this.currentQuestionIndex >= this.questions.length) {
            this.showResultScreen();
            return;
        }

        const currentQuestion = this.questions[this.currentQuestionIndex];
        this.questionText.textContent = currentQuestion.question;
        
        // Clear previous options
        this.answerOptions.innerHTML = '';

        // Shuffle and create answer buttons
        const shuffledOptions = [...currentQuestion.options].sort(() => Math.random() - 0.5);
        shuffledOptions.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.classList.add('answer-btn');
            button.addEventListener('click', () => this.checkAnswer(option));
            this.answerOptions.appendChild(button);
        });
    }

    checkAnswer(selectedOption) {
        const currentQuestion = this.questions[this.currentQuestionIndex];
        const buttons = document.querySelectorAll('.answer-btn');
        
        // Store user's answer
        this.userAnswers.push({
            question: currentQuestion.question,
            selectedAnswer: selectedOption,
            correctAnswer: currentQuestion.correctAnswer
        });

        buttons.forEach(button => {
            button.disabled = true;
            if (button.textContent === currentQuestion.correctAnswer) {
                button.classList.add('correct');
            }
            
            if (button.textContent === selectedOption && selectedOption !== currentQuestion.correctAnswer) {
                button.classList.add('incorrect');
            }
        });

        // Update score if answer is correct
        if (selectedOption === currentQuestion.correctAnswer) {
            this.score++;
            this.currentScoreElement.textContent = this.score;
        }

        // Move to next question
        setTimeout(() => {
            this.currentQuestionIndex++;
            this.loadQuestion();
        }, 1000);
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.timerElement.textContent = this.timeLeft;

            if (this.timeLeft <= 0) {
                clearInterval(this.timerInterval);
                this.showResultScreen();
            }
        }, 1000);
    }

    showResultScreen() {
        // Stop the timer
        clearInterval(this.timerInterval);

        // Hide quiz screen and show result screen
        this.quizScreen.classList.add('hidden');
        this.resultScreen.classList.remove('hidden');

        // Display final score
        this.finalScoreElement.textContent = `${this.score} / ${this.questions.length}`;
    }

    showReviewScreen() {
        // Ensure review container exists
        if (!this.reviewContainer) return;

        // Hide result screen and show review screen
        this.resultScreen.classList.add('hidden');
        this.reviewScreen.classList.remove('hidden');

        // Clear previous review content
        this.reviewContainer.innerHTML = '';

        // Create review items for each question
        this.userAnswers.forEach((answer, index) => {
            const reviewItem = document.createElement('div');
            reviewItem.classList.add('review-item');
            
            // Determine if the answer was correct
            const isCorrect = answer.selectedAnswer === answer.correctAnswer;
            
            reviewItem.innerHTML = `
                <h3>Question ${index + 1}</h3>
                <p><strong>Question:</strong> ${answer.question}</p>
                <p><strong>Your Answer:</strong> 
                    <span class="${isCorrect ? 'correct' : 'incorrect'}">
                        ${answer.selectedAnswer}
                    </span>
                </p>
                <p><strong>Correct Answer:</strong> ${answer.correctAnswer}</p>
            `;

            this.reviewContainer.appendChild(reviewItem);
        });
    }

    backToResultScreen() {
        // Hide review screen and show result screen
        this.reviewScreen.classList.add('hidden');
        this.resultScreen.classList.remove('hidden');
    }

    restartQuiz() {
        // Reset all quiz state
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.timeLeft = 60;
        this.userAnswers = [];
        
        // Reset UI elements
        this.currentScoreElement.textContent = '0';
        this.timerElement.textContent = '60';

        // Show quiz screen, hide others
        this.quizScreen.classList.remove('hidden');
        this.resultScreen.classList.add('hidden');
        this.reviewScreen.classList.add('hidden');
        
        // Restart quiz
        this.loadQuestion();
        this.startTimer();
    }
}

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new QuizApp();
});