import core, { getMinutes, getSeconds } from "../store/core";
import { PomodoroStates } from "./types";
import { getRandom } from "./utils";

export const DEFAULT_ICON_SIZE = 32;

export const iconMap: Record<PomodoroStates, string> = {
  focus: "/icons/focus.svg",
  break: "/icons/break.svg",
  "long-break": "/icons/long-break.svg",
};

export const notificationTitle = () => {
  switch (core.value.mode) {
    case "focus":
      return getRandom([
        "🚀 Ready to Focus?",
        "🧠 Let’s Get in the Zone!",
        "📚 Time to Concentrate!",
      ]);
    case "break":
      return getRandom([
        "☕ Break Time!",
        "🧘‍♂️ Relax Moment",
        "🍵 Time to Recharge",
      ]);
    case "long-break":
      return getRandom([
        "🏖️ Long Break!",
        "🦾 You’ve Earned a Rest!",
        "🌿 Deep Breath Time",
      ]);
  }
};

export const notificationBody = () => {
  switch (core.value.mode) {
    case "focus":
      return getRandom([
        "Let’s crush this task! 💥",
        "You got this — stay focused! 💡",
        "Time to create magic 🔮",
      ]);
    case "break":
      return getRandom([
        "Stretch a little and breathe 🧘‍♀️",
        "Tea? Coffee? Just chill ☕️",
        "Take a minute to smile 😊",
      ]);
    case "long-break":
      return getRandom([
        "You’ve been awesome — now relax 🌴",
        "Go walk around, grab some water 💧",
        "Give your brain a break — it deserves it 🧠💤",
      ]);
  }
};

export const panelTitle = () => {
  switch (core.value.mode) {
    case "focus":
      return `${getMinutes()}:${getSeconds()} – Deep Focus Mode 🧠`;
    case "break":
      return `${getMinutes()}:${getSeconds()} – Take a short break ☕`;
    case "long-break":
      return `${getMinutes()}:${getSeconds()} – Time to recharge! 💧`;
    default:
      return `${getMinutes()}:${getSeconds()} – Pomodoro`;
  }
};
