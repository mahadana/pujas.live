import { useState, forwardRef } from "react";
import { Box, makeStyles } from "@material-ui/core";
import Link from "next/link";
import IframeModal from "./IframeModal";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    //justifyContent: "flex-end",
    //margin: "2em 2em 0",

    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "0px",

    position: "absolute",
    height: "100%",

    background: "linear-gradient(90deg, rgba(0, 0, 0, 0.53) 0%, rgba(0, 0, 0, 0) 100%)",
  },
  book: {
    marginLeft: "2em",
    "& a": {
      //color: "white",
      textDecoration: "none",
      fontSize: "1.5em",
    },
    "& span": {
      display: "inline-block",
      verticalAlign: "top",
      width: "90px",
      color: "white",
    },
    "& img": {
      width: "60px",
    },
  },
  hidden: {
    display: "none",
  }
}));


const VideoChantingBooksBar = forwardRef((props , ref)  => {

  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState(null);

  const openChantingBook = (event, n) => {
    event.preventDefault();
    setUrl("https://pujas.live/chanting/iframe.html?book=" + n);
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    props.onClose();
  };

  return (
    <Box className={`${classes.root}${props.hidden ? " hidden" : ""}`} ref={ref} onMouseOver={props.onMouseOver}>
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

export default VideoChantingBooksBar;
