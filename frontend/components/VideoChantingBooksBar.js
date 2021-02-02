import { Box, makeStyles } from "@material-ui/core";
import { forwardRef } from "react";

import ChantingBookButton from "@/components/ChantingBookButton";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
    fontSize: "2.5vh",
    color: "#eee",
    fontWeight: "bold",
    textShadow: `0 0 4px black`,
    background:
      "radial-gradient(ellipse at left, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 70%)",
  },
}));

const VideoChantingBooksBar = forwardRef(({ onClose, onOpen }, ref) => {
  const classes = useStyles();
  return (
    <Box className={classes.root} ref={ref}>
      <ChantingBookButton
        book="1"
        direction="top"
        onClose={onClose}
        onOpen={onOpen}
      />
      <ChantingBookButton
        book="2"
        direction="top"
        onClose={onClose}
        onOpen={onOpen}
      />
    </Box>
  );
});

VideoChantingBooksBar.displayName = "VideoChantingBooksBar";

export default VideoChantingBooksBar;
