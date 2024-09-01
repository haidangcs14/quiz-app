// ________FAKE_DATA_______________
let questions = [
  {
    quiz_id: 1,
    question:
      "You can learn a lot about the local _______ by talking to local people.",
    answers: ["territory", "area", "land", "nation"],
  },
  {
    quiz_id: 2,
    question:
      "It's good to have someone to ________ you when you are visiting a new place.",
    answers: ["lead", "take", "guide", "bring"],
  },
  {
    quiz_id: 3,
    question:
      "When you ______ your destination, your tour guide will meet you at the airport.",
    answers: ["arrive", "reach", "get", "achieve"],
  },
  {
    quiz_id: 4,
    question: "It can be quite busy here during the tourist ______",
    answers: ["season", "phase", "period", "stage"],
  },
  {
    quiz_id: 5,
    question:
      "Make sure you _______ a hotel before you come to our island, especially in the summer.",
    answers: ["book", "keep", "put", "buy"],
  },
  {
    quiz_id: 6,
    question: "Captain Cook discovered Australia on a _______ to the Pacific.",
    answers: ["vacation", "travel", "cruise", "voyage"],
  },
  {
    quiz_id: 7,
    question:
      " Most tourist attractions in London charge an admission ________.",
    answers: ["fare", "ticket", "fee", "pay"],
  },
  {
    quiz_id: 8,
    question: "The hotel where we are _______ is quite luxurious.",
    answers: ["living", "existing", "remaining", "staying"],
  },
  {
    quiz_id: 9,
    question: "Is English an ________ language in your country?",
    answers: ["mother", "official", "living", "old"],
  },
  {
    quiz_id: 10,
    question: "He spoke a ______ of French that we found hard to understand.",
    answers: ["slang", "jargon", "dialect", "language"],
  },
];
const results = [
  {
    quiz_id: 1,
    answer: "area",
  },
  {
    quiz_id: 3,
    answer: "reach",
  },
  {
    quiz_id: 2,
    answer: "guide",
  },
  {
    quiz_id: 4,
    answer: "season",
  },
  {
    quiz_id: 5,
    answer: "book",
  },
  {
    quiz_id: 6,
    answer: "voyage",
  },
  {
    quiz_id: 7,
    answer: "fee",
  },
  {
    quiz_id: 8,
    answer: "staying",
  },
  {
    quiz_id: 9,
    answer: "official",
  },
  {
    quiz_id: 10,
    answer: "dialect",
  },
];

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

let currentIndex = null;
let listSubmit = [];
let listResults = [];
let isSubmit = false;

const quiz = {
  randomQuestion: function () {
    questions = questions.sort(() => Math.random() - Math.random());
    questions.forEach((q) => {
      q.answers = q.answers.sort(() => Math.random() - Math.random());
    });
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

  handleProgress: function () {
    const progressLength = listSubmit.filter((item) => item >= 0);
    const R = quizProgress.getAttribute("r");
    quizProgress.style = `stroke-dasharray: ${
      (2 * Math.PI * R * progressLength.length) / questions.length
    } 99999;`;
    quizProgressText.innerText = `${progressLength.length}/${questions.length}`;
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

  handleSubmit: function () {
    quizSubmit.addEventListener("click", () => {
      const progressLength = listSubmit.filter((item) => item >= 0);
      if (progressLength.length == questions.length) {
        questions.forEach((item, index) => {
          const result = results.find((res) => res.quiz_id === item.quiz_id);
          if (item.answers[listSubmit[index]] === result.answer) {
            listResults[index] = listSubmit[index];
          } else {
            quizQuestions[index].classList.add("incorrect");
            listResults[index] = item.answers.indexOf(result.answer);
          }
        });
        isSubmit = true;
      } else {
        alert("No");
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
  start: function () {
    this.randomQuestion();
    this.render();
    this.handle();
  },
};

quiz.start();
