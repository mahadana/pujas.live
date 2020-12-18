import { Box, makeStyles } from "@material-ui/core";
import Link from "next/link";

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

  return (
    <Box className={classes.root}>
      <Box className={classes.book}>
        <Link href="https://pujas.live/chanting/iframe.html?book=1">
          <a>
            <span>Chanting Book 1</span>
            <img src="/chanting1.jpg" />
          </a>
        </Link>
      </Box>
      <Box className={classes.book}>
        <Link href="https://pujas.live/chanting/iframe.html?book=2">
          <a>
            <span>Chanting Book 2</span>
            <img src="/chanting2.jpg" />
          </a>
        </Link>
      </Box>
    </Box>
  );
};

export default ChantingBooksBar;
