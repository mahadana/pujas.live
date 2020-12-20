import Banner from "../components/Banner";
import UserBar from "../components/UserBar";
import { withApollo } from "../lib/context";

const Home = () => {
  return (
    <>
      <Banner />
      <UserBar />
    </>
  );
};

export default withApollo({ ssr: true })(Home);
