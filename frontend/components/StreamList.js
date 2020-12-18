import { Box, makeStyles } from "@material-ui/core";
import Stream from "./Stream";
import Link from "next/link";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "1em 0",
  },
  showMore: {
    margin: "1em 0",
    textAlign: "center",
  },
}));

function StreamList({ streams }) {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <Box>
        {streams.map((stream) => (
          <Stream key={stream.id} {...stream} />
        ))}
      </Box>
      <Box className={classes.showMore}>
        <Link href="#">
          <a>Show more livestreams</a>
        </Link>
      </Box>
    </Box>
  );
}

export default StreamList;
