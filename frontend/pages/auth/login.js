import Container from "@material-ui/core/Container";

import Banner from "@/components/Banner";
import LoginControl from "@/components/LoginControl";

const LoginPage = () => (
  <>
    <Banner />
    <Container maxWidth="sm">
      <LoginControl />
    </Container>
  </>
);

export default LoginPage;
