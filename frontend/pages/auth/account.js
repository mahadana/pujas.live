import Container from "@material-ui/core/Container";

import Banner from "@/components/Banner";
import Loading from "@/components/Loading";
import Title from "@/components/Title";

const AccountPage = () => (
  <>
    <Title title="Account" />
    <Banner />
    <Loading data requireUser>
      {({ user }) => (
        <Container maxWidth="sm">
          <div>
            <h1>TODO Account Info</h1>
            <p>
              <dl>
                <dt>ID:</dt>
                <dd>{user.id}</dd>
                <dt>Email:</dt>
                <dd>{user.email}</dd>
              </dl>
            </p>
            <h1>TODO Change Password</h1>
            <h1>TODO Delete Account?</h1>
          </div>
        </Container>
      )}
    </Loading>
  </>
);

export default AccountPage;
