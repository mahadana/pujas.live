import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
import { useIdleTimer } from "react-idle-timer";

import darkTheme from "@/lib/theme";

const lightTheme = createMuiTheme({
  ...darkTheme,
  palette: {
    type: "light",
  },
});

const useStyles = makeStyles((theme) => ({
  root: ({ maximize }) => ({
    position: "fixed",
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    fontSize: "1.25rem",
    ...(maximize
      ? {
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
        }
      : {
          width: "90vw",
          height: "92vh",
          top: "50%",
          left: "50%",
          marginLeft: "max(-45vw,-24rem)",
          marginTop: "-46vh",
          maxWidth: "48rem",
          borderRadius: "0.25rem",
          boxShadow: "1px 1px 6px rgb(0 0 0 / 80%)",
        }),
  }),
}));

const ChantingWindowInner = ({ children, maximize, onActive, onIdle }) => {
  const classes = useStyles({ maximize });
  useIdleTimer({
    debounce: 500,
    onActive,
    onIdle,
    timeout: 1000 * 5,
  });
  return <div className={classes.root}>{children}</div>;
};

const ChantingWindow = ({ children, themeType = "dark", ...props }) => (
  <ThemeProvider theme={themeType === "dark" ? darkTheme : lightTheme}>
    <ChantingWindowInner {...props}>{children}</ChantingWindowInner>
  </ThemeProvider>
);

export default ChantingWindow;
