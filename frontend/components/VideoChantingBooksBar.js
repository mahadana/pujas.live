import { Box, makeStyles } from "@material-ui/core";
import Link from "next/link";
import { useState, forwardRef } from "react";

import IframeModal from "@/components/IframeModal";
import plausible from "@/lib/plausible";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
    padding: "0px",

    position: "relative",
    width: "100%",
    height: "100%",
    fontSize: "3vh",
    lineHeight: "4vh",
    textAlign: "center",
    textShadow: "0 0 0.2em #000",

    color: "white",
    background:
      "radial-gradient(ellipse at left, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 70%)",
  },
  book: {
    "& a": {
      color: "white",
      textDecoration: "none",
    },
    "& span": {
      display: "inline-block",
      verticalAlign: "top",
      width: "80%",
    },
    "& img": {
      marginTop: "0.3em",
      width: "60%",
    },
  },
  hidden: {
    display: "none",
  },
}));

const VideoChantingBooksBar = forwardRef((props, ref) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState(null);

  const openChantingBook = (event, n) => {
    event.preventDefault();
    setUrl("https://pujas.live/chanting/iframe.html?book=" + n);
    setOpen(true);
    plausible("chantingBook", { props: { book: `${n}` } });
  };

  const onClose = () => {
    setOpen(false);
    props.onClose();
  };

  return (
    <Box
      className={`${classes.root}${props.hidden ? " hidden" : ""}`}
      ref={ref}
    >
      <Box className={classes.book}>
        <Link href="#">
          <a onClick={(e) => openChantingBook(e, 1)}>
            <span>Chanting Book 1</span>
            <img src="/chanting1.jpg" />
          </a>
        </Link>
      </Box>
      <Box className={classes.book}>
        <Link href="#">
          <a onClick={(e) => openChantingBook(e, 2)}>
            <span>Chanting Book 2</span>
            <img src="/chanting2.jpg" />
          </a>
        </Link>
      </Box>
      <IframeModal url={url} open={open} onClose={onClose} />
    </Box>
  );
});

VideoChantingBooksBar.displayName = "VideoChantingBooksBar";

export default VideoChantingBooksBar;
