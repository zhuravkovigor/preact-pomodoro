import { FC } from "preact/compat";
import { IconProps } from "../../lib/types";
import { DEFAULT_ICON_SIZE } from "../../lib/constants";

const PlayIcon: FC<IconProps> = (props) => {
  const { size = DEFAULT_ICON_SIZE, class: className } = props;

  return (
    <svg
      width={size + "px"}
      height={size + "px"}
      class={className}
      viewBox="0 0 32 32"
      fill="none"
    >
      <path
        d="M30 16C29.9992 16.3439 29.9104 16.6818 29.7419 16.9816C29.5734 17.2814 29.3309 17.533 29.0375 17.7125L11.0375 28.7C10.7377 28.89 10.3914 28.9939 10.0365 29.0006C9.68159 29.0072 9.33169 28.9162 9.02499 28.7375C8.71376 28.5667 8.4543 28.3152 8.27392 28.0095C8.09355 27.7037 7.99892 27.355 7.99999 27V4.99996C7.99892 4.64496 8.09355 4.29623 8.27392 3.99047C8.4543 3.68471 8.71376 3.43322 9.02499 3.26246C9.33169 3.08376 9.68159 2.99275 10.0365 2.99936C10.3914 3.00597 10.7377 3.10996 11.0375 3.29996L29.0375 14.2875C29.3309 14.4669 29.5734 14.7185 29.7419 15.0183C29.9104 15.3181 29.9992 15.6561 30 16V16Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default PlayIcon;
