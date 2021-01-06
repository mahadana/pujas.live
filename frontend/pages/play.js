import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Slide from "@material-ui/core/Slide";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useState } from "react";

const SlideBar = ({ children, width = 100, height = 100, leaveDelay = 0 }) => {
  const [visible, setVisible] = useState(false);
  let timeout = null;
  const onMouseEnter = (event) => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    setVisible(true);
  };
  const onMouseLeave = (event) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => setVisible(false), leaveDelay);
  };
  return (
    <Box
      style={{
        position: "absolute",
        top: "50%",
        left: 0,
        marginTop: -parseInt(height / 2),
        width,
        height,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Slide direction="right" in={visible} mountOnEnter unmountOnExit>
        <Box style={{ width, height, overflow: "hidden" }}>{children}</Box>
      </Slide>
    </Box>
  );
};

const Play = () => {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("sm"));
  // xs, sm, md, lg

  return (
    <Box
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
      }}
    >
      <Box>{desktop ? "desktop" : "mobile"}</Box>
      <SlideBar
        width={desktop ? 200 : 150}
        height={desktop ? 400 : 300}
        leaveDelay={500}
      >
        <Box
          style={{
            width: "90%",
            height: "45%",
            backgroundColor: "#fe9",
            margin: "5%",
          }}
        >
          Chanting book 1
        </Box>
        <Box
          style={{
            width: "90%",
            height: "45%",
            backgroundColor: "#fe9",
            margin: "5%",
          }}
        >
          Chanting book 2
        </Box>
      </SlideBar>
    </Box>
  );
};

export default Play;
