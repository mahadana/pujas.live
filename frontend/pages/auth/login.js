import Container from "@material-ui/core/Container";

import Banner from "../../components/Banner";
import LoginControl from "../../components/LoginControl";
import { withApolloAndUser } from "../../lib/apollo";

const LoginPage = () => (
  <>
    <Banner />
    <Container maxWidth="sm">
      <LoginControl />
    </Container>
  </>
);

export default withApolloAndUser()(LoginPage);
