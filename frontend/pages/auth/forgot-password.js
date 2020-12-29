import Container from "@material-ui/core/Container";

import Banner from "@/components/Banner";
import ForgotPasswordControl from "@/components/auth/ForgotPasswordControl";
import { withApollo } from "@/lib/apollo";

const ForgotPasswordPage = () => (
  <>
    <Banner />
    <Container maxWidth="sm">
      <ForgotPasswordControl />
    </Container>
  </>
);

export default withApollo()(ForgotPasswordPage);
