import { FC, ReactNode } from "preact/compat";
import { GlobalColors } from "../../../lib/types";
import styles from "./Chip.module.css";
import { classNames } from "../../../lib/helpers";

type ChipProps = {
  color?: GlobalColors;
  icon?: ReactNode;
  children: string | string[];
};

const Chip: FC<ChipProps> = (props) => {
  const { color, icon, children } = props;

  const componentClass = classNames(styles.component, styles[color]);

  return (
    <div class={componentClass}>
      {icon && icon}
      {children}
    </div>
  );
};

export default Chip;
