import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import HomeGroupList from "@/components/HomeGroupList";
import HomeChannelList from "@/components/HomeChannelList";
import Link from "@/components/Link";
import PageHeading from "@/components/PageHeading";

const useStyles = makeStyles((theme) => ({
  groupHeading: {
    marginTop: "3rem",
  },
}));

const HomeContent = ({ channels, groups }) => {
  const classes = useStyles();

  return (
    <Container maxWidth="lg">
      {channels.length > 0 && (
        <>
          <PageHeading>Livestreams</PageHeading>
          <HomeChannelList channels={channels} />
        </>
      )}
      {groups.length > 0 && (
        <>
          <PageHeading className={classes.groupHeading}>
            Open Sitting Groups
          </PageHeading>
          <HomeGroupList groups={groups} />
        </>
      )}
      <Typography variant="body1">
        <Link href="/group/create">+ Click here to post new group</Link>
      </Typography>
    </Container>
  );
};

export default HomeContent;
