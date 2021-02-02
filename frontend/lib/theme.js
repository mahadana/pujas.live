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
