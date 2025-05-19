import { signal } from "@preact/signals";
import { load, save } from "../lib/utils";

const theme = signal(load("theme") || "light");

export const switchTheme = () => {
  theme.value = theme.value === "light" ? "dark" : "light";
  save("theme", theme.value);
};

export default theme;
