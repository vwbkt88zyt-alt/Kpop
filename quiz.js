const questionBank = [
  {
    question: 'Qual é o nome do grupo homenageado neste site?',
    options: ['Stray Kids', 'BTS', 'Seventeen'],
    correct: 0,
    explanation: 'Stray Kids é o grupo homenageado nesta fanpage.'
  },
  {
    question: 'Quem é o líder do Stray Kids?',
    options: ['Bang Chan', 'Hyunjin', 'Felix'],
    correct: 0,
    explanation: 'Bang Chan é o líder do Stray Kids.'
  },
  {
    question: 'Qual é o nome do fandom do Stray Kids?',
    options: ['STAY', 'ARMY', 'BLINK'],
    correct: 0,
    explanation: 'STAY é o nome do fandom do Stray Kids.'
  },
  {
    question: 'Qual dessas músicas é do Stray Kids?',
    options: ["God's Menu", 'Love Dive', 'How You Like That'],
    correct: 0,
    explanation: "God's Menu é uma das músicas mais conhecidas do Stray Kids."
  },
  {
    question: 'Qual destas músicas também é do Stray Kids?',
    options: ['S-Class', 'Dynamite', 'Perfect Night'],
    correct: 0,
    explanation: 'S-Class é uma música do Stray Kids.'
  },
  {
    question: 'Qual música do Stray Kids aparece na playlist do site?',
    options: ['Chk Chk Boom', 'Super Shy', 'Cupid'],
    correct: 0,
    explanation: 'Chk Chk Boom aparece na playlist da fanpage.'
  },
  {
    question: 'Qual dessas opções é uma sigla muito usada para Stray Kids?',
    options: ['SKZ', 'STK', 'SKD'],
    correct: 0,
    explanation: 'SKZ é uma sigla muito usada para Stray Kids.'
  },
  {
    question: 'Quem é conhecido por uma presença de palco muito marcante?',
    options: ['Hyunjin', 'Jisoo', 'Nayeon'],
    correct: 0,
    explanation: 'Hyunjin é lembrado por sua presença de palco e expressão.'
  },
  {
    question: 'Quem no site aparece como rapper e com muita energia?',
    options: ['Changbin', 'Lee Know', 'Felix'],
    correct: 0,
    explanation: 'Changbin aparece no site com energia, talento e presença.'
  },
  {
    question: 'Quem aparece no site como uma alegria contagiante?',
    options: ['Felix', 'Han', 'Bang Chan'],
    correct: 0,
    explanation: 'Felix é descrito como uma alegria contagiante.'
  },
  {
    question: 'Quem aparece no site ligado à criatividade?',
    options: ['Han', 'Lee Know', 'Hyunjin'],
    correct: 0,
    explanation: 'Han aparece no site com criatividade e voz marcante.'
  },
  {
    question: 'Qual integrante aparece no site com estilo marcante e performance de impacto?',
    options: ['Lee Know', 'Bang Chan', 'Changbin'],
    correct: 0,
    explanation: 'Lee Know é descrito com estilo marcante e performance cheia de impacto.'
  },
  {
    question: 'Qual dessas idols aparece na seção K-popers famosas?',
    options: ['Jennie', 'Jungkook', 'RM'],
    correct: 0,
    explanation: 'Jennie aparece na seção K-popers famosas.'
  },
  {
    question: 'Lisa aparece no site associada a qual grupo?',
    options: ['BLACKPINK', 'TWICE', 'aespa'],
    correct: 0,
    explanation: 'Lisa aparece com a tag BLACKPINK.'
  },
  {
    question: 'Karina aparece no site associada a qual grupo?',
    options: ['aespa', 'BLACKPINK', 'IVE'],
    correct: 0,
    explanation: 'Karina aparece com a tag aespa.'
  },
  {
    question: 'Nayeon aparece no site associada a qual grupo?',
    options: ['TWICE', 'NewJeans', 'Red Velvet'],
    correct: 0,
    explanation: 'Nayeon aparece com a tag TWICE.'
  },
  {
    question: 'IU aparece no site como que tipo de artista?',
    options: ['Solo', 'BLACKPINK', 'STAY'],
    correct: 0,
    explanation: 'IU aparece com a tag Solo.'
  },
  {
    question: 'Qual dessas músicas combina com a vibe forte do Stray Kids?',
    options: ['Maniac', 'Bubble Gum', 'Seven'],
    correct: 0,
    explanation: 'Maniac é uma música do Stray Kids com conceito marcante.'
  },
  {
    question: 'Qual destas músicas do Stray Kids está listada no site?',
    options: ['LALALALA', 'ETA', 'Drama'],
    correct: 0,
    explanation: 'LALALALA aparece na playlist da fanpage.'
  },
  {
    question: 'Qual é uma mensagem carinhosa para as STAYs no site?',
    options: ['Amar, apoiar e crescer junto', 'Ficar longe do grupo', 'Ignorar as músicas'],
    correct: 0,
    explanation: 'O site celebra o carinho e o apoio das STAYs.'
  }
];

