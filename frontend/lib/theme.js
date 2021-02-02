import { createMuiTheme } from "@material-ui/core/styles";

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
  palette: {
    // type: "dark",
    // primary: {
    //   main: "#ffaf6c",
    // },
    // secondary: {
    //   main: "#234915",
    // },
    // background: {
    //   default: "#421904",
    //   paper: "#522914",
    // },
  },
});

export default theme;
