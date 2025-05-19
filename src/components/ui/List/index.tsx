import { FC, ReactNode } from "preact/compat";
import styles from "./List.module.css";
import { returnColorBasedOnMode } from "../../../lib/utils";
import core from "../../../store/core";
import { classNames } from "../../../lib/helpers";

export type ListItem = {
  label: string;
  rightChild?: ReactNode;
  bottomChild?: ReactNode;
};

type ListProps = {
  options: ListItem[];
};

const List: FC<ListProps> = (props) => {
  const { options } = props;

  const color = returnColorBasedOnMode(core.value.mode);

  const optionClassNames = classNames(styles.option, styles[color]);

  return (
    <div>
      {options.map((option) => (
        <div class={optionClassNames}>
          <div class={styles.optionHeader} key={option.label}>
            <h2 class={styles.label}>{option.label}</h2>
            {option.rightChild && <div>{option.rightChild}</div>}
          </div>

          {option.bottomChild && <div>{option.bottomChild}</div>}
        </div>
      ))}
    </div>
  );
};

export default List;