const questionsPerRound = 10;
const autoAdvanceDelay = 650;

const questionCard = document.getElementById('question-card');
const questionProgress = document.getElementById('quizProgress');
const questionTitle = document.getElementById('question-title');
const questionOptions = document.getElementById('question-options');
const prevQuestionButton = document.getElementById('prevQuestion');
const restartQuizButton = document.getElementById('restartQuiz');
const quizSummary = document.getElementById('quizSummary');
const summaryText = document.getElementById('summaryText');
const wrongAnswers = document.getElementById('wrongAnswers');

let quizQuestions = [];
let answers = [];
let currentQuestion = 0;
let advanceTimer = null;

function shuffleItems(items) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
}

function shuffleQuestionOptions(question) {
  const shuffledOptions = shuffleItems(
    question.options.map((option, index) => ({
      label: option,
      isCorrect: index === question.correct
    }))
  );

  return {
    ...question,
    options: shuffledOptions.map((option) => option.label),
    correct: shuffledOptions.findIndex((option) => option.isCorrect)
  };
}

function buildRound() {
  return shuffleItems(questionBank)
    .slice(0, questionsPerRound)
    .map(shuffleQuestionOptions);
}

function clearAdvanceTimer() {
  if (advanceTimer) {
    clearTimeout(advanceTimer);
    advanceTimer = null;
  }
}

function renderQuestion(index) {
  const question = quizQuestions[index];

  questionProgress.textContent = `Pergunta ${index + 1} de ${quizQuestions.length}`;
  questionTitle.textContent = question.question;
  questionOptions.innerHTML = '';

  question.options.forEach((option, optionIndex) => {
    const button = document.createElement('button');
    button.className = 'btn secondary option-button';
    button.type = 'button';
    button.textContent = option;
    button.setAttribute('aria-pressed', answers[index] === optionIndex ? 'true' : 'false');
    button.addEventListener('click', () => selectAnswer(optionIndex));

    if (answers[index] === optionIndex) {
      button.classList.add('selected');
    }

    questionOptions.appendChild(button);
  });

  prevQuestionButton.disabled = index === 0;
}

function goToNextStep() {
  if (currentQuestion < quizQuestions.length - 1) {
    currentQuestion += 1;
    renderQuestion(currentQuestion);
    return;
  }

  showSummary();
}

function selectAnswer(optionIndex) {
  answers[currentQuestion] = optionIndex;
  renderQuestion(currentQuestion);
  clearAdvanceTimer();
  advanceTimer = setTimeout(goToNextStep, autoAdvanceDelay);
}

function showSummary() {
  clearAdvanceTimer();

  const correctCount = answers.reduce((count, answer, index) => {
    return count + (answer === quizQuestions[index].correct ? 1 : 0);
  }, 0);

  questionCard.classList.add('hidden');
  quizSummary.classList.remove('hidden');
  summaryText.textContent = `Você acertou ${correctCount} de ${quizQuestions.length} perguntas.`;
  wrongAnswers.innerHTML = '';

  quizQuestions.forEach((question, index) => {
    if (answers[index] !== question.correct) {
      const wrongCard = document.createElement('div');
      const title = document.createElement('h3');
      const userAnswer = document.createElement('p');
      const correctAnswer = document.createElement('p');
      const explanation = document.createElement('p');

      wrongCard.className = 'wrong-card';
      title.textContent = `${index + 1}. ${question.question}`;
      userAnswer.append(createStrongLabel('Sua resposta:'), ` ${question.options[answers[index]] || 'Nenhuma'}`);
      correctAnswer.append(createStrongLabel('Resposta certa:'), ` ${question.options[question.correct]}`);
      explanation.className = 'explanation';
      explanation.textContent = question.explanation;

      wrongCard.append(title, userAnswer, correctAnswer, explanation);
      wrongAnswers.appendChild(wrongCard);
    }
  });

  if (!wrongAnswers.children.length) {
    const perfectScore = document.createElement('p');
    perfectScore.className = 'perfect-score';
    perfectScore.textContent = 'Você acertou tudo. Arrasou demais!';
    wrongAnswers.appendChild(perfectScore);
  }
}

function createStrongLabel(text) {
  const label = document.createElement('strong');
  label.textContent = text;
  return label;
}

function startQuiz() {
  clearAdvanceTimer();
  quizQuestions = buildRound();
  answers = Array(quizQuestions.length).fill(null);
  currentQuestion = 0;
  questionCard.classList.remove('hidden');
  quizSummary.classList.add('hidden');
  renderQuestion(currentQuestion);
}

prevQuestionButton.addEventListener('click', () => {
  clearAdvanceTimer();

  if (currentQuestion > 0) {
    currentQuestion -= 1;
    renderQuestion(currentQuestion);
  }
});

restartQuizButton.addEventListener('click', startQuiz);

startQuiz();
