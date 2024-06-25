// Global variables

let pomodoroTime = 55 * 60; // Default pomodoro time in seconds
let shortBreakTime = 1; // Default short break time in seconds
let longBreakTime = 10 * 60; // Default long break time in seconds
let timeLeft = pomodoroTime; 
let timerInterval;
let currentInterval = 'pomodoro';
let backgroundColor = '#F1F1EF'; // Default background color
let fontColor = '#37352F'; // Default font color
let audio = 'chime1.mp3'; // Default audio

// DOM elements
const timeLeftEl = document.getElementById('time-left');
const startStopBtn = document.getElementById('start-stop-btn');
const resetBtn = document.getElementById('reset-btn');
const pomodoroIntervalBtn = document.getElementById('pomodoro-interval-btn');
const shortBreakIntervalBtn = document.getElementById('short-break-interval-btn');
const longBreakIntervalBtn = document.getElementById('long-break-interval-btn');
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const closeModalBtn = document.querySelector('.close-btn');
const backgroundColorSelect = document.getElementById('background-color');
const fontColorSelect = document.getElementById('font-color');
const audioSelect = document.getElementById('audio');
const saveBtn = document.getElementById('save-btn');

// Event listeners for interval buttons
pomodoroIntervalBtn.addEventListener('click', () => {
  currentInterval = 'pomodoro';
  stopTimer();
  timeLeft = pomodoroTime;
  updateTimeLeftTextContent();
});

shortBreakIntervalBtn.addEventListener('click', () => {
  currentInterval = 'short-break';
  stopTimer();
  timeLeft = shortBreakTime;
  updateTimeLeftTextContent();
});

longBreakIntervalBtn.addEventListener('click', () => {
  currentInterval = 'long-break';
  stopTimer();
  timeLeft = longBreakTime;
  updateTimeLeftTextContent();
});

// Event listener for start/stop button
startStopBtn.addEventListener('click', () => {
  if (startStopBtn.textContent === 'Start') {
    startTimer();
    startStopBtn.textContent = 'Stop';
  } else {
    stopTimer();
  }
});

// Event listener for reset button
resetBtn.addEventListener('click', () => {
  stopTimer();
  if (currentInterval === 'pomodoro') {
    timeLeft = pomodoroTime;
  } else if (currentInterval === 'short-break') {
    timeLeft = shortBreakTime;
  } else {
    timeLeft = longBreakTime;
  }
  updateTimeLeftTextContent();
  startStopBtn.textContent = 'Start';
});

// Event listener for settings button
settingsBtn.addEventListener('click', () => {
  settingsModal.style.display = 'flex';
});

// Event listener for close button in the settings modal
closeModalBtn.addEventListener('click', () => {
  settingsModal.style.display = 'none';
});

// Event listener for save button in the settings modal
saveBtn.addEventListener('click', () => {
  const newBackgroundColor = backgroundColorSelect.value;
  const newFontColor = fontColorSelect.value;
  const newAudio = audioSelect.value;

  // Save preferences to localStorage
  localStorage.setItem('backgroundColor', newBackgroundColor);
  localStorage.setItem('fontColor', newFontColor);
  localStorage.setItem('audio', newAudio);

  // Apply the new saved preferences
  applyUserPreferences();

  // Close the modal after saving preferences
  settingsModal.style.display = 'none';
});

// Function to play sound
function beep() {
  var snd = new Audio(audio);  
  const repeatCount = 3; // Number of times to play the sound
  const delay = 1500; // Delay in milliseconds between each play

  
  for (let i = 0; i < repeatCount; i++) {
      setTimeout(() => {
        snd.currentTime = 0; // Reset the audio to the start
        snd.play();
      }, i * delay);
  }
}

// Function to start the timer
function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimeLeftTextContent();
    if (timeLeft === 0) {
      clearInterval(timerInterval);
      beep();
      if (currentInterval === 'pomodoro') {
        timeLeft = shortBreakTime;
        currentInterval = 'short-break';
        startTimer();
      } else if (currentInterval === 'short-break') {
        timeLeft = longBreakTime;
        currentInterval = 'long-break';
        startTimer();
      } else {
        timeLeft = pomodoroTime;
        currentInterval = 'pomodoro';
      }
    }
  }, 1000);
}

// Function to stop the timer
function stopTimer() {
  clearInterval(timerInterval);
  startStopBtn.textContent = 'Start';
}

// Function to update the time left text content
function updateTimeLeftTextContent() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timeLeftEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Function to apply the user's saved preferences
function applyUserPreferences() {
  // Retrieve user preferences from localStorage
  const savedBackgroundColor = localStorage.getItem('backgroundColor');
  const savedFontColor = localStorage.getItem('fontColor');
  const savedAudio = localStorage.getItem('audio');

  // Apply the preferences if they exist in localStorage
  if (savedBackgroundColor) {
    backgroundColor = savedBackgroundColor;
  }

  if (savedFontColor) {
    fontColor = savedFontColor;
  }

  if (savedAudio) {
    audio = savedAudio;
  }

  // Apply the preferences to the Pomodoro Timer widget
  document.body.style.backgroundColor = backgroundColor;
  document.body.style.color = fontColor;
  timeLeftEl.style.color = fontColor;
  // Update the buttons' font and background color
  const buttons = document.querySelectorAll('.interval-btn, #start-stop-btn, #reset-btn, #settings-btn');
  buttons.forEach((button) => {
    button.style.color = fontColor;
    button.style.backgroundColor = backgroundColor;
    button.style.borderColor = fontColor;
  });

  // select saved values when reloading
  backgroundColorSelect.value = backgroundColor;
  fontColorSelect.value = fontColor;
  audioSelect.value = audio;
}

// Apply user preferences on page load
applyUserPreferences();