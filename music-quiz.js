const musicBank = [
  {
    title: "God's Menu",
    artist: 'Stray Kids',
    hint: 'batida forte e clima de cozinha caótica',
    cue: 'godsMenu'
  },
  {
    title: 'S-Class',
    artist: 'Stray Kids',
    hint: 'brilho futurista e energia de palco',
    cue: 'sClass'
  },
  {
    title: 'LALALALA',
    artist: 'Stray Kids',
    hint: 'refrão explosivo e festa barulhenta',
    cue: 'lalalala'
  },
  {
    title: 'Chk Chk Boom',
    artist: 'Stray Kids',
    hint: 'impacto curto, seco e cheio de atitude',
    cue: 'chkChkBoom'
  },
  {
    title: 'Maniac',
    artist: 'Stray Kids',
    hint: 'som tortinho, divertido e meio hipnótico',
    cue: 'maniac'
  },
  {
    title: 'Thunderous',
    artist: 'Stray Kids',
    hint: 'entrada grandona, dramática e percussiva',
    cue: 'thunderous'
  },
  {
    title: 'Touch',
    artist: 'KATSEYE',
    hint: 'pop chic, delicado e chiclete',
    cue: 'touch'
  },
  {
    title: 'Debut',
    artist: 'KATSEYE',
    hint: 'confiante, brilhante e com pose de estreia',
    cue: 'debut'
  },
  {
    title: 'Gnarly',
    artist: 'KATSEYE',
    hint: 'ousada, digital e cheia de cara feia divertida',
    cue: 'gnarly'
  },
  {
    title: 'Gabriela',
    artist: 'KATSEYE',
    hint: 'pop dramático com charme de novela',
    cue: 'gabriela'
  }
];

const musicQuestionsPerRound = 8;
const musicAutoAdvanceDelay = 850;
const musicCueDuration = 4300;

const musicQuestionCard = document.getElementById('musicQuestionCard');
const musicProgress = document.getElementById('musicProgress');
const musicQuestionTitle = document.getElementById('musicQuestionTitle');
const musicOptions = document.getElementById('musicOptions');
const playMusicCue = document.getElementById('playMusicCue');
const playButtonText = document.getElementById('playButtonText');
const equalizer = document.getElementById('equalizer');
const prevMusicQuestion = document.getElementById('prevMusicQuestion');
const musicQuizSummary = document.getElementById('musicQuizSummary');
const musicSummaryText = document.getElementById('musicSummaryText');
const musicWrongAnswers = document.getElementById('musicWrongAnswers');
const restartMusicQuiz = document.getElementById('restartMusicQuiz');

let audioContext = null;
let currentRound = [];
let musicAnswers = [];
let currentMusicQuestion = 0;
let musicAdvanceTimer = null;
let activeTimeouts = [];
let activeNodes = [];

function shuffleItems(items) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
}

function buildMusicRound() {
  return shuffleItems(musicBank)
    .slice(0, musicQuestionsPerRound)
    .map((song) => ({
      ...song,
      options: buildOptions(song)
    }));
}

function buildOptions(song) {
  const wrongOptions = shuffleItems(musicBank.filter((candidate) => candidate.title !== song.title))
    .slice(0, 3)
    .map((candidate) => candidate.title);

  return shuffleItems([song.title, ...wrongOptions]);
}

function renderMusicQuestion(index) {
  const question = currentRound[index];

  stopCue();
  musicProgress.textContent = `Trecho ${index + 1} de ${currentRound.length}`;
  musicQuestionTitle.textContent = 'Qual é a música?';
  musicOptions.innerHTML = '';

  question.options.forEach((option) => {
    const button = document.createElement('button');
    button.className = 'btn secondary option-button music-option-button';
    button.type = 'button';
    button.textContent = option;
    button.setAttribute('aria-pressed', musicAnswers[index] === option ? 'true' : 'false');
    button.addEventListener('click', () => selectMusicAnswer(option));

    if (musicAnswers[index] === option) {
      button.classList.add('selected');
      button.classList.add(option === question.title ? 'correct' : 'incorrect');
    }

    musicOptions.appendChild(button);
  });

  prevMusicQuestion.disabled = index === 0;
  playButtonText.textContent = 'Tocar pista';
}

