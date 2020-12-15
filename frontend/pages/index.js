import { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { Container, makeStyles, StylesProvider } from "@material-ui/core";
import Banner from "../components/Banner";
import StreamList from "../components/StreamList";
import GroupFormDialog from "../components/GroupFormDialog";
import GroupList from "../components/GroupList";
import withApollo from "../lib/apollo";

const useStyles = makeStyles((theme) => ({
  lead: {
    margin: 0,
    fontSize: "2.5em",
    fontWeight: 400,
  },
}));

const QUERY = gql`
  {
    groups {
      id
      name
      description
      image {
        formats
      }
    }
    streams {
      id
      name
      description
      streamUrl
      image {
        formats
      }
      monastery {
        name
        url
      }
    }
  }
`;

const Home = () => {
  const classes = useStyles();
  const [query, updateQuery] = useState("");
  const { loading, error, data } = useQuery(QUERY);
  if (error) return <p>Error loading data...</p>;
  if (loading) return <h1>Fetching...</h1>;

  return (
    <>
      <Banner />
      <Container maxWidth="lg">
        <h2 className={classes.lead}>Livestreams</h2>
        <StreamList streams={data.streams} />
        <h2 className={classes.lead}>Dhamma Groups (actively recruiting)</h2>
        <GroupList groups={data.groups} />
        <GroupFormDialog />
      </Container>
    </>
  );
};

export default withApollo({ ssr: true })(Home);
