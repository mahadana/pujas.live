import { gql, useQuery } from "@apollo/client";
import { Container, makeStyles } from "@material-ui/core";

import Banner from "../components/Banner";
import ChantingBooksBar from "../components/ChantingBooksBar";
import GroupFormDialog from "../components/GroupFormDialog";
import GroupList from "../components/GroupList";
import StreamList from "../components/StreamList";
import UserBar from "../components/UserBar";
import { withApollo } from "../lib/context";

const useStyles = makeStyles((theme) => ({
  lead: {
    margin: 0,
    fontSize: "2.5em",
    fontWeight: 400,
  },
}));

const QUERY = gql`
  {
    streams(sort: "updated_at:desc") {
      id
      name
      description
      streamUrl
      previousStreamsUrl
      image {
        formats
      }
      monastery {
        name
        url
      }
    }
    groups(sort: "updated_at:desc", where: { confirmed: true }) {
      id
      name
      description
      image {
        formats
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
        {!loading && <StreamList streams={data.streams} />}
        <h2 className={classes.lead}>Open Sitting Groups</h2>
        {!loading && <GroupList groups={data.groups} />}
        <GroupFormDialog />
      </Container>
    </>
  );
};

export default withApollo({ ssr: true })(Home);