function selectMusicAnswer(option) {
  const question = currentRound[currentMusicQuestion];
  musicAnswers[currentMusicQuestion] = option;
  renderMusicQuestion(currentMusicQuestion);
  markSelectedAnswer(question, option);
  clearMusicAdvanceTimer();
  musicAdvanceTimer = setTimeout(goToNextMusicStep, musicAutoAdvanceDelay);
}

function markSelectedAnswer(question, selectedOption) {
  Array.from(musicOptions.children).forEach((button) => {
    if (button.textContent === question.title) {
      button.classList.add('correct');
    }

    if (button.textContent === selectedOption && selectedOption !== question.title) {
      button.classList.add('incorrect');
    }
  });
}

function goToNextMusicStep() {
  if (currentMusicQuestion < currentRound.length - 1) {
    currentMusicQuestion += 1;
    renderMusicQuestion(currentMusicQuestion);
    return;
  }

  showMusicSummary();
}

function clearMusicAdvanceTimer() {
  if (musicAdvanceTimer) {
    clearTimeout(musicAdvanceTimer);
    musicAdvanceTimer = null;
  }
}

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  return audioContext;
}

function playCue() {
  const question = currentRound[currentMusicQuestion];
  const context = getAudioContext();

  stopCue();

  if (context.state === 'suspended') {
    context.resume();
  }

  playButtonText.textContent = 'Tocando...';
  equalizer.classList.add('playing');

  const startTime = context.currentTime + 0.04;
  const cuePlayer = cuePlayers[question.cue] || cuePlayers.defaultCue;
  cuePlayer(context, startTime);

  const finishTimer = setTimeout(() => {
    equalizer.classList.remove('playing');
    playButtonText.textContent = 'Tocar de novo';
  }, musicCueDuration);

  activeTimeouts.push(finishTimer);
}

