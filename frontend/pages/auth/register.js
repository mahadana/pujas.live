import Container from "@material-ui/core/Container";

import Banner from "@/components/Banner";
import RegisterControl from "@/components/auth/RegisterControl";
import { withApollo } from "@/lib/apollo";

const RegisterPage = () => (
  <>
    <Banner userButton={false} />
    <Container maxWidth="sm">
      <RegisterControl />
    </Container>
  </>
);

export default withApollo()(RegisterPage);
