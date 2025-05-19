import { effect } from "@preact/signals";
import { classNames } from "../../../lib/helpers";
import core, {
  getMinutes,
  getSeconds,
  removeIntervalTimer,
} from "../../../store/core";
import MenuIcon from "../../icons/MenuIcon";
import NextIcon from "../../icons/NextIcon";
import PauseIcon from "../../icons/PauseIcon";
import PlayIcon from "../../icons/PlayIcon";
import IconButton from "../../ui/IconButton";

import styles from "./Timer.module.css";
import { useEffect } from "preact/hooks";
import { panelTitle } from "../../../lib/constants";

const Timer = () => {
  const timeClasses = classNames(
    styles.time,
    styles[core.value.mode],
    core.value.isRunning && styles.running,
  );

  effect(() => {
    if (typeof window !== "undefined") {
      window.document.title = panelTitle();
    }
  });

  useEffect(() => {
    return () => {
      removeIntervalTimer();
    };
  }, []);

  return (
    <div class={styles.component}>
      <h2 class={timeClasses}>
        <span>{getMinutes()}</span>
        <span>{getSeconds()}</span>
      </h2>
    </div>
  );
};

export default Timer;