const cuePlayers = {
  godsMenu(context, startTime) {
    [0, 0.42, 0.84, 1.24, 1.72, 2.14, 2.58, 3.0].forEach((offset, index) => {
      scheduleKick(context, startTime + offset, { volume: index % 2 === 0 ? 0.18 : 0.11, endFrequency: 38 });
    });

    [0.18, 0.33, 0.6, 1.02, 1.36, 1.52, 2.0, 2.32, 2.74, 3.18].forEach((offset) => {
      scheduleNoise(context, {
        time: startTime + offset,
        duration: 0.07,
        volume: 0.065,
        filterType: 'bandpass',
        filterFrequency: 1900,
        filterQ: 8
      });
    });

    [0.08, 0.5, 1.32, 2.22, 2.92].forEach((offset) => {
      scheduleTone(context, 1567.98, startTime + offset, 0.08, 'triangle', 0.05, {
        filterFrequency: 3200,
        attack: 0.004
      });
    });

    schedulePattern(context, startTime, [146.83, 146.83, 220, 196, 146.83, 293.66], 0.36, {
      type: 'square',
      duration: 0.18,
      volume: 0.052,
      filterFrequency: 720
    });
  },

  sClass(context, startTime) {
    [0, 0.68, 1.36, 2.04, 2.72].forEach((offset) => {
      scheduleSweep(context, startTime + offset, 0.38, 280, 86, 'sawtooth', 0.055);
    });

    [783.99, 987.77, 1174.66, 1567.98, 1975.53, 1567.98, 1174.66, 987.77].forEach((frequency, index) => {
      scheduleTone(context, frequency, startTime + 0.08 + index * 0.16, 0.11, 'triangle', 0.036, {
        filterFrequency: 5200,
        attack: 0.005
      });
      scheduleTone(context, frequency * 1.5, startTime + 1.52 + index * 0.13, 0.08, 'sine', 0.018, {
        filterFrequency: 6400,
        pan: index % 2 ? 0.45 : -0.45
      });
    });

    [0.2, 0.52, 0.86, 1.2, 1.88, 2.18, 2.5, 2.82].forEach((offset) => {
      scheduleNoise(context, {
        time: startTime + offset,
        duration: 0.045,
        volume: 0.035,
        filterType: 'highpass',
        filterFrequency: 5200
      });
    });
  },

  lalalala(context, startTime) {
    [0, 0.44, 0.88, 1.32, 1.84, 2.28, 2.72, 3.16].forEach((offset, index) => {
      scheduleClap(context, startTime + offset, index % 2 === 0 ? 0.09 : 0.055);
    });

    const chant = [523.25, 659.25, 587.33, 523.25, 659.25, 783.99, 659.25, 587.33];
    chant.forEach((frequency, index) => {
      scheduleTone(context, frequency, startTime + 0.12 + index * 0.22, 0.16, 'triangle', 0.05, {
        filterType: 'bandpass',
        filterFrequency: 1100,
        filterQ: 9,
        attack: 0.012
      });
    });

    scheduleChord(context, [130.81, 196, 261.63], startTime + 0.02, 0.42, 'sawtooth', 0.024);
    scheduleChord(context, [146.83, 220, 293.66], startTime + 1.78, 0.42, 'sawtooth', 0.024);
  },

  chkChkBoom(context, startTime) {
    [0, 0.2, 0.74, 0.94, 1.48, 1.68, 2.24, 2.44, 3.08, 3.28].forEach((offset, index) => {
      scheduleNoise(context, {
        time: startTime + offset,
        duration: 0.045,
        volume: 0.072,
        filterType: 'highpass',
        filterFrequency: index % 2 ? 3700 : 2500,
        filterQ: 5
      });
    });

    [0.38, 1.12, 1.86, 2.64, 3.48].forEach((offset) => {
      scheduleKick(context, startTime + offset, { volume: 0.2, startFrequency: 132, endFrequency: 30, duration: 0.22 });
      scheduleSweep(context, startTime + offset, 0.2, 95, 34, 'sine', 0.09);
    });

    [196, 207.65, 196, 155.56, 196].forEach((frequency, index) => {
      scheduleTone(context, frequency, startTime + 0.42 + index * 0.74, 0.12, 'square', 0.045, {
        filterFrequency: 520
      });
    });
  },

  maniac(context, startTime) {
    [0, 0.58, 1.16, 1.74, 2.32, 2.9].forEach((offset, index) => {
      scheduleTone(context, index % 2 ? 138.59 : 110, startTime + offset, 0.36, 'sawtooth', 0.055, {
        endFrequency: index % 2 ? 103.83 : 164.81,
        filterFrequency: 850,
        detune: -18,
        detuneEnd: 26
      });
    });

    [0.18, 0.5, 0.86, 1.42, 1.98, 2.36, 2.74, 3.22].forEach((offset, index) => {
      scheduleTone(context, index % 2 ? 554.37 : 466.16, startTime + offset, 0.09, 'square', 0.044, {
        filterType: 'bandpass',
        filterFrequency: index % 2 ? 980 : 760,
        filterQ: 12,
        pan: index % 2 ? 0.36 : -0.36
      });
    });

    [0.08, 0.92, 1.82, 2.68, 3.28].forEach((offset) => {
      scheduleNoise(context, {
        time: startTime + offset,
        duration: 0.09,
        volume: 0.034,
        filterType: 'bandpass',
        filterFrequency: 690,
        filterQ: 6
      });
    });
  },

  thunderous(context, startTime) {
    scheduleNoise(context, {
      time: startTime,
      duration: 1.15,
      volume: 0.085,
      filterType: 'lowpass',
      filterFrequency: 210,
      filterQ: 1
    });

    [0.1, 0.68, 1.32, 1.88, 2.44, 3.04].forEach((offset) => {
      scheduleKick(context, startTime + offset, { volume: 0.22, startFrequency: 120, endFrequency: 28, duration: 0.28 });
      scheduleNoise(context, {
        time: startTime + offset + 0.04,
        duration: 0.11,
        volume: 0.08,
        filterType: 'bandpass',
        filterFrequency: 340,
        filterQ: 4
      });
    });

    [392, 523.25, 659.25, 783.99].forEach((frequency, index) => {
      scheduleTone(context, frequency, startTime + 0.36 + index * 0.52, 0.22, 'square', 0.04, {
        filterFrequency: 1250,
        attack: 0.006
      });
    });
  },

  touch(context, startTime) {
    [659.25, 783.99, 880, 987.77, 880, 783.99, 659.25, 739.99].forEach((frequency, index) => {
      scheduleTone(context, frequency, startTime + index * 0.22, 0.18, 'sine', 0.036, {
        filterFrequency: 3600,
        attack: 0.018,
        pan: index % 2 ? 0.26 : -0.26
      });
    });

    [0.08, 0.56, 1.04, 1.52, 2.04, 2.52, 3.04].forEach((offset) => {
      scheduleNoise(context, {
        time: startTime + offset,
        duration: 0.032,
        volume: 0.032,
        filterType: 'highpass',
        filterFrequency: 6200
      });
    });

    scheduleChord(context, [220, 329.63, 440], startTime + 0.1, 1.15, 'triangle', 0.018);
    scheduleChord(context, [246.94, 369.99, 493.88], startTime + 1.5, 1.15, 'triangle', 0.018);
  },

  debut(context, startTime) {
    [0, 0.48, 0.96, 1.44, 1.92, 2.4, 2.88, 3.36].forEach((offset, index) => {
      scheduleKick(context, startTime + offset, { volume: 0.12, startFrequency: 96, endFrequency: 44, duration: 0.16 });
      if (index % 2 === 1) {
        scheduleClap(context, startTime + offset + 0.02, 0.068);
      }
    });

    [622.25, 739.99, 830.61, 987.77, 1244.51, 987.77].forEach((frequency, index) => {
      scheduleTone(context, frequency, startTime + 0.16 + index * 0.27, 0.13, 'sawtooth', 0.035, {
        filterFrequency: 2600,
        attack: 0.006
      });
    });

    [1.88, 2.12, 2.36, 2.6, 3.18].forEach((offset) => {
      scheduleTone(context, 1760, startTime + offset, 0.065, 'triangle', 0.035, {
        filterFrequency: 5600
      });
    });
  },

  gnarly(context, startTime) {
    [0, 0.18, 0.36, 0.62, 0.8, 1.06, 1.24, 1.46, 1.88, 2.08, 2.28, 2.5, 2.84, 3.04, 3.28].forEach((offset, index) => {
      scheduleTone(context, index % 3 === 0 ? 103.83 : index % 3 === 1 ? 415.3 : 830.61, startTime + offset, 0.075, 'square', 0.047, {
        filterType: 'bandpass',
        filterFrequency: index % 2 ? 1500 : 650,
        filterQ: 16,
        detune: index % 2 ? 32 : -32
      });
    });

    [0.28, 0.7, 1.34, 1.6, 2.18, 2.74, 3.4].forEach((offset) => {
      scheduleNoise(context, {
        time: startTime + offset,
        duration: 0.05,
        volume: 0.064,
        filterType: 'highpass',
        filterFrequency: 4800,
        filterQ: 9
      });
    });

    scheduleSweep(context, startTime + 0.02, 0.18, 980, 160, 'sawtooth', 0.045);
    scheduleSweep(context, startTime + 1.74, 0.18, 1200, 180, 'sawtooth', 0.045);
  },

  gabriela(context, startTime) {
    [196, 246.94, 293.66, 329.63, 293.66, 246.94, 220, 196].forEach((frequency, index) => {
      scheduleTone(context, frequency, startTime + index * 0.3, 0.18, 'triangle', 0.046, {
        filterFrequency: 1800,
        attack: 0.004,
        pan: index % 2 ? 0.2 : -0.2
      });
      scheduleTone(context, frequency * 2, startTime + index * 0.3 + 0.02, 0.12, 'sine', 0.018, {
        filterFrequency: 2400
      });
    });

    [0.15, 0.45, 0.75, 1.35, 1.65, 1.95, 2.55, 2.85, 3.15].forEach((offset) => {
      scheduleNoise(context, {
        time: startTime + offset,
        duration: 0.028,
        volume: 0.045,
        filterType: 'bandpass',
        filterFrequency: 3100,
        filterQ: 10
      });
    });

    scheduleChord(context, [98, 146.83, 196], startTime + 0.02, 1.1, 'sawtooth', 0.02);
    scheduleChord(context, [110, 164.81, 220], startTime + 1.52, 1.1, 'sawtooth', 0.02);
  },

  defaultCue(context, startTime) {
    schedulePattern(context, startTime, [220, 330, 440, 550, 440, 330], 0.26, {
      type: 'triangle',
      duration: 0.16,
      volume: 0.045,
      filterFrequency: 1800
    });
  }
};

