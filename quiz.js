const quizQuestions = [
  {
    question: 'Qual é o nome do grupo?',
    options: ['Stray Kids', 'BTS', 'Seventeen'],
    correct: 0,
    explanation: 'Stray Kids é o grupo homenageado nesta fanpage.'
  },
  {
    question: 'Quem é o líder do grupo?',
    options: ['Bang Chan', 'Hyunjin', 'Felix'],
    correct: 0,
    explanation: 'Bang Chan é o líder do Stray Kids.'
  },
  {
    question: 'Qual dessas músicas faz parte do universo do grupo?',
    options: ['Love Dive', "God's Menu", 'How You Like That'],
    correct: 1,
    explanation: "God's Menu é uma música famosa do Stray Kids."
  },
  {
    question: 'Qual membro é conhecido por ter uma presença muito marcante no palco?',
    options: ['Lee Know', 'Hyunjin', 'Changbin'],
    correct: 1,
    explanation: 'Hyunjin é conhecido por sua presença de palco e charme.'
  },
  {
    question: 'Qual é o nome do fandom?',
    options: ['STAY', 'ARMY', 'BLINK'],
    correct: 0,
    explanation: 'STAY é o fandom do Stray Kids.'
  }
];

const questionTitle = document.getElementById('question-title');
const questionOptions = document.getElementById('question-options');
const prevQuestionButton = document.getElementById('prevQuestion');
const nextQuestionButton = document.getElementById('nextQuestion');
const quizSummary = document.getElementById('quizSummary');
const summaryText = document.getElementById('summaryText');
const wrongAnswers = document.getElementById('wrongAnswers');

let currentQuestion = 0;
const answers = Array(quizQuestions.length).fill(null);

function renderQuestion(index) {
  const question = quizQuestions[index];
  questionTitle.textContent = `${index + 1}. ${question.question}`;
  questionOptions.innerHTML = '';

  question.options.forEach((option, optionIndex) => {
    const button = document.createElement('button');
    button.className = 'btn secondary option-button';
    button.textContent = option;
    button.addEventListener('click', () => selectAnswer(optionIndex));

    if (answers[index] === optionIndex) {
      button.classList.add('selected');
    }

    questionOptions.appendChild(button);
  });

  prevQuestionButton.disabled = index === 0;
  nextQuestionButton.textContent = index === quizQuestions.length - 1 ? 'Enviar' : 'Próxima';
}

function selectAnswer(optionIndex) {
  answers[currentQuestion] = optionIndex;
  renderQuestion(currentQuestion);
}

prevQuestionButton.addEventListener('click', () => {
  if (currentQuestion > 0) {
    currentQuestion -= 1;
    renderQuestion(currentQuestion);
  }
});

nextQuestionButton.addEventListener('click', () => {
  if (answers[currentQuestion] === null) {
    alert('Escolha uma resposta antes de continuar.');
    return;
  }

  if (currentQuestion < quizQuestions.length - 1) {
    currentQuestion += 1;
    renderQuestion(currentQuestion);
  } else {
    showSummary();
  }
});

function showSummary() {
  const correctCount = answers.reduce((count, answer, index) => {
    return count + (answer === quizQuestions[index].correct ? 1 : 0);
  }, 0);

  questionTitle.textContent = 'Quiz finalizado';
  questionOptions.innerHTML = '';
  document.querySelector('.quiz-actions').classList.add('hidden');
  quizSummary.classList.remove('hidden');

  summaryText.textContent = `Você acertou ${correctCount} de ${quizQuestions.length} perguntas.`;

  wrongAnswers.innerHTML = '';
  quizQuestions.forEach((question, index) => {
    if (answers[index] !== question.correct) {
      const wrongCard = document.createElement('div');
      wrongCard.className = 'wrong-card';
      wrongCard.innerHTML = `
        <h3>${index + 1}. ${question.question}</h3>
        <p><strong>Sua resposta:</strong> ${question.options[answers[index]] || 'Nenhuma'}</p>
        <p><strong>Resposta certa:</strong> ${question.options[question.correct]}</p>
        <p class="explanation">${question.explanation}</p>
      `;
      wrongAnswers.appendChild(wrongCard);
    }
  });
}

renderQuestion(currentQuestion);
