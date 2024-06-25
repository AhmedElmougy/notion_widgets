// Global variables

let pomodoro_time = 55 * 60; // seconds
let short_break_time = 5 * 60; // seconds
let long_break_time = 10 * 60; // seconds
let timeLeft = pomodoro_time; 
let timerInterval;
let currentInterval = 'pomodoro';
let backgroundColor = '#F1F1EF'; // Default background color
let fontColor = '#37352F'; // Default font color

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
const saveBtn = document.getElementById('save-btn');

// Event listeners for interval buttons
pomodoroIntervalBtn.addEventListener('click', () => {
  currentInterval = 'pomodoro';
  timeLeft = pomodoro_time;
  updateTimeLeftTextContent();
});

shortBreakIntervalBtn.addEventListener('click', () => {
  currentInterval = 'short-break';
  timeLeft = short_break_time;
  updateTimeLeftTextContent();
});

longBreakIntervalBtn.addEventListener('click', () => {
  currentInterval = 'long-break';
  timeLeft = long_break_time;
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
    timeLeft = pomodoro_time;
  } else if (currentInterval === 'short-break') {
    timeLeft = short_break_time;
  } else {
    timeLeft = long_break_time;
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

  // Save preferences to localStorage
  localStorage.setItem('backgroundColor', newBackgroundColor);
  localStorage.setItem('fontColor', newFontColor);

  // Apply the new saved preferences
  applyUserPreferences();

  // Close the modal after saving preferences
  settingsModal.style.display = 'none';
});

// Function to play sound
function beep() {
  var snd = new Audio("bell.mp3");  
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
        timeLeft = short_break_time;
        currentInterval = 'short-break';
        startTimer();
      } else if (currentInterval === 'short-break') {
        timeLeft = long_break_time;
        currentInterval = 'long-break';
        startTimer();
      } else {
        timeLeft = pomodoro_time;
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

  // Apply the preferences if they exist in localStorage
  if (savedBackgroundColor) {
    backgroundColor = savedBackgroundColor;
  }

  if (savedFontColor) {
    fontColor = savedFontColor;
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
}

// Apply user preferences on page load
applyUserPreferences();