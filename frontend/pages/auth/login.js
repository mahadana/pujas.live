import Container from "@material-ui/core/Container";

import Banner from "@/components/Banner";
import LoginControl from "@/components/auth/LoginControl";
import { withApollo } from "@/lib/apollo";

const LoginPage = () => (
  <>
    <Banner userButton={false} />
    <Container maxWidth="sm">
      <LoginControl />
    </Container>
  </>
);

export default withApollo()(LoginPage);
