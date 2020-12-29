import Container from "@material-ui/core/Container";

import Banner from "@/components/Banner";
import ResetPasswordControl from "@/components/auth/ResetPasswordControl";
import { withApollo } from "@/lib/apollo";

const ResetPasswordPage = () => (
  <>
    <Banner />
    <Container maxWidth="sm">
      <ResetPasswordControl />
    </Container>
  </>
);

export default withApollo()(ResetPasswordPage);
