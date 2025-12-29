// Question, options & Answer
const questions = [
  {
    question: "इस क्विज़ एप्लिकेशन प्रोजेक्ट को आप लोगो ने कैसे पूरा किया?",
    options: [
      "ChatGPT से ",
      "थोड़ा ChatGpt+थोड़ा अपने से",
      "केशव सर को कॉल करके",
      "थोड़े दोस्त से हेल्प लेकर",
    ],
    answer: 1,
  },
  {
    question: "पिछला प्रोजेक्ट आप लोगो ने पूरा कर लिया है?",
    options: [
      "अभी आधा ही हुआ है। 😉",
      "पूरा हो गया है। 😎",
      "लैपटॉप हॉस्टल में भूल गए हैं। 😅",
      "मेरे पास लैपटॉप नहीं है। 😥",
    ],
    answer: 1,
  },
  {
    question: "अभी तक आप लोगों का इंटर्नशिप कैसा जा रहा है?",
    options: [
      "बहुत अच्छा जा रहा है।😎",
      "दो फुट ऊपर से जा रहा है😉",
      "कुछ हवा ही नहीं लग रही है😥",
      "कुछ ज्यादा ही तूफान पढ़ा रहे हैं सर।😅",
    ],
    answer: 3,
  },
  {
    question: "ये सर्दी आप लोगों का कैसा जा रहा है?",
    options: [
      "बस किसी तरह।",
      "कंबल में रील्स देखते हुए",
      "ठंड में प्रोजेक्ट बनाने का मन नहीं कर रहा है",
      "भगवान भरोसे",
    ],
    answer: 3,
  },
  {
    question: "ये नया साल आप लोग कैसे मनाने वाले हो?",
    options: [
      "दोस्तों के साथ पार्टी करके। 🥳",
      "घर पर ही किसी तरह 😥",
      "मस्त पिकनिक मनाएंगे😎",
      "केशव सर प्रोजेक्ट से फुर्सत दे तभी तो😉",
    ],
    answer: 2,
  },
];

let currentIndex = 0;
let score = 0;
let timer = 30;
let timerId = null;
let selectedAnswers = {};
let highScore = localStorage.getItem("quizHighScore") || 0;

// DOM Query
const elements = {
  questionCounter: document.getElementById("questionCounter"),
  questionText: document.getElementById("questionText"),
  timer: document.getElementById("timer"),
  optionsBox: document.getElementById("optionsBox"),
  prevBtn: document.getElementById("prevBtn"),
  nextBtn: document.getElementById("nextBtn"),
  quizBox: document.getElementById("quizBox"),
  resultScreen: document.getElementById("resultScreen"),
  scoreText: document.getElementById("scoreText"),
  highScoreText: document.getElementById("highScoreText"),
  restartBtn: document.getElementById("restartBtn"),
  progressBar: document.getElementById("progressBar"),
};

// load Question function
function loadQuestion() {
  const q = questions[currentIndex];


  // Update counter and question
  elements.questionCounter.textContent = `Question ${currentIndex + 1} / ${questions.length}`;
  elements.questionText.textContent = q.question;


  // Update progress bar
  const progress = ((currentIndex + 1) / questions.length) * 100;
  elements.progressBar.style.width = progress + "%";


  // Clear and create options
  elements.optionsBox.innerHTML = "";
  q.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = option;


    // Highlight previously selected answer
    if (selectedAnswers[currentIndex] === index) {
      btn.classList.add("selected");
    }

    // CLICK HANDLER 
    btn.addEventListener("click", () => {
      
      document.querySelectorAll('.option-btn').forEach(b => {
        b.classList.remove('selected');
      });
      // Select current answer + save answer
      btn.classList.add('selected');
      selectedAnswers[currentIndex] = index;
    });
    elements.optionsBox.appendChild(btn);
  }); 

  // next & prev button state
  elements.prevBtn.disabled = currentIndex === 0;
  elements.nextBtn.textContent = currentIndex === questions.length - 1 ? "Finish 🎯" : "Next ➡️";
}

function startTimer() {
  clearInterval(timerId);
  const questionTimes = Array(questions.length).fill(10);

  timer = questionTimes[currentIndex] || 30;
  elements.timer.textContent = timer;
  timerId = setInterval(() => {
    timer--;
    elements.timer.textContent = timer;
    if (timer <= 0) {
      clearInterval(timerId);
      nextQuestion(true);
    }
  }, 1000);
}


function nextQuestion(fromTimer = false) {
  if (fromTimer) {
    if (currentIndex < questions.length - 1) {
      currentIndex++;
      loadQuestion();
      startTimer();
    } else {
      endQuiz();
    }
    return;
  }

  if (currentIndex === questions.length - 1) {
    endQuiz();
    return;
  }

  currentIndex++;
  loadQuestion();
  startTimer();
}

function prevQuestion() {
  if (currentIndex > 0) {
    currentIndex--;
    loadQuestion();
    startTimer();
  }
}


// Calculate final score
function calculateScore() {
  score = 0;
  questions.forEach((q, index) => {
    if (selectedAnswers[index] === q.answer) {
      score++;
    }
  });
}


// Show results
function endQuiz() {
  clearInterval(timerId);
  calculateScore();

  elements.quizBox.style.display = "none";
  elements.resultScreen.style.display = "block";

  elements.scoreText.textContent = `${score}/${questions.length}`;

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("quizHighScore", highScore);
  }
  elements.highScoreText.textContent = `High Score: ${highScore}/${questions.length}`;
}

// Restart quiz
function restartQuiz() {
  currentIndex = 0;
  score = 0;
  timer = 30;
  selectedAnswers = {};
  elements.quizBox.style.display = "block";
  elements.resultScreen.style.display = "none";
  loadQuestion();
  startTimer();
}

// Event
elements.prevBtn.addEventListener("click", prevQuestion);
elements.nextBtn.addEventListener("click", () => nextQuestion(false));
elements.restartBtn.addEventListener("click", restartQuiz);

// Restart call
loadQuestion();
startTimer();
