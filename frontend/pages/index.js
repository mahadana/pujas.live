import { useQuery } from "@apollo/client";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";

import Banner from "@/components/Banner";
import ChantingBooksBar from "@/components/ChantingBooksBar";
import GroupList from "@/components/GroupList";
import HomeChannelList from "@/components/HomeChannelList";
import Link from "@/components/Link";
import Loading from "@/components/Loading";
import { withApollo } from "@/lib/apollo";
import { HOME_QUERY } from "@/lib/schema";

const useStyles = makeStyles((theme) => ({
  lead: {
    margin: 0,
    fontSize: "2.5em",
    fontWeight: 400,
  },
}));

const Home = () => {
  const { loading, error, data } = useQuery(HOME_QUERY, {
    fetchPolicy: "cache-and-network",
  });
  const classes = useStyles();
  const channels = data?.channels;
  const groups = data?.groups;

  return (
    <>
      <Banner />
      <ChantingBooksBar />
      <Container maxWidth="lg">
        {error ? (
          <p>Error loading data...</p>
        ) : loading ? (
          <Loading />
        ) : (
          <>
            {channels && channels.length > 0 && (
              <>
                <h2 className={classes.lead}>Livestreams</h2>
                <HomeChannelList channels={channels} />
              </>
            )}
            {groups && groups.length > 0 && (
              <>
                <h2 className={classes.lead}>Open Sitting Groups</h2>
                <GroupList groups={groups} />
              </>
            )}
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
