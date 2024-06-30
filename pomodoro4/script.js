// Global variables

let pomodoroTime = 55; // Default pomodoro time in seconds
let shortBreakTime = 5; // Default short break time in seconds
let longBreakTime = 10; // Default long break time in seconds
let timeLeft = pomodoroTime * 60;
let timerInterval;
let currentInterval = "pomodoro";
let backgroundColor = "#191919"; // Default background color
let fontColor = "#FF7369"; // Default font color
let audio = "ding3.mp3"; // Default audio
let fontSize = "10rem"; // Default font size

// DOM elements
const timeLeftEl = document.getElementById("time-left");
const startStopBtn = document.getElementById("start-stop-btn");
const resetBtn = document.getElementById("reset-btn");
const pomodoroIntervalBtn = document.getElementById("pomodoro-interval-btn");
const shortBreakIntervalBtn = document.getElementById(
  "short-break-interval-btn"
);
const longBreakIntervalBtn = document.getElementById("long-break-interval-btn");
const settingsBtn = document.getElementById("settings-btn");
const settingsModal = document.getElementById("settings-modal");
const closeModalBtn = document.querySelector(".close-btn");
const backgroundColorSelect = document.getElementById("background-color");
const fontColorSelect = document.getElementById("font-color");
const audioSelect = document.getElementById("audio");
const fontSizeSelect = document.getElementById("font-size");
const pomodoroTimeSelect = document.getElementById("focus-time");
const longBreakTimeSelect = document.getElementById("long-time");
const shortBreakTimeSelect = document.getElementById("short-time");
const saveBtn = document.getElementById("save-btn");

// Event listeners for interval buttons
pomodoroIntervalBtn.addEventListener("click", () => {
  currentInterval = "pomodoro";
  stopTimer();
  timeLeft = pomodoroTime * 60;
  updateTimeLeftTextContent();
});

shortBreakIntervalBtn.addEventListener("click", () => {
  currentInterval = "short-break";
  stopTimer();
  timeLeft = shortBreakTime * 60;
  updateTimeLeftTextContent();
});

longBreakIntervalBtn.addEventListener("click", () => {
  currentInterval = "long-break";
  stopTimer();
  timeLeft = longBreakTime * 60;
  updateTimeLeftTextContent();
});

// Event listener for start/stop button
startStopBtn.addEventListener("click", () => {
  if (startStopBtn.textContent === "Start") {
    startTimer();
    startStopBtn.textContent = "Stop";
  } else {
    stopTimer();
  }
});

// Event listener for reset button
resetBtn.addEventListener("click", () => {
  stopTimer();
  if (currentInterval === "pomodoro") {
    timeLeft = pomodoroTime * 60;
  } else if (currentInterval === "short-break") {
    timeLeft = shortBreakTime * 60;
  } else {
    timeLeft = longBreakTime * 60;
  }
  updateTimeLeftTextContent();
  startStopBtn.textContent = "Start";
});

// Event listener for settings button
settingsBtn.addEventListener("click", () => {
  settingsModal.style.display = "flex";
});

// Event listener for close button in the settings modal
closeModalBtn.addEventListener("click", () => {
  settingsModal.style.display = "none";
});

// Event listener for save button in the settings modal
saveBtn.addEventListener("click", () => {
  const newBackgroundColor = backgroundColorSelect.value;
  const newFontColor = fontColorSelect.value;
  const newFontSize = fontSizeSelect.value;
  const newAudio = audioSelect.value;
  const newPomodoroTime = pomodoroTimeSelect.value;
  const newLongBreakTime = longBreakTimeSelect.value;
  const newShortBreakTime = shortBreakTimeSelect.value;

  // Save preferences to localStorage
  localStorage.setItem("backgroundColor", newBackgroundColor);
  localStorage.setItem("fontColor", newFontColor);
  localStorage.setItem("fontSize", newFontSize);
  localStorage.setItem("audio", newAudio);

  if (newPomodoroTime && newPomodoroTime <= 24 * 60) {
    localStorage.setItem("pomodoroTime", newPomodoroTime);
  }
  if (newLongBreakTime && newLongBreakTime <= 24 * 60) {
    localStorage.setItem("longBreakTime", newLongBreakTime);
  }
  if (newShortBreakTime && newShortBreakTime <= 24 * 60) {
    localStorage.setItem("shortBreakTime", newShortBreakTime);
  }

  // Apply the new saved preferences
  applyUserPreferences();

  // Close the modal after saving preferences
  settingsModal.style.display = "none";
});

