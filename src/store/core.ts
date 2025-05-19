import { signal } from "@preact/signals";
import { PomodoroStates } from "../lib/types";
import { load, save } from "../lib/utils";
import { iconMap, notificationBody, notificationTitle } from "../lib/constants";

// === Предзагрузка и кэш аудио ===
const soundCache: { [key in PomodoroStates]?: HTMLAudioElement } = {};

export const preloadSounds = () => {
  const sounds: { [key in PomodoroStates]: string } = {
    focus: "/sounds/focus.wav",
    break: "/sounds/break.wav",
    "long-break": "/sounds/long-break.wav",
  };

  for (const [mode, src] of Object.entries(sounds) as [
    PomodoroStates,
    string,
  ][]) {
    if (typeof window !== "undefined") {
      const audio = new Audio(src);
      audio.load(); // Запускает предзагрузку
      soundCache[mode] = audio;
    }
  }
};

// Вызов при инициализации
preloadSounds();

type Timer = {
  mode: PomodoroStates;
  minutes: number;
  seconds: number;
  hasSoundEffects: boolean;

  timesTillLongBreak: number;
  currentStep: number;
  isRunning: boolean;
  autoResume: boolean;

  presets: {
    [key in PomodoroStates]: {
      minutes: number;
      seconds: number;
    };
  };
};

let timerInterval: number | null = null;

const core = signal<Timer>({
  mode: load("mode") || "focus",
  minutes: load("minutes") || 25,
  seconds: load("seconds") || 0,
  hasSoundEffects: load("hasSoundEffects") ?? true,
  timesTillLongBreak: load("timesTillLongBreak") || 4,
  currentStep: load("currentStep") || 1,
  isRunning: false,
  autoResume: load("autoResume") || false,

  presets: {
    focus: {
      minutes: load("focusMinutes") || 25,
      seconds: load("focusSeconds") || 0,
    },
    "long-break": {
      minutes: load("longBreakMinutes") || 15,
      seconds: load("longBreakSeconds") || 0,
    },
    break: {
      minutes: load("breakMinutes") || 5,
      seconds: load("breakSeconds") || 0,
    },
  },
});

export const removeIntervalTimer = () => {
  clearInterval(timerInterval);
  timerInterval = null;
};

export const stopTimer = () => {
  if (timerInterval) {
    removeIntervalTimer();
  }
  core.value = {
    ...core.value,
    isRunning: false,
  };
  save("isRunning", false);
};

export const switchSoundEffects = () => {
  core.value = {
    ...core.value,
    hasSoundEffects: !core.value.hasSoundEffects,
  };
  save("hasSoundEffects", core.value.hasSoundEffects);
};

export const pauseTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  core.value = {
    ...core.value,
    isRunning: false,
  };
  save("isRunning", false);
};

const animateTimeChange = (
  targetMinutes: number,
  targetSeconds: number,
  callback?: () => void,
) => {
  const totalCurrent = core.value.minutes * 60 + core.value.seconds;
  const totalTarget = targetMinutes * 60 + targetSeconds;
  const diff = totalTarget - totalCurrent;

  if (diff === 0) {
    callback?.();
    return;
  }

  const duration = 1500;
  const frameRate = 1000 / 60;
  const steps = Math.round(duration / frameRate);
  let currentStep = 0;

  const easeInOutCubic = (t: number): number =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const interval = setInterval(() => {
    currentStep++;
    const progress = currentStep / steps;
    const easedProgress = easeInOutCubic(progress);
    const currentTotal = Math.round(totalCurrent + diff * easedProgress);

    const minutes = Math.floor(currentTotal / 60);
    const seconds = currentTotal % 60;

    core.value = { ...core.value, minutes, seconds };

    if (currentStep >= steps) {
      clearInterval(interval);
      core.value = {
        ...core.value,
        minutes: targetMinutes,
        seconds: targetSeconds,
      };
      save("minutes", targetMinutes);
      save("seconds", targetSeconds);
      callback?.();
    }
  }, frameRate);
};

