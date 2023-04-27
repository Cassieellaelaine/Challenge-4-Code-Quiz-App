var quizTimerEl = document.querySelector("#quizTimer");
var quizGameEl = document.querySelector("#jsQuiz");
var theQuestion = document.querySelector("#question");
var theChoices = document.querySelector("#choices");
var startButton = document.querySelector(".start-button");
var introduction = document.querySelector("#intro");


var submit;
var indexQA = 0;
var questions = 0;
var currentQuestion = 0;
var currentScore = 0;
var endScore = 0;
var isCorrect;
var answered = false;
var quizOver = false;
var gameDuration = 0;
var timer = 60;
var timerN;
var timerRun;
var clearTimer = false;
var cleaningList = [];


function init() {
    reset();
}


function reset() {
    quizGameEl.innerHTML = "";
    currentScore = 0;
    gameDuration = 0;
    timerRun = false;
    answered = false;
}


function cleanList() {
    for (let i = 0; i < cleaningList.length; i++) {
        cleaningList[i].remove();
    }
}


function startQuiz() {
    reset();
    questions = [
        {
            question: "Which built-in method combines the text of two strings and returns a new string?",
            choices: ["append()", "concat()", "attach()", "None of the above"],
            answer: "concat()"
        }, {
            question: "What HTML tag does JavaScript go inside?",
            choices: ["<head>", "<script>", "<main>", "<footer>"],
            answer: "<script>"
        }, {
            question: "Which of the following is true about typeof operator in JavaScript?",
            choices: ["The typeof is a unary operator that is placed before its single operand, which can be of any type", "Its value is a string indicating the data type of the operand", "Both of the above", "None of the above"],
            answer: "Both of the above"
        }, {
            question: "Who invented JavaScript?",
            choices: ["Mc Hammer", "Bill Gates", "Elon Musk", "Brendan Eich"],
            answer: "Brendan Eich"
        }, {
            question: "What is JavaScript best known for?",
            choices: ["Static API websites", "Basic header styling", "Dynamic, interactive website experience", "Wasting time"],
            answer: "Dynamic, interactive website experience"
        }, {
            question: "Is JavaScript related to Java?",
            choices: ["Yes, JavaScript is a basic version of Java", "Yes, JavaScript is the foundation of Java", "No, the names are a coincidence", "No, JavaScript obtained its name when Netscape and Sun signed a license agreement"],
            answer: "No, JavaScript obtained its name when Netscape and Sun signed a license agreement"
        }
    ];
    quizOver = false;
    currentScore = 0;
    startButton.disabled = true;
    startButton.style.display = "none";
    introduction.style.display = "none";
    cleanList();
    renderQuestion();
    timerRun = true;
    clearTimer = false;
    isCorrect = false;
    gameDuration = timer;
    startTimer();
}


function startTimer() {
    timerN = setInterval(function () {
        if (gameDuration >= 0 && timerRun && !clearTimer) {
            gameDuration--;
            quizTimerEl.textContent = gameDuration;
        }
        else if (gameDuration <= 0 && timerRun && !clearTimer) {
            clearInterval(timerN);
            cleanList();
            endQuiz();
        }
        if (clearTimer) {
            gameDuration = 0;
            timerRun = false;
            clearInterval(timerN);
        }
    }, 1000);
}


function renderQuestion() {
    indexQA = Math.floor(Math.random() * questions.length);
    currentQuestion = questions[indexQA];

    var questionN = document.createElement("h2");
    questionN.textContent = currentQuestion.question;
    theQuestion.appendChild(questionN);
    cleaningList.push(questionN);

    for (let i = 0; i < currentQuestion.choices.length; i++) {
        var choicesN = document.createElement("li");
        choicesN.setAttribute("id", "choice");
        choicesN.textContent = currentQuestion.choices[i];
        choicesN.addEventListener("click", choiceTaken);
        theChoices.appendChild(choicesN);
        cleaningList.push(choicesN);
    }
    questions = arrayRemoveQuestion(questions, currentQuestion);
    // correct answers
    if (isCorrect && answered) {
        var lineC = document.createElement("hr");
        lineC.setAttribute("id", "line");
        theChoices.appendChild(lineC);
        cleaningList.push(lineC);

        var correct = document.createElement("p");
        correct.setAttribute("id", "correct");
        correct.textContent = "Correct!";
        theChoices.appendChild(correct);
        cleaningList.push(correct);
    }
    // wrong answers
    else if (!isCorrect && answered) {
        var lineW = document.createElement("hr");
        lineW.setAttribute("id", "line");
        theChoices.appendChild(lineW);
        cleaningList.push(lineW);

        var wrong = document.createElement("p");
        wrong.setAttribute("id", "wrong");
        wrong.textContent = "Wrong!";
        theChoices.appendChild(wrong);
        cleaningList.push(wrong);
    }
}


