import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  typography: {
    h2: {
      fontSize: "2.2rem",
      fontWeight: 400,
    },
    h3: {
      fontSize: "1.8rem",
    },
    h4: {
      fontSize: "1.6rem",
    },
  },
  palette: {
    type: "dark",
    background: {
      default: "#3a1704",
      paper: "#3e1a08",
    },
    primary: {
      main: "#bf8432",
    },
    secondary: {
      main: "#6a611d",
    },
    text: {
      primary: "#ffffff",
      secondary: "#d8d0b0",
    },
    error: {
      main: "#ff7744",
    },
  },
});

export default theme;
