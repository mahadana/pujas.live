import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import { useState } from "react";

import HomeGroup from "@/components/HomeGroup";
import Link from "@/components/Link";

const MAX_INITIAL = 5;

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
          <HomeGroup key={group.id} group={group} />
        ))}
      </Box>
      {showMore && hasMore && (
        <Box className={classes.showMore}>
          <Link href="#" onClick={handleShowMore}>
            Show more groups
          </Link>
        </Box>
      )}
    </Box>
  );
}

export default GroupList;