export const nextMode = () => {
  stopTimer();

  let nextMode: PomodoroStates;

  if (core.value.mode === "focus") {
    if (core.value.currentStep >= core.value.timesTillLongBreak) {
      nextMode = "long-break";
      core.value.currentStep = 0;
    } else {
      nextMode = "break";
    }
  } else {
    core.value.currentStep++;
    nextMode = "focus";
  }

  core.value = { ...core.value, mode: nextMode };

  // Использование кэшированного звука
  if (core.value.hasSoundEffects) {
    const cachedAudio = soundCache[nextMode];
    if (cachedAudio) {
      cachedAudio.currentTime = 0;
      cachedAudio.play();
    }
  }

  save("mode", nextMode);
  save("currentStep", core.value.currentStep);

  const { minutes: targetMinutes, seconds: targetSeconds } =
    core.value.presets[nextMode];

  animateTimeChange(targetMinutes, targetSeconds, () => {
    if (core.value.autoResume) {
      startTimer();
    }
  });

  if (Notification.permission === "granted") {
    new Notification(notificationTitle(), {
      body: notificationBody(),
      icon: iconMap[nextMode],
    });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification(notificationTitle(), {
          body: notificationBody(),
          icon: iconMap[nextMode],
        });
      }
    });
  }
};

export const switchAutoResume = () => {
  core.value = { ...core.value, autoResume: !core.value.autoResume };
  save("autoResume", core.value.autoResume);
};

export const startTimer = () => {
  if (core.value.isRunning) return;

  if (timerInterval) clearInterval(timerInterval);

  core.value = { ...core.value, isRunning: true };
  save("isRunning", true);

  timerInterval = setInterval(() => {
    if (core.value.seconds === 0) {
      if (core.value.minutes === 0) {
        clearInterval(timerInterval!);
        timerInterval = null;
        core.value.isRunning = false;
        save("isRunning", false);
        nextMode();
        return;
      } else {
        core.value = {
          ...core.value,
          minutes: core.value.minutes - 1,
          seconds: 59,
        };
      }
    } else {
      core.value = { ...core.value, seconds: core.value.seconds - 1 };
    }

    // debouncedSaveTime();
  }, 1000);
};

export const changeFocusLength = (value: number) => {
  if (value < 5 || value > 60) return;

  const updatedCore = {
    ...core.value,
    presets: {
      ...core.value.presets,
      focus: { ...core.value.presets.focus, minutes: value },
    },
  };

  save("focusMinutes", value);

  if (core.value.mode === "focus" && !core.value.isRunning) {
    updatedCore.minutes = value;
    updatedCore.seconds = 0;
    save("minutes", value);
    save("seconds", 0);
  }

  core.value = updatedCore;
};

export const changeShortBreakLength = (value: number) => {
  if (value < 5 || value > 60) return;

  const updatedCore = {
    ...core.value,
    presets: {
      ...core.value.presets,
      break: { ...core.value.presets.break, minutes: value },
    },
  };

  save("breakMinutes", value);

  if (core.value.mode === "break" && !core.value.isRunning) {
    updatedCore.minutes = value;
    updatedCore.seconds = 0;
    save("minutes", value);
    save("seconds", 0);
  }

  core.value = updatedCore;
};

export const changeLongBreakLength = (value: number) => {
  if (value < 5 || value > 60) return;

  const updatedCore = {
    ...core.value,
    presets: {
      ...core.value.presets,
      "long-break": {
        ...core.value.presets["long-break"],
        minutes: value,
      },
    },
  };

  save("longBreakMinutes", value);

  if (core.value.mode === "long-break" && !core.value.isRunning) {
    updatedCore.minutes = value;
    updatedCore.seconds = 0;
    save("minutes", value);
    save("seconds", 0);
  }

  core.value = updatedCore;
};

export const changeUntillBreak = (value: number) => {
  if (value < 2 || value > 20) return;

  core.value = {
    ...core.value,
    timesTillLongBreak: value,
  };
  save("timesTillLongBreak", value);
};

export const getMinutes = () => {
  return core.value.minutes.toString().padStart(2, "0");
};

export const getSeconds = () => {
  return core.value.seconds.toString().padStart(2, "0");
};

export default core;