function schedulePattern(context, startTime, frequencies, step, options) {
  frequencies.forEach((frequency, index) => {
    scheduleTone(context, frequency, startTime + index * step, options.duration, options.type, options.volume, options);
  });
}

function scheduleChord(context, frequencies, startTime, duration, type, volume) {
  frequencies.forEach((frequency, index) => {
    scheduleTone(context, frequency, startTime, duration, type, volume, {
      attack: 0.05,
      filterFrequency: 1500 + index * 360,
      pan: (index - 1) * 0.18
    });
  });
}

function scheduleTone(context, frequency, startTime, duration, type, volume, options = {}) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const filter = context.createBiquadFilter();
  const pan = context.createStereoPanner ? context.createStereoPanner() : null;
  const attack = options.attack ?? 0.01;
  const release = options.release ?? 0.03;

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);

  if (options.endFrequency) {
    oscillator.frequency.exponentialRampToValueAtTime(options.endFrequency, startTime + duration);
  }

  if (options.detune) {
    oscillator.detune.setValueAtTime(options.detune, startTime);
  }

  if (options.detuneEnd) {
    oscillator.detune.linearRampToValueAtTime(options.detuneEnd, startTime + duration);
  }

  filter.type = options.filterType || 'lowpass';
  filter.frequency.setValueAtTime(options.filterFrequency || 1800, startTime);
  filter.Q.setValueAtTime(options.filterQ || 1, startTime);
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(volume, startTime + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  oscillator.connect(filter);
  if (pan) {
    pan.pan.setValueAtTime(options.pan || 0, startTime);
    filter.connect(pan);
    pan.connect(gain);
  } else {
    filter.connect(gain);
  }
  gain.connect(context.destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration + release);
  activeNodes.push(oscillator);
}

