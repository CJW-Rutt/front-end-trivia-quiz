import {
  formSetup,
  quizUI,
  timerDisplay,
  questionUI,
  resultUI,
  scoreUI,
  incorrectAnswers,
  replay,
  firstNameInput,
  lastNameInput,
} from "./dom.js";

export let questionIndex = 0;
export let rightAnswers = 0;
export let quizTimer;
export let quizQuestions;
export let completedQuestions = [];
export let firstName;
export let lastName;
import { sendQuizResults } from "./api.js";

export function initQuiz(questions) {
  firstName = firstNameInput.value;
  lastName = lastNameInput.value;
  quizQuestions = questions;
  questionIndex = 0;
  rightAnswers = 0;
  displayNextQuestion();
  startCountdown();
}

export function displayNextQuestion() {
  if (questionIndex < 10) {
    const currentQuestion = quizQuestions[questionIndex];
    questionUI.innerHTML = `<h2>${currentQuestion.question}</h2><ol>${currentQuestion.options
      .map(
        (choice, idx) =>
          `<li data-choice-index="${idx}" class="choice-row">${choice}</li>`
      )
      .join("")}</ol>`;

    questionUI.querySelectorAll("li").forEach((item) => {
      item.addEventListener("click", (event) => {
        const correct =
          event.currentTarget.dataset.choiceIndex == currentQuestion.correctAnswerIndex;
        if (correct) {
          rightAnswers++;
        }
        completedQuestions.push({
          question: currentQuestion.question,
          selected: event.currentTarget.textContent,
          rightAnswer: currentQuestion.options[currentQuestion.correctAnswerIndex],
          correct,
        });

        displayNextQuestion();
      });
    });
    questionIndex++;
  } else {
    finishQuiz();
  }
}

export function startCountdown() {
  let remainingTime = 300;
  quizTimer = setInterval(() => {
    remainingTime--;

    const mins = Math.floor(remainingTime / 60);
    const secs = remainingTime % 60;

    timerDisplay.textContent = `Time remaining: ${mins}:${secs
      .toString()
      .padStart(2, "0")}`;

    if (remainingTime === 0) {
      clearInterval(quizTimer);
      alert("Time has expired!");
      finishQuiz();
    }
  }, 1000);
}

function finishQuiz() {
  clearInterval(quizTimer);
  if (questionIndex < 10) {
    scoreUI.textContent = `You didn't answer all questions in time!`;
  } else if (questionIndex === 10) {
    scoreUI.textContent = `Your final score is ${rightAnswers} out of 10. WOW GREAT!`;
  }

  incorrectAnswers.innerHTML = completedQuestions
    .map((item) => {
      const result = item.correct ? "Right!" : "WRONG!";
      const color = item.correct ? "green" : "red";
      return `<li>${item.question} <br> Your answer is: ${item.selected} <span style="color:${color}">(${result})</span><br> Correct Answer: ${item.rightAnswer}</li>`;
    })
    .join("");

  const quizData = {
    webAppId: "d74c4d21-e60b-4c6b-80b8-4505896c39bd",
    dateOfQuiz: new Date().toISOString().split("T")[0],
    timeOfQuiz: new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    }),
    numberOfQuestionsInQuiz: 10,
    score: rightAnswers,
    name: `${firstName} ${lastName}`,
  };

  sendQuizResults(quizData)
    .then((response) => {
      console.log("Quiz results sent successfully:", response);
    })
    .catch((error) => {
      console.error("Failed to send quiz results:", error);
    });

  quizUI.classList.add("hidden");
  resultUI.classList.remove("hidden");
}

replay.addEventListener("click", () => {
  completedQuestions = []
  resultUI.classList.add("hidden");
  formSetup.classList.remove("hidden");
});
