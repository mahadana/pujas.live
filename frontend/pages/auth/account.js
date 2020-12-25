import Container from "@material-ui/core/Container";

import Banner from "../../components/Banner";
import Loading from "../../components/Loading";
import NotLoggedIn from "../../components/NotLoggedIn";
import UserBar from "../../components/UserBar";
import { withApolloAndUser } from "../../lib/apollo";
import { useUser } from "../../lib/user";

const Account = () => {
  const { user, userLoading } = useUser();
  return (
    <>
      <Banner />
      <UserBar />
      <Container maxWidth="sm">
        {userLoading ? (
          <Loading />
        ) : !user ? (
          <NotLoggedIn />
        ) : (
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
        )}
      </Container>
    </>
  );
};

export default withApolloAndUser()(Account);
