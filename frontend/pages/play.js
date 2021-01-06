import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Slide from "@material-ui/core/Slide";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useState } from "react";

const SlideBar = ({ children, width = 100, height = 100 }) => {
  const [visible, setVisible] = useState(false);
  const toggleVisible = () => {
    setVisible((prev) => !prev);
  };
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
    timeout = setTimeout(() => setVisible(false), 500);
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
        <Box style={{ width, height }}>{children}</Box>
      </Slide>
    </Box>
  );
};

const Play = () => {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("sm"));
  // xs, sm, md, lg

  return (
    <Container>
      <h1>Playground</h1>
      <Box
        style={{
          position: "relative",
          backgroundColor: "#9fe",
          height: "80vh",
        }}
      >
        <h2>OnMouseEnter / OnMouseLeave</h2>
        <p>{desktop ? "desktop" : "mobile"}</p>
        <SlideBar width={desktop ? 300 : 100} height={desktop ? 400 : 200}>
          <div
            style={{ width: "100%", height: "100%", backgroundColor: "green" }}
          >
            Chanting book 1
          </div>
        </SlideBar>
      </Box>
    </Container>
  );
};

export default Play;
