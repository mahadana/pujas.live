import { gql, useQuery } from "@apollo/client";
import { Container, makeStyles } from "@material-ui/core";

import Banner from "../components/Banner";
import UserBar from "../components/UserBar";
import { withApollo } from "../lib/context";

const useStyles = makeStyles((theme) => ({
}));

const Home = () => {
  const classes = useStyles();
  // const { loading, error, data } = useQuery(QUERY);

  return (
    <>
      <Banner />
      <UserBar />
      <div>TODO</div>
    </>
  );
};

export default withApollo({ ssr: true })(Home);
