import Container from "@material-ui/core/Container";

import Banner from "../../components/Banner";
import RegisterControl from "../../components/RegisterControl";

const RegisterPage = () => (
  <>
    <Banner />
    <Container maxWidth="sm">
      <RegisterControl />
    </Container>
  </>
);

export default RegisterPage;
