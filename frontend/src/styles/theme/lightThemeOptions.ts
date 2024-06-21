import { ThemeOptions } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    disabled: Palette["primary"];
    gradient: Palette["primary"];
  }

  interface PaletteOptions {
    disabled?: PaletteOptions["primary"];
    gradient?: Palette["primary"];
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    disabled: true;
  }
}

const lightThemeOptions: ThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#7C4DFF",
    },
    secondary: {
      main: "#FF47AA",
    },
    success: {
      main: "#4CAF50",
      contrastText: "#fff",
    },
    info: {
      main: "#2196F3",
    },
    warning: {
      main: "#FF9800",
      contrastText: "#fff",
    },
    disabled: {
      main: "#E0E0E0",
      contrastText: "rgba(0, 0, 0, 0.87)",
    },
    gradient: {
      main: "linear-gradient(252.31deg, #7C4DFF 37.91%, #7C4DFF 37.91%, #FB4DFF 86.97%)",
      light:
        "linear-gradient(265.32deg, rgba(124, 77, 255, 0.15) -3.64%, rgba(124, 77, 255, 0.26) -3.63%, rgba(251, 77, 255, 0.15) 67.56%)",
      dark: "linear-gradient(252.31deg, #7C4DFF 37.91%, #7C4DFF 37.91%, #FB4DFF 86.97%)",
      contrastText: "#fff",
    },
    common: {
      black: "rgba(0, 0, 0, 0.87)",
    },
  },
  typography: {
    fontFamily: [
      "Aeonik",
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
  },
  components: {
    MuiAccordion: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          border: `1px solid #eee`,
          borderRadius: "8px",
          "&::before": {
            opacity: 0,
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          counterIncrement: "list-item",
          paddingLeft: "38px",
          position: "relative",
          "&::before": {
            content: "counter(list-item)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "32px",
            height: "32px",
            lineHeight: "32px",
            textAlign: "center",
            borderRadius: "50%",
            border: `2px solid ${theme.palette.primary.main}`,
            backgroundColor: `${theme.palette.primary.main}`,
            color: "#fff",
            position: "absolute",
            left: "0",
            top: "8px",
          },
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 400,
        },
      },
    },
  },
};

export default lightThemeOptions;
