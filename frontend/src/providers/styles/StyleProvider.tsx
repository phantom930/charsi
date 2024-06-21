import { ReactNode } from "react";
import { ThemeProvider } from "styled-components";
import GlobalStyle from "./GlobalStyles";
import themes from "./themes";

type Prop = {
  children: ReactNode;
  theme?: "light" | "dark";
};

const StyleProvider = ({ children, theme = "light" }: Prop) => {
  const themeObject = themes[theme];
  return (
    <ThemeProvider theme={themeObject}>
      <>
        {/* <CssBaseline /> */}
        <GlobalStyle />
        {children}
      </>
    </ThemeProvider>
  );
};

export default StyleProvider;
