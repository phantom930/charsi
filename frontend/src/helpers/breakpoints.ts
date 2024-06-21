export const BREAKPOINTS = {
  xxs: 320,
  xs: 500,
  sm: 720,
  md: 900,
  lg: 1200,
  xl: 1536,
};

type Mq = keyof typeof BREAKPOINTS;
export const mq = Object.keys(BREAKPOINTS)
  .map((key) => [key, BREAKPOINTS[key as Mq]] as [Mq, number])
  .reduce((prev, [key, breakpoint]) => {
    prev[key] = `@media (min-width: ${breakpoint}px)`;
    return prev;
  }, {} as Record<Mq, string>);

export const breakPointsObj = Object.entries(BREAKPOINTS);
