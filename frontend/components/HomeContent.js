import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

import HomeGroupList from "@/components/HomeGroupList";
import HomeChannelList from "@/components/HomeChannelList";
import Link from "@/components/Link";

const HomeContent = ({ channels, groups }) => (
  <Container maxWidth="lg">
    {channels.length > 0 && (
      <>
        <Typography variant="h2">Livestreams</Typography>
        <HomeChannelList channels={channels} />
      </>
    )}
    {groups.length > 0 && (
      <>
        <Typography variant="h2">Open Sitting Groups</Typography>
        <HomeGroupList groups={groups} />
      </>
    )}
    <Typography variant="body1">
      <Link href="/group/create">+ Click here to post new group</Link>
    </Typography>
  </Container>
);

export default HomeContent;
