import { useState } from "react";
import { Box, makeStyles } from "@material-ui/core";
import Link from "next/link";
import Stream from "./Stream";

const MAX_INITIAL = 3;

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
  const [showMore, setShowMore] = useState(true);
  const handleShowMore = (event) => {
    event.preventDefault();
    setShowMore(false);
  };

  const hasMore = streams.length > MAX_INITIAL;
  const shownStreams =
    showMore && hasMore ? streams.slice(0, MAX_INITIAL) : streams;

  return (
    <Box className={classes.root}>
      <Box>
        {shownStreams.map((stream) => (
          <Stream key={stream.id} {...stream} />
        ))}
      </Box>
      {showMore && hasMore && (
        <Box className={classes.showMore}>
          <Link href="#">
            <a onClick={handleShowMore}>Show more streams</a>
          </Link>
        </Box>
      )}
    </Box>
  );
}

export default StreamList;
