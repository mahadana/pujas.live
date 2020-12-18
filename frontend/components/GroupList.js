import { useState } from "react";
import { Box, makeStyles } from "@material-ui/core";
import Link from "next/link";
import Group from "./Group";

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

function GroupList({ groups }) {
  const classes = useStyles();
  const [showMore, setShowMore] = useState(true);
  const handleShowMore = (event) => {
    event.preventDefault();
    setShowMore(false);
  };

  const hasMore = groups.length > MAX_INITIAL;
  const shownGroups =
    showMore && hasMore ? groups.slice(0, MAX_INITIAL) : groups;

  return (
    <Box className={classes.root}>
      <Box>
        {shownGroups.map((group) => (
          <Group key={group.id} {...group} />
        ))}
      </Box>
      {showMore && hasMore && (
        <Box className={classes.showMore}>
          <Link href="#">
            <a onClick={handleShowMore}>Show more groups</a>
          </Link>
        </Box>
      )}
    </Box>
  );
}

export default GroupList;
