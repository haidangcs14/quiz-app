const API_GET_QUESTIONS =
  "https://script.google.com/macros/s/AKfycby1nEDDlcaMn2hbKh5Ry0ZPZz3AKui76Vz-xLqMxo6chlx3S9zNkLuciEaUlDi-LSxu/exec";

const quizTimer = document.querySelector("#timmer");
const quizProgress = document.querySelector("#progress");
const quizProgressText = document.querySelector("#progress-text");
const quizSubmit = document.querySelector("#quiz-submit");
const quizPrev = document.querySelector("#quiz-prev");
const quizNext = document.querySelector("#quiz-next");
const quizCount = document.querySelector(".quiz-question h5");
const quizAnswers = document.querySelectorAll(".quiz-question ul li");
let quizQuestions = document.querySelectorAll(".quiz-numbers ul li");
const quizQuestionList = document.querySelector(".quiz-numbers ul");
const quizAnswersItem = document.querySelectorAll(".quiz-answer-item");
const quizTitle = document.querySelector("#quiz-title");

let questions;
let results;
let currentIndex = null;
let listSubmit = [];
let listResults = [];
let isSubmit = false;

function shuffle(arr) {
  return (arr = arr.sort(() => Math.random() - Math.random()));
}

const quiz = {
  randomQuestion: function () {
    questions = shuffle(questions);
    questions.forEach((q) => {
      q.answers = shuffle(q.answers);
    });
  },

  getQuestions: async function () {
    const res = await fetch(`${API_GET_QUESTIONS}?category=english`);
    const data = await res.json();
    questions = data;
    console.log(questions);
  },

  getResults: async function () {
    quizSubmit.innerText = "Submitting...";
    const postData = {
      category: "english",
      questions: questions,
    };
    try {
      const response = await fetch(API_GET_QUESTIONS, {
        method: "POST",
        body: JSON.stringify(postData),
      });
      const results = await response.json();
      console.log(results);
      this.handleCheckResults(results);
      quizSubmit.innerText = "Result";
      quizSubmit.style = "pointer-events:none";
    } catch (error) {
      alert("An error has occurred!");
    }
  },

  handleQuestionList: function () {
    quizQuestions.forEach((item, index) => {
      item.addEventListener("click", () => {
        item.scrollIntoView({
          behavior: "smooth",
          inline: "center",
        });
        quizQuestions.forEach((item) => {
          item.classList.remove("active");
        });
        item.classList.add("active");
        currentIndex = index;
        this.renderCurrentQuestion();
        const selected = listSubmit[currentIndex];
        quizAnswers.forEach((item) => {
          item.classList.remove("active");
        });
        selected >= 0 && quizAnswers[selected].click();
        if (isSubmit) {
          this.renderResults();
        }
      });
    });
    quizQuestions[0].click();
  },

  handleAnswer: function () {
    quizAnswers.forEach((answer, index) => {
      answer.addEventListener("click", () => {
        if (isSubmit) return;
        quizAnswers.forEach((item) => {
          item.classList.remove("active");
        });
        answer.classList.add("active");
        quizQuestions[currentIndex].classList.add("selected");
        listSubmit[currentIndex] = index;
        this.handleProgress();
      });
    });
  },

  renderCurrentQuestion: function () {
    quizCount.innerText = `Question ${currentIndex + 1} of ${questions.length}`;
    quizTitle.innerText = questions[currentIndex].question;
    quizAnswersItem.forEach((answer, index) => {
      answer.innerText = questions[currentIndex].answers[index];
    });
  },

  renderQuestionList: function () {
    let render = "";
    questions.forEach((question, index) => {
      render += `<li>${index + 1}</li>`;
    });
    quizQuestionList.innerHTML = render;
    quizQuestions = document.querySelectorAll(".quiz-numbers ul li");
  },

  renderProgress: function () {
    quizProgress.style = `stroke-dasharray: 0 99999;`;
    quizProgressText.innerText = `0/${questions.length}`;
  },

  handleProgress: function (correct) {
    const progressLength = listSubmit.filter((item) => item >= 0);
    const R = quizProgress.getAttribute("r");
    if (!isSubmit) {
      quizProgress.style = `stroke-dasharray: ${
        (2 * Math.PI * R * progressLength.length) / questions.length
      } 99999;`;
      quizProgressText.innerText = `${progressLength.length}/${questions.length}`;
    } else {
      quizProgress.style = `stroke-dasharray: ${
        (2 * Math.PI * R * correct) / questions.length
      } 99999;`;
      quizProgressText.innerText = `${correct}/${questions.length}`;
    }
  },

  handleNext: function () {
    quizNext.addEventListener("click", () => {
      ++currentIndex;
      if (currentIndex > questions.length - 1) {
        currentIndex = 0;
      }
      quizQuestions[currentIndex].click();
    });
  },

  handlePrev: function () {
    quizPrev.addEventListener("click", () => {
      --currentIndex;
      if (currentIndex < 0) {
        currentIndex = questions.length - 1;
      }
      quizQuestions[currentIndex].click();
    });
  },

  renderResults: function () {
    if (listResults[currentIndex] === listSubmit[currentIndex]) {
      quizAnswers.forEach((item) => {
        item.classList.remove("incorrect");
      });

      quizAnswers[listResults[currentIndex]].classList.add("active");
    } else {
      quizAnswers.forEach((item) => {
        item.classList.remove("active");
        item.classList.remove("incorrect");
      });

      quizAnswers[listResults[currentIndex]].classList.add("active");
      quizAnswers[listSubmit[currentIndex]].classList.add("incorrect");
    }
  },

  handleCheckResults: function (results) {
    let correct = 0;
    questions.forEach((item, index) => {
      const result = results.find((r) => r.quiz_id === item.quiz_id);
      if (item.answers[listSubmit[index]] === result.answer) {
        listResults[index] = listSubmit[index];
        correct++;
      } else {
        quizQuestions[index].classList.add("incorrect");
        listResults[index] = item.answers.indexOf(result.answer);
      }
    });
    isSubmit = true;
    this.handleProgress(correct);
    quizQuestions[0].click();
  },

  handleSubmit: function () {
    quizSubmit.addEventListener("click", () => {
      const progressLen = listSubmit.filter((item) => item >= 0);
      if (progressLen.length === questions.length) {
        console.log(listSubmit);
        this.getResults();
      } else {
        alert("You have not selected all the answers! Try again!");
      }
    });
  },

  handleKeyDown: function () {
    document.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowLeft":
          quizPrev.click();
          break;
        case "ArrowRight":
          quizNext.click();
          break;
        default:
          return false;
      }
    });
  },

  renderTimer: function () {
    var timer = 15 * 60;
    let _this = this;
    var countdownElement = document.getElementById("timer");

    function updateTimer() {
      var minutes = Math.floor(timer / 60);
      var seconds = timer % 60;

      var timerString =
        (minutes < 10 ? "0" : "") +
        minutes +
        ":" +
        (seconds < 10 ? "0" : "") +
        seconds;

      countdownElement.innerHTML = timerString;

      timer--;
      if (timer < 0) {
        countdownElement.innerHTML = "Time out!";
        _this.handleCheckResults();
      }
      if (isSubmit) {
        clearInterval(intervalId);
      }
    }

    var intervalId = setInterval(updateTimer, 1000);
  },

  render: function () {
    this.renderQuestionList();
    this.renderProgress();
    this.renderTimer();
  },
  handle: function () {
    this.handleQuestionList();
    this.handleAnswer();
    this.handleNext();
    this.handlePrev();
    this.handleKeyDown();
    this.handleSubmit();
  },
  start: async function () {
    await this.getQuestions();
    this.randomQuestion();
    this.render();
    this.handle();
  },
};

quiz.start();
