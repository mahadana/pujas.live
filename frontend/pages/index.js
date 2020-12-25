import { gql, useQuery } from "@apollo/client";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";

import Banner from "../components/Banner";
import ChantingBooksBar from "../components/ChantingBooksBar";
import GroupList from "../components/GroupList";
import Link from "../components/Link";
import StreamList from "../components/StreamList";
import UserBar from "../components/UserBar";
import { withApolloAndUser } from "../lib/apollo";

const useStyles = makeStyles((theme) => ({
  lead: {
    margin: 0,
    fontSize: "2.5em",
    fontWeight: 400,
  },
}));

const QUERY = gql`
  {
    streams(sort: "startAt") {
      id
      name
      description
      image {
        formats
      }
      monastery {
        name
        websiteUrl
        channelUrl
      }
      streamUrl
      embeddable
      startAt
      duration
      historyUrl
    }
    groups(sort: "updated_at:desc", where: { confirmed: true }) {
      id
      name
      description
      image {
        formats
      }
      timezone
      events {
        id
        startAt
        duration
        daysOfWeek
      }
    }
  }
`;

const Home = () => {
  const classes = useStyles();
  const { loading, error, data } = useQuery(QUERY);

  return (
    <>
      <Banner />
      <ChantingBooksBar />
      <UserBar />
      {error && <p>Error loading data...</p>}
      <Container maxWidth="lg">
        <h2 className={classes.lead}>Livestreams</h2>
        {!loading && !error && <StreamList streams={data.streams} />}
        <h2 className={classes.lead}>Open Sitting Groups</h2>
        {!loading && !error && <GroupList groups={data.groups} />}
        <p>
          <Link href="/groups/create">+ Click here to post new group</Link>
        </p>
      </Container>
    </>
  );
};

export default withApolloAndUser()(Home);
