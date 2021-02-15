import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  typography: {
    h2: {
      fontSize: "2rem",
      fontWeight: 400,
    },
    h3: {
      fontSize: "1.8rem",
    },
    h4: {
      fontSize: "1.6rem",
    },
    button: {
      textTransform: "none",
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
  lineClamp: (lines) => ({
    // display: "box",
    display: "-webkit-box",
    "-webkit-line-clamp": lines,
    lineClamp: lines,
    "-webkit-box-orient": "vertical",
    boxOrient: "vertical",
    overflow: "hidden",
  }),
});

export default theme;
