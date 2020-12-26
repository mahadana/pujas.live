import { gql, useQuery } from "@apollo/client";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";

import Banner from "../components/Banner";
import ChantingBooksBar from "../components/ChantingBooksBar";
import GroupList from "../components/GroupList";
import Link from "../components/Link";
import Loading from "../components/Loading";
import StreamList from "../components/StreamList";
import UserBar from "../components/UserBar";
import { withApollo } from "../lib/apollo";

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
  const { loading, error, data } = useQuery(QUERY, {
    fetchPolicy: "cache-and-network",
  });
  const classes = useStyles();
  const streams = data?.streams;
  const groups = data?.groups;

  return (
    <>
      <Banner />
      <ChantingBooksBar />
      <UserBar />
      <Container maxWidth="lg">
        {error ? (
          <p>Error loading data...</p>
        ) : loading || !streams || !groups ? (
          <Loading />
        ) : (
          <>
            <h2 className={classes.lead}>Livestreams</h2>
            <StreamList streams={streams} />
            <h2 className={classes.lead}>Open Sitting Groups</h2>
            <GroupList groups={groups} />
          </>
        )}
        <p>
          <Link href="/groups/create">+ Click here to post new group</Link>
        </p>
      </Container>
    </>
  );
};

export default withApollo()(Home);
