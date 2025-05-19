import { hydrate, prerender as ssr } from "preact-iso";
import { useEffect, useState } from "preact/hooks";
import { PomodoroStates } from "./lib/types";
import { classNames } from "./lib/helpers";
import Timer from "./components/parts/Timer";
import core, {
  changeFocusLength,
  changeLongBreakLength,
  changeShortBreakLength,
  changeUntillBreak,
  switchAutoResume,
  switchSoundEffects,
} from "./store/core";

import "./style.css";
import styles from "./style.module.css";

import Actions from "./components/parts/Actions";
import Chip from "./components/ui/Chip";
import BrainIcon from "./components/icons/BrainIcon";
import {
  replaceCharToSpace,
  returnColorBasedOnMode,
  capitalizeFirstLetter,
  returnIconBasedOnMode,
  save,
} from "./lib/utils";
import Modal from "./components/ui/Modal";
import List from "./components/ui/List";
import Switcher from "./components/ui/Switcher";
import theme, { switchTheme } from "./store/theme";
import { effect } from "@preact/signals";
import modals, { closeModal } from "./store/modal";
import Counter from "./components/ui/Counter";
import { iconMap } from "./lib/constants";

export function App() {
  const appClasses = classNames(styles.app, styles[core.value.mode]);

  const chipTitle = capitalizeFirstLetter(replaceCharToSpace(core.value.mode));
  const chipIcon = returnIconBasedOnMode(core.value.mode);

  effect(() => {
    if (typeof window !== "undefined") {
      document.body.setAttribute("data-theme", theme.value);
    }
  });

  effect(() => {
    if (typeof window !== "undefined") {
      const favicon = document.querySelector(
        "link[rel~='icon']",
      ) as HTMLLinkElement;

      if (!favicon) {
        const link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }

      const currentFavicon = iconMap[core.value.mode];
      const faviconElement = document.querySelector(
        "link[rel~='icon']",
      ) as HTMLLinkElement;

      if (faviconElement) {
        faviconElement.href = currentFavicon;
      }
    }
  });

  effect(() => {
    if (typeof window !== "undefined") {
      document.body.setAttribute(
        "data-mode-color",
        returnColorBasedOnMode(core.value.mode),
      );
    }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      save("minutes", core.value.minutes);
      save("seconds", core.value.seconds);
    }, 5_000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div class={appClasses}>
      <Modal
        isOpen={modals.value.settings}
        onClose={() => closeModal("settings")}
        title="Settings"
      >
        <List
          options={[
            {
              label: "Dark mode",
              rightChild: (
                <Switcher
                  checked={theme.value === "dark"}
                  onChange={switchTheme}
                />
              ),
            },
            {
              label: "Focus length",
              rightChild: (
                <Counter
                  onIncrease={() => {
                    changeFocusLength(core.value.presets.focus.minutes + 5);
                  }}
                  onDecrease={() => {
                    changeFocusLength(core.value.presets.focus.minutes - 5);
                  }}
                  value={core.value.presets.focus.minutes}
                />
              ),
            },
            {
              label: "Pomodoros until long break",
              rightChild: (
                <Counter
                  onIncrease={() => {
                    changeUntillBreak(core.value.timesTillLongBreak + 1);
                  }}
                  onDecrease={() => {
                    changeUntillBreak(core.value.timesTillLongBreak - 1);
                  }}
                  value={core.value.timesTillLongBreak}
                />
              ),
            },
            {
              label: "Short break length",
              rightChild: (
                <Counter
                  onIncrease={() => {
                    changeShortBreakLength(
                      core.value.presets.break.minutes + 5,
                    );
                  }}
                  onDecrease={() => {
                    changeShortBreakLength(
                      core.value.presets.break.minutes - 5,
                    );
                  }}
                  value={core.value.presets.break.minutes}
                />
              ),
            },
            {
              label: "Long break length",
              rightChild: (
                <Counter
                  onIncrease={() => {
                    changeLongBreakLength(
                      core.value.presets["long-break"].minutes + 5,
                    );
                  }}
                  onDecrease={() => {
                    changeLongBreakLength(
                      core.value.presets["long-break"].minutes - 5,
                    );
                  }}
                  value={core.value.presets["long-break"].minutes}
                />
              ),
            },
            {
              label: "Auto resume timer",
              rightChild: (
                <Switcher
                  checked={core.value.autoResume}
                  onChange={switchAutoResume}
                />
              ),
            },
            {
              label: "Sound effects",
              rightChild: (
                <Switcher
                  checked={core.value.hasSoundEffects}
                  onChange={switchSoundEffects}
                />
              ),
            },
          ]}
        />
      </Modal>

      <div class={styles.chips}>
        <Chip color={returnColorBasedOnMode(core.value.mode)} icon={chipIcon}>
          {chipTitle}
        </Chip>
        <Chip color={returnColorBasedOnMode(core.value.mode)}>
          {core.value.currentStep.toString()} /{" "}
          {core.value.timesTillLongBreak.toString()}
        </Chip>
      </div>

      <Timer />
      <Actions />
    </div>
  );
}

if (typeof window !== "undefined") {
  hydrate(<App />, document.getElementById("app"));
}

export async function prerender(data) {
  return await ssr(<App {...data} />);
}