function arrayRemoveQuestion(array, child) {
    return array.filter(function (elements) {
        return elements != child;
    });
}


function answerCorrect(answerGiven) {
    isCorrect;
    answered = true;
    if (answerGiven === currentQuestion.answer) {
        currentScore++;
        isCorrect = true;
    } else {
        isCorrect = false;
        gameDuration -= 10;
    }
    return isCorrect;
}


function choiceTaken(elementFrom) {
    var clickN = elementFrom.target;
    if (gameDuration <= 0) {
        endQuiz();
    } else {
        answerCorrect(clickN.textContent);
        cleanList();
        if (questions.length > 0) {
            renderQuestion();
        } else {
            endQuiz();
        }
    }
}


function viewLeaderboard() {
    cleanList();
    clearTimer = true;
    quizTimerEl.textContent = "";
    startButton.style.display = "none";
    introduction.style.display = "none";

    var storedResults = getResults();
    if (storedResults !== null) {
        var leaderboardHead = document.createElement("h2");
        leaderboardHead.setAttribute("id", "leader-head");
        leaderboardHead.textContent = "Welcome to the leaderboard!";
        theQuestion.appendChild(leaderboardHead);
        cleaningList.push(leaderboardHead);

        for (let i = 0; i < storedResults.length; i++) {
            var entryN = document.createElement("li");
            entryN.setAttribute("id", "lead-scores");
            entryN.textContent = storedResults[i].name + "'s score is " + storedResults[i].score + ".";
            theQuestion.appendChild(entryN);
            cleaningList.push(entryN);
        }
    }

    else {
        var viewResults = document.createElement("h2");
        viewResults.setAttribute("id", "view-results");
        viewResults.textContent = "No scores currently exist! Please take the quiz.";
        theQuestion.appendChild(viewResults);
        cleaningList.push(viewResults);
    }

    var clearBoardBtn = document.createElement("button");
    clearBoardBtn.setAttribute("type", "button");
    clearBoardBtn.setAttribute("id", "clear-button");
    clearBoardBtn.innerHTML = "Clear High Scores";
    theChoices.appendChild(clearBoardBtn);
    clearBoardBtn.addEventListener("click", clearResults);

    var playAgain = document.createElement("button");
    playAgain.setAttribute("type", "button");
    playAgain.setAttribute("id", "again-button");
    playAgain.innerHTML = "Play Again";
    theChoices.appendChild(playAgain);
    playAgain.addEventListener("click", startQuiz);

    cleaningList.push(clearBoardBtn, playAgain);
}


function saveScore() {
    var initials = document.querySelector("#initials").value;
    var storedResults = getResults();
    var leaderboardItem = {
        "name": initials,
        "score": endScore,
    };
    if (storedResults !== null) {
        storedResults.push(leaderboardItem);
    } else {
        storedResults = [leaderboardItem];
    }
    localStorage.setItem("leaderboard", JSON.stringify(storedResults));
    submit.style.display = "none";
    viewLeaderboard();
}


function getResults() {
    var storedScores = JSON.parse(localStorage.getItem("leaderboard"));
    return storedScores;
}


function clearResults() {
    localStorage.setItem("leaderboard", null);
    viewLeaderboard();
}


function endQuiz() {
    quizTimerEl.textContent = "Quiz complete!";
    if (gameDuration < 0) {
        gameDuration = 0;
    }
    endScore = gameDuration * currentScore + currentScore;
    var quizEnd = document.createElement("p");
    quizEnd.setAttribute("id", "the-end");
    quizEnd.innerHTML = "The quiz has ended. <br /> You answered " + currentScore + " questions correctly with " + gameDuration + " seconds left. Your score is " + endScore + ". <br /> Hope you had fun!";
    quizGameEl.appendChild(quizEnd);

    var enterInitials = document.createElement("input");
    enterInitials.setAttribute("type", "text");
    enterInitials.setAttribute("id", "initials");
    enterInitials.setAttribute("placeholder", "Enter your initials");
    theQuestion.appendChild(enterInitials);

    submit = document.createElement("button");
    submit.setAttribute("type", "button");
    submit.setAttribute("id", "submit-button");
    submit.innerHTML = "Submit";
    theQuestion.appendChild(submit);

    var playAgain = document.createElement("button");
    playAgain.setAttribute("type", "button");
    playAgain.setAttribute("id", "again-button");
    playAgain.innerHTML = "Play Again";
    theChoices.appendChild(playAgain);
    playAgain.addEventListener("click", startQuiz);

    timerRun = false;
    answered = false;

    submit.addEventListener("click", saveScore);
    cleaningList.push(submit, enterInitials, quizEnd, playAgain);
}



startButton.addEventListener("click", startQuiz);
init();