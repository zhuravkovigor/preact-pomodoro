import { FC } from "preact/compat";
import { IconProps } from "../../lib/types";
import { DEFAULT_ICON_SIZE } from "../../lib/constants";

const ArrowBottomIcon: FC<IconProps> = (props) => {
  const { size = DEFAULT_ICON_SIZE, class: className } = props;

  return (
    <svg
      width={size + "px"}
      height={size + "px"}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 10L12 15L17 10"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default ArrowBottomIcon;
