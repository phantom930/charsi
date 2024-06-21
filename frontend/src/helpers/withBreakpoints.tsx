// import { Theme, useMediaQuery } from '@material-ui/core';

// interface Breakpoints {
//   xs: boolean;
//   sm: boolean;
//   md: boolean;
//   lg: boolean;
//   xl: boolean;
//   xxl: boolean;
// }

// function useBreakpointsHook() {
//   const xs = useMediaQuery((theme: Theme) => theme.breakpoints.up('xs'));
//   const sm = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));
//   const md = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
//   const lg = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
//   const xl = useMediaQuery((theme: Theme) => theme.breakpoints.up('xl'));
//   const xxl = useMediaQuery((theme: Theme) => theme.breakpoints.up('xxl'));

//   return { xs, sm, md, lg, xl, xxl };
// }

// export default function withBreakpoints<T>(Component: React.ComponentType<T & { breakpoints: Breakpoints }>) {
//   const breakpoints = useBreakpointsHook();

//   return (props: T) => (
//     <Component {...props} breakpoints={breakpoints} />
//   );
// }

// eslint-disable-next-line import/no-anonymous-default-export, react/display-name
export default () => <p></p>;
