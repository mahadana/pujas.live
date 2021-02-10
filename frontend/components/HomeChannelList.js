import { makeStyles } from "@material-ui/core/styles";
import { useState } from "react";

import HomeChannel from "@/components/HomeChannel";
import Link from "@/components/Link";

const MAX_INITIAL = 8;

const useStyles = makeStyles((theme) => ({
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

  const hasMore = channels.length > MAX_INITIAL;
  const shownChannels =
    showMore && hasMore ? channels.slice(0, MAX_INITIAL) : channels;

  return (
    <>
      {shownChannels.map((channel) => (
        <HomeChannel key={channel.id} channel={channel} />
      ))}
      {showMore && hasMore && (
        <div className={classes.showMore}>
          <Link href="#" onClick={handleShowMore}>
            Show more streams
          </Link>
        </div>
      )}
    </>
  );
}

export default HomeChannelList;
