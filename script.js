const revealElements = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.2 }
);

revealElements.forEach((element) => observer.observe(element));

document.getElementById('year').textContent = new Date().getFullYear();

const quizCards = document.querySelectorAll('.quiz-card');
const quizButton = document.getElementById('quizButton');
const quizResult = document.getElementById('quizResult');
const optionButtons = document.querySelectorAll('.option');
const startQuizButton = document.getElementById('startQuiz');
const quizGrid = document.getElementById('quizGrid');
const quizIntro = document.querySelector('.quiz-intro');
const selectedAnswers = {};

startQuizButton?.addEventListener('click', () => {
  quizIntro.classList.add('hidden');
  quizGrid.classList.remove('hidden');
});

optionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.quiz-card');
    const questionKey = card?.dataset.question;

    if (!questionKey) return;

    card.querySelectorAll('.option').forEach((item) => item.classList.remove('selected'));
    button.classList.add('selected');
    selectedAnswers[questionKey] = button.dataset.correct === 'true';
  });
});

quizButton.addEventListener('click', () => {
  const answeredQuestions = Object.keys(selectedAnswers).length;

  if (answeredQuestions < quizCards.length) {
    quizResult.textContent = 'Responda todas as perguntas para ver sua pontuação!';
    return;
  }

  const correctAnswers = Object.values(selectedAnswers).filter(Boolean).length;
  const message = `Você acertou ${correctAnswers} de ${quizCards.length} perguntas! ${correctAnswers === quizCards.length ? 'Perfeito!' : 'Muito bem!'}`;
  quizResult.textContent = message;
});
