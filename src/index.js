import summerbg from "./assets/summer-bg.jpg";
import rainbg from "./assets/rainy-bg.jpg";
import winterbg from "./assets/winter-bg.jpg";

import summerSound from "./assets/sounds/summer.mp3";
import rainSound from "./assets/sounds/rain.mp3";
import winterSound from "./assets/sounds/winter.mp3";

const sounds = {
  summer: {
    label: "Летний лес",
    background: summerbg,
    audio: new Audio(summerSound),
  },
  rain: {
    label: "Дождливая ночь",
    background: rainbg,
    audio: new Audio(rainSound),
  },
  winter: {
    label: "Зимний вечер",
    background: winterbg,
    audio: new Audio(winterSound),
  },
};

const volumeSlider = document.querySelector("[data-volume]");
const volumeValue = document.querySelector("[data-volume-value]");
const soundButtons = Array.from(document.querySelectorAll("[data-sound]"));
const stateLabels = new Map();

let currentKey = null;

function setVolume(value) {
  const safeValue = Number.parseFloat(value) || 0;
  Object.values(sounds).forEach(({ audio }) => {
    audio.volume = safeValue;
  });
  if (volumeValue) {
    volumeValue.textContent = `${Math.round(safeValue * 100)}%`;
  }
}

function setBackground(imageUrl) {
  if (!imageUrl) return;
  document.body.style.setProperty("--bg-image", `url(${imageUrl})`);
}

function setButtonState(key, mode) {
  const button = soundButtons.find((item) => item.dataset.sound === key);
  if (!button) return;

  button.classList.toggle("is-active", mode === "playing");
  button.classList.toggle("is-paused", mode === "paused");

  const label = stateLabels.get(key);
  if (label) {
    const textByMode = {
      playing: "Играет",
      paused: "Пауза",
      idle: "Готово",
    };
    label.textContent = textByMode[mode] ?? textByMode.idle;
  }
}

function stopSound(key) {
  const sound = sounds[key];
  if (!sound) return;

  sound.audio.pause();
  sound.audio.currentTime = 0;
  setButtonState(key, "idle");
}

function playSound(key) {
  const sound = sounds[key];
  if (!sound) return;

  if (currentKey && currentKey !== key) {
    stopSound(currentKey);
  }

  if (currentKey === key && sound.audio.paused && sound.audio.currentTime > 0) {
    sound.audio.play();
    setButtonState(key, "playing");
    setBackground(sound.background);
    return;
  }

  if (currentKey === key && !sound.audio.paused) {
    sound.audio.pause();
    setButtonState(key, "paused");
    return;
  }

  currentKey = key;
  sound.audio.currentTime = 0;
  sound.audio.play();
  setBackground(sound.background);
  setButtonState(key, "playing");
}

function init() {
  Object.entries(sounds).forEach(([key, { audio, background }]) => {
    audio.loop = true;
    const button = soundButtons.find((item) => item.dataset.sound === key);
    if (button) {
      const label = button.querySelector("[data-state]");
      if (label) stateLabels.set(key, label);
      button.addEventListener("click", () => {
        playSound(key);
      });
    }
    if (!currentKey) {
      currentKey = key;
      setBackground(background);
    }
  });

  setVolume(volumeSlider?.value ?? 0.5);
  if (volumeSlider) {
    volumeSlider.addEventListener("input", (event) => {
      setVolume(event.target.value);
    });
  }
}

document.addEventListener("DOMContentLoaded", init);
