import { ReactNode } from "preact/compat";
import BrainIcon from "../components/icons/BrainIcon";
import BreakIcon from "../components/icons/BreakIcon";
import { GlobalColors, PomodoroStates } from "./types";

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const replaceCharToSpace = (str: string, lineToRemove: string = "-") => {
  return str.replace(lineToRemove, " ");
};

export const returnColorBasedOnMode = (mode: PomodoroStates): GlobalColors => {
  switch (mode) {
    case "focus":
      return "red";
    case "break":
      return "green";
    case "long-break":
      return "blue";
  }
};

export const returnIconBasedOnMode = (mode: PomodoroStates): ReactNode => {
  switch (mode) {
    case "focus":
      return <BrainIcon />;
    default:
      return <BreakIcon />;
  }
};

export const save = (key: string, data: object | string | number | boolean) => {
  if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

export const load = (key: string) => {
  if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }
  return null;
};

export const getRandom = (arr: string[]) =>
  arr[Math.floor(Math.random() * arr.length)];
