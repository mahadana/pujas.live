import { createMuiTheme } from "@material-ui/core/styles";
// import { red } from "@material-ui/core/colors";

const theme = createMuiTheme({
  typography: {
    h2: {
      margin: "0.5em",
      fontSize: "2.5em",
      fontWeight: 400,
    },
    body1: {
      margin: "0.5em",
    },
  },
  // palette: {
  //   primary: {
  //     main: "#556cd6",
  //   },
  //   secondary: {
  //     main: "#19857b",
  //   },
  //   error: {
  //     main: red.A400,
  //   },
  //   background: {
  //     default: "#fff",
  //   },
  // },
});

export default theme;
