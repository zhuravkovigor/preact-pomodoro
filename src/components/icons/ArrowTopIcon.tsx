import { FC } from "preact/compat";
import { IconProps } from "../../lib/types";
import { DEFAULT_ICON_SIZE } from "../../lib/constants";

const ArrowTopIcon: FC<IconProps> = (props) => {
  const { size = DEFAULT_ICON_SIZE, class: className } = props;

  return (
    <svg
      width={size + "px"}
      height={size + "px"}
      viewBox="0 0 24 24"
      class={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17 15L12 10L7 15"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default ArrowTopIcon;
