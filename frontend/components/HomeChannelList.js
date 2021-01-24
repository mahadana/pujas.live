import { useState } from "react";
import { Box, makeStyles } from "@material-ui/core";

import HomeChannel from "@/components/HomeChannel";
import Link from "@/components/Link";

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

function HomeChannelList({ channels }) {
  const classes = useStyles();
  const [showMore, setShowMore] = useState(true);
  const handleShowMore = (event) => {
    event.preventDefault();
    setShowMore(false);
  };

  // Remove curated recordings where recording is null
  // TODO this is definetely not ideal
  channels = channels.map((channel) => {
    channel = Object.assign({}, channel);
    if (channel.curatedRecordings) {
      channel.curatedRecordings = channel.curatedRecordings.filter(
        (cr) => cr.recording
      );
    }
    return channel;
  });

  const hasMore = channels.length > MAX_INITIAL;
  const shownChannels =
    showMore && hasMore ? channels.slice(0, MAX_INITIAL) : channels;

  return (
    <Box className={classes.root}>
      <Box>
        {shownChannels.map((channel) => (
          <HomeChannel key={channel.id} {...channel} />
        ))}
      </Box>
      {showMore && hasMore && (
        <Box className={classes.showMore}>
          <Link href="#" onClick={handleShowMore}>
            Show more streams
          </Link>
        </Box>
      )}
    </Box>
  );
}

export default HomeChannelList;
