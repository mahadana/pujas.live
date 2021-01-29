import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { globalStyle } from "@/lib/styles";

import GroupList from "@/components/GroupList";
import HomeChannelList from "@/components/HomeChannelList";
import Link from "@/components/Link";
import ChannelRecordingsModal from "@/components/ChannelRecordingsModal";
import VideoModal from "@/components/VideoModal";

const useStyles = makeStyles((theme) => ({
  lead: globalStyle("lead"),
}));

const HomeContent = ({ channels, groups }) => {
  const classes = useStyles();
  return (
    <VideoModal>
      <ChannelRecordingsModal>
        <Container maxWidth="lg">
          {channels.length > 0 && (
            <>
              <Typography className={classes.lead} variant="h2">
                Livestreams
              </Typography>
              <HomeChannelList channels={channels} />
            </>
          )}
          {groups.length > 0 && (
            <>
              <Typography className={classes.lead} variant="h2">
                Open Sitting Groups
              </Typography>
              <GroupList groups={groups} />
            </>
          )}
          <Typography variant="body1">
            <Link href="/groups/create">+ Click here to post new group</Link>
          </Typography>
        </Container>
      </ChannelRecordingsModal>
    </VideoModal>
  );
};

export default HomeContent;