audioSelect.addEventListener("change", () => {
  var snd = new Audio(audioSelect.value);
  snd.play();
});

function getAudioDuration(url) {
  return new Promise((resolve, reject) => {
    const audio = new Audio(url);

    audio.addEventListener("loadedmetadata", () => {
      resolve(audio.duration);
    });

    audio.addEventListener("error", (error) => {
      reject(new Error("Failed to load audio file."));
    });

    // Load the audio file to trigger the 'loadedmetadata' event
    audio.load();
  });
}

// Function to play sound
function playSound() {
  var snd = new Audio(audio);
  const repeatCount = 3; // Number of times to play the sound
  getAudioDuration(audio)
    .then(function (duration) {
      localStorage.setItem("audioDuration", duration);
    })
    .catch(function (error) {
      console.error(error);
    }); // Delay in milliseconds between each play
  const delay = localStorage.getItem("audioDuration");

  for (let i = 0; i < repeatCount; i++) {
    setTimeout(() => {
      snd.currentTime = 0; // Reset the audio to the start
      snd.play();
    }, i * 1300 * delay);
  }
}

// Function to start the timer
function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimeLeftTextContent();
    if (timeLeft === 0) {
      stopTimer();
      playSound();
      if (currentInterval === "pomodoro") {
        timeLeft = shortBreakTime * 60;
        currentInterval = "short-break";
      } else {
        timeLeft = pomodoroTime * 60;
        currentInterval = "pomodoro";
      }
      updateTimeLeftTextContent();
    }
  }, 1000);
}

// Function to stop the timer
function stopTimer() {
  clearInterval(timerInterval);
  startStopBtn.textContent = "Start";
}

// Function to update the time left text content
function updateTimeLeftTextContent() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timeLeftEl.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

// Function to apply the user's saved preferences
function applyUserPreferences() {
  // Retrieve user preferences from localStorage
  const savedBackgroundColor = localStorage.getItem("backgroundColor");
  const savedFontColor = localStorage.getItem("fontColor");
  const savedFontSize = localStorage.getItem("fontSize");
  const savedAudio = localStorage.getItem("audio");
  const savedPomodoroTime = localStorage.getItem("pomodoroTime");
  const savedLongBreakTime = localStorage.getItem("longBreakTime");
  const savedShortBreakTime = localStorage.getItem("shortBreakTime");

  // Apply the preferences if they exist in localStorage
  if (savedBackgroundColor) {
    backgroundColor = savedBackgroundColor;
  }

  if (savedFontColor) {
    fontColor = savedFontColor;
  }

  if (savedFontSize) {
    fontSize = savedFontSize;
  }

  if (savedAudio) {
    audio = savedAudio;
  }

  if (savedPomodoroTime) {
    pomodoroTime = savedPomodoroTime;
  }

  if (savedLongBreakTime) {
    longBreakTime = savedLongBreakTime;
  }

  if (savedShortBreakTime) {
    shortBreakTime = savedShortBreakTime;
  }

  // Apply the preferences to the Pomodoro Timer widget
  document.body.style.backgroundColor = backgroundColor;
  document.body.style.color = fontColor;
  timeLeftEl.style.color = fontColor;
  timeLeftEl.style.fontSize = fontSize;
  // Update the buttons' font and background color
  const buttons = document.querySelectorAll(
    ".interval-btn, #start-stop-btn, #reset-btn, #settings-btn"
  );
  buttons.forEach((button) => {
    button.style.color = fontColor;
    button.style.backgroundColor = backgroundColor;
    button.style.borderColor = fontColor;
  });

  timeLeft = pomodoroTime * 60;
  updateTimeLeftTextContent();

  // select saved values when reloading
  backgroundColorSelect.value = backgroundColor;
  fontColorSelect.value = fontColor;
  fontSizeSelect.value = fontSize;
  audioSelect.value = audio;
  pomodoroTimeSelect.value = pomodoroTime;
  longBreakTimeSelect.value = longBreakTime;
  shortBreakTimeSelect.value = shortBreakTime;
}

// Apply user preferences on page load
applyUserPreferences();
