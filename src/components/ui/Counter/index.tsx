import { FC } from "preact/compat";
import styles from "./Counter.module.css";
import ArrowTopIcon from "../../icons/ArrowTopIcon";
import ArrowBottomIcon from "../../icons/ArrowBottomIcon";
import theme from "../../../store/theme";

type CounterProps = {
  value?: number;
  step?: number;
  onIncrease?: () => void;
  onDecrease?: () => void;
};

const Counter: FC<CounterProps> = (props) => {
  const { value = 0, step = 5, onIncrease, onDecrease } = props;

  return (
    <div class={styles.component}>
      <div class={styles.value}>{value}</div>
      <div class={styles.actions}>
        <button onClick={onIncrease}>
          <ArrowTopIcon size={12} />
        </button>
        <button onClick={onDecrease}>
          <ArrowBottomIcon size={12} />
        </button>
      </div>
    </div>
  );
};

export default Counter;
