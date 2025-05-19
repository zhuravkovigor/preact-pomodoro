import MenuIcon from "../../icons/MenuIcon";
import IconButton from "../../ui/IconButton";
import styles from "./Actions.module.css";

import core, { nextMode, pauseTimer, startTimer } from "../../../store/core";
import PauseIcon from "../../icons/PauseIcon";
import PlayIcon from "../../icons/PlayIcon";
import NextIcon from "../../icons/NextIcon";
import { returnColorBasedOnMode } from "../../../lib/utils";
import { openModal } from "../../../store/modal";
import { useEffect, useRef } from "preact/hooks";

const Actions = () => {
  const actionIcon = core.value.isRunning ? <PauseIcon /> : <PlayIcon />;
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio("/sounds/click.mp3");
    audioRef.current.load();
  }, []);

  const actionClick = () => {
    if (core.value.hasSoundEffects) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }

    if (core.value.isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  };

  return (
    <div class={styles.component}>
      <IconButton
        onClick={() => openModal("settings")}
        size="medium"
        color={returnColorBasedOnMode(core.value.mode)}
      >
        <MenuIcon />
      </IconButton>
      <IconButton
        isActive={core.value.isRunning}
        onClick={actionClick}
        size="large"
        color={returnColorBasedOnMode(core.value.mode)}
      >
        {actionIcon}
      </IconButton>
      <IconButton
        onClick={nextMode}
        size="medium"
        color={returnColorBasedOnMode(core.value.mode)}
      >
        <NextIcon />
      </IconButton>
    </div>
  );
};

export default Actions;
