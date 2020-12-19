import { useState } from "react";
import { Box, makeStyles } from "@material-ui/core";
import Link from "next/link";
import IframeModal from "./IframeModal";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "flex-end",
    margin: "2em 2em 0",
  },
  book: {
    marginLeft: "2em",
    "& a": {
      color: "black",
      textDecoration: "none",
      fontSize: "1.5em",
    },
    "& span": {
      display: "inline-block",
      verticalAlign: "top",
      width: "90px",
    },
    "& img": {
      width: "60px",
    },
  },
}));

const ChantingBooksBar = () => {
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
  };

  return (
    <Box className={classes.root}>
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
};

export default ChantingBooksBar;