function scheduleSweep(context, startTime, duration, startFrequency, endFrequency, type, volume) {
  scheduleTone(context, startFrequency, startTime, duration, type, volume, {
    endFrequency,
    filterFrequency: Math.max(startFrequency * 1.8, 600),
    attack: 0.004,
    release: 0.02
  });
}

function scheduleKick(context, startTime, options = {}) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const duration = options.duration || 0.16;

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(options.startFrequency || 96, startTime);
  oscillator.frequency.exponentialRampToValueAtTime(options.endFrequency || 42, startTime + duration * 0.86);
  gain.gain.setValueAtTime(options.volume || 0.12, startTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.02);
  activeNodes.push(oscillator);
}

function scheduleClap(context, startTime, volume) {
  [0, 0.018, 0.034].forEach((offset, index) => {
    scheduleNoise(context, {
      time: startTime + offset,
      duration: 0.07,
      volume: volume * (1 - index * 0.16),
      filterType: 'bandpass',
      filterFrequency: 1850 + index * 280,
      filterQ: 4
    });
  });
}

function scheduleNoise(context, options) {
  const duration = options.duration;
  const bufferSize = Math.max(1, Math.floor(context.sampleRate * duration));
  const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
  const data = buffer.getChannelData(0);
  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  const pan = context.createStereoPanner ? context.createStereoPanner() : null;

  for (let index = 0; index < bufferSize; index += 1) {
    const fade = Math.pow(1 - index / bufferSize, 1.6);
    data[index] = (Math.random() * 2 - 1) * fade;
  }

  source.buffer = buffer;
  filter.type = options.filterType || 'highpass';
  filter.frequency.setValueAtTime(options.filterFrequency || 3000, options.time);
  filter.Q.setValueAtTime(options.filterQ || 1, options.time);
  gain.gain.setValueAtTime(0.0001, options.time);
  gain.gain.exponentialRampToValueAtTime(options.volume, options.time + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, options.time + duration);

  source.connect(filter);
  if (pan) {
    pan.pan.setValueAtTime(options.pan || 0, options.time);
    filter.connect(pan);
    pan.connect(gain);
  } else {
    filter.connect(gain);
  }
  gain.connect(context.destination);
  source.start(options.time);
  source.stop(options.time + duration + 0.02);
  activeNodes.push(source);
}

