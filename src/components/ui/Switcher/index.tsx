import { ChangeEvent, FC } from "preact/compat";
import styles from "./Switcher.module.css";
import { classNames } from "../../../lib/helpers";
import core from "../../../store/core";
import { returnColorBasedOnMode } from "../../../lib/utils";

type SwitcherProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

const Switcher: FC<SwitcherProps> = (props) => {
  const { checked, onChange } = props;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.currentTarget.checked);
  };

  const color = returnColorBasedOnMode(core.value.mode);

  const componentClassNames = classNames(
    styles.component,
    styles[color],
    checked && styles.active,
  );

  return (
    <label className={componentClassNames}>
      <div class={styles.circle} />
      <input checked={checked} onClick={handleChange} hidden />
    </label>
  );
};

export default Switcher;
