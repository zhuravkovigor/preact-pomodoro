import { FC, ReactNode } from "preact/compat";
import styles from "./IconButton.module.css";
import { classNames } from "../../../lib/helpers";
import { GlobalColors } from "../../../lib/types";

type IconButtonSize = "medium" | "large";

type IconButtonProps = {
  onClick?: () => void;
  children: ReactNode;
  size?: IconButtonSize;
  color?: GlobalColors;
  isActive?: boolean;
};

const IconButton: FC<IconButtonProps> = (props) => {
  const { onClick, children, size = "medium", color = "red", isActive } = props;

  const className = classNames(
    styles.component,
    styles[size],
    styles[color],
    isActive && styles.active,
  );

  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
};

export default IconButton;