function stopCue() {
  activeTimeouts.forEach((timer) => clearTimeout(timer));
  activeTimeouts = [];
  activeNodes.forEach((node) => {
    try {
      node.stop();
    } catch (error) {
      // The node may already have ended.
    }
  });
  activeNodes = [];
  equalizer.classList.remove('playing');
}

function showMusicSummary() {
  stopCue();
  clearMusicAdvanceTimer();

  const correctCount = musicAnswers.reduce((count, answer, index) => {
    return count + (answer === currentRound[index].title ? 1 : 0);
  }, 0);

  musicQuestionCard.classList.add('hidden');
  musicQuizSummary.classList.remove('hidden');
  musicSummaryText.textContent = `Você acertou ${correctCount} de ${currentRound.length} músicas.`;
  musicWrongAnswers.innerHTML = '';

  currentRound.forEach((question, index) => {
    if (musicAnswers[index] !== question.title) {
      const wrongCard = document.createElement('div');
      const title = document.createElement('h3');
      const userAnswer = document.createElement('p');
      const correctAnswer = document.createElement('p');
      const explanation = document.createElement('p');

      wrongCard.className = 'wrong-card';
      title.textContent = `${index + 1}. ${question.artist} - ${question.title}`;
      userAnswer.append(createStrongLabel('Sua resposta:'), ` ${musicAnswers[index] || 'Nenhuma'}`);
      correctAnswer.append(createStrongLabel('Resposta certa:'), ` ${question.title}`);
      explanation.className = 'explanation';
      explanation.textContent = `Pista: ${question.hint}.`;

      wrongCard.append(title, userAnswer, correctAnswer, explanation);
      musicWrongAnswers.appendChild(wrongCard);
    }
  });

  if (!musicWrongAnswers.children.length) {
    const perfectScore = document.createElement('p');
    perfectScore.className = 'perfect-score';
    perfectScore.textContent = 'Você reconheceu todas. Sophia aprovaria muito!';
    musicWrongAnswers.appendChild(perfectScore);
  }
}

function createStrongLabel(text) {
  const label = document.createElement('strong');
  label.textContent = text;
  return label;
}

function startMusicQuiz() {
  stopCue();
  clearMusicAdvanceTimer();
  currentRound = buildMusicRound();
  musicAnswers = Array(currentRound.length).fill(null);
  currentMusicQuestion = 0;
  musicQuestionCard.classList.remove('hidden');
  musicQuizSummary.classList.add('hidden');
  renderMusicQuestion(currentMusicQuestion);
}

playMusicCue.addEventListener('click', playCue);

prevMusicQuestion.addEventListener('click', () => {
  stopCue();
  clearMusicAdvanceTimer();

  if (currentMusicQuestion > 0) {
    currentMusicQuestion -= 1;
    renderMusicQuestion(currentMusicQuestion);
  }
});

restartMusicQuiz.addEventListener('click', startMusicQuiz);

startMusicQuiz();
