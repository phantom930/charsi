import { varBounceOut } from "./BounceOut";

const TRANSITION_ENTER = {
  duration: 1,
  ease: [0.43, 0.13, 0.23, 0.96],
};

export const varBounceIn = {
  animate: {
    scale: [0.3, 1.1, 0.9, 1.03, 0.97, 1],
    opacity: [0, 1, 1, 1, 1, 1],
    transition: TRANSITION_ENTER,
  },
  exit: varBounceOut.animate,
};
