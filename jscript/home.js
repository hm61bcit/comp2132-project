// ===== Constants =====
const hangman_max_tries = 6;
const words_json_path = 'https://hm61bcit.github.io/comp2132-project/data/json/words.json';
const hangman_image_path = 'https://hm61bcit.github.io/comp2132-project/images/';

// ===== Element Variables =====
let hintText;
let wordDisplay;
let letterInput;
let guessedLettersDisplay;
let resultMessage;
let hangmanImage;
let playAgainBtn;

hintText = document.getElementById('hintText');
wordDisplay = document.getElementById('wordDisplay');
letterInput = document.getElementById('letterInput');
guessedLettersDisplay = document.getElementById('guessedLetters');
resultMessage = document.getElementById('resultMessage');
hangmanImage = document.getElementById('hangmanImage');
playAgainBtn = document.getElementById('playAgainBtn');

// ===== Game State Variables =====
let wordList;
let currentWord;
let currentHint;
let guessedLetters;
let wrongGuesses;

// ===== Fetch Word List =====
fetch(words_json_path)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    wordList = data;
    startGame();
  })
  .catch(function () {
    hintText.textContent = 'failed to load word list.';
  });

// ===== Start Game =====
function startGame() {
  const randomEntry = wordList[Math.floor(Math.random() * wordList.length)];
  currentWord = randomEntry.word.toUpperCase();
  currentHint = randomEntry.hint;
  guessedLetters = [];
  wrongGuesses = 0;

  updateUI();
}

// ===== Update UI =====
function updateUI() {
  hintText.textContent = 'Hint: ' + currentHint;

  let display = '';
  for (let i = 0; i < currentWord.length; i++) {
    if (guessedLetters.includes(currentWord[i])) {
      display += currentWord[i] + ' ';
    } else {
      display += '_ ';
    }
  }

  wordDisplay.textContent = display.trim();
  guessedLettersDisplay.textContent = 'Guessed: ' + guessedLetters.join(', ');
  hangmanImage.src = hangman_image_path + 'hangman' + wrongGuesses + '.png';

  if (wrongGuesses < hangman_max_tries && display.includes('_')) {
  resultMessage.textContent = '';
  playAgainBtn.classList.add('hidden');
  letterInput.disabled = false;
  letterInput.value = '';
  }
}

// ===== Guess Letter =====
function guessLetter(letter) {
  if (guessedLetters.includes(letter) || letter === '') {
    return;
  }

  guessedLetters.push(letter);

  if (currentWord.includes(letter)) {
    let allRevealed = true;
    for (let i = 0; i < currentWord.length; i++) {
      if (!guessedLetters.includes(currentWord[i])) {
        allRevealed = false;
        break;
      }
    }
    if (allRevealed) {
      endGame(true);
    }
  } else {
    wrongGuesses++;
    if (wrongGuesses >= hangman_max_tries) {
      endGame(false);
    }
  }

  updateUI();
}

// ===== End Game =====
function endGame(won) {
  resultMessage.textContent = won
    ? '🎉 You won!'
    : '❌ You lost. The word was "' + currentWord + '".';
  letterInput.disabled = true;
  playAgainBtn.classList.remove('hidden');
}

// ===== Event Listeners =====
letterInput.addEventListener('keyup', function (event) {
  if (letterInput.disabled) return;

  const key = event.key.toUpperCase();
  if (/^[A-Z]$/.test(key)) {
    guessLetter(key);
  }
});

playAgainBtn.addEventListener('click', startGame);
