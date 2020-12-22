import { useContext } from "react";
import { gql, useQuery } from "@apollo/client";
import { Container } from "@material-ui/core";
import { useRouter } from "next/router";
import Banner from "../../../components/Banner";
import GroupMessage from "../../../components/GroupMessage";
import UserBar from "../../../components/UserBar";
import { withApolloAndUser, UserContext } from "../../../lib/context";

const QUERY = gql`
  query Group($id: ID!) {
    group(id: $id) {
      id
      name
      description
    }
  }
`;

const GroupMessagePage = () => {
  const router = useRouter();
  const groupId = router.query.id;
  const { user } = useContext(UserContext);
  const { loading, error, data } = useQuery(QUERY, {
    skip: !groupId,
    variables: { id: groupId },
  });

  return (
    <>
      <Banner />
      <UserBar />
      {!loading && !error && data && data.group && (
        <Container maxWidth="lg">
          <GroupMessage groupId={data.group.id} groupName={data.group.name} user={user} />
        </Container>
      )}
    </>
  );
};

export default withApolloAndUser()(GroupMessagePage);
