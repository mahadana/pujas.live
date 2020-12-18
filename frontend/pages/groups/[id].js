import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import Banner from "../../components/Banner";
import Group from "../../components/Group";
import UserBar from "../../components/UserBar";
import { withApollo } from "../../lib/context";

const QUERY = gql`
  query Group($id: ID!) {
    group(id: $id) {
      id
      name
      description
      image {
        formats
      }
    }
  }
`;

const QUERYx = gql`
  {
    groups {
      id
      name
      description
      image {
        formats
      }
    }
  }
`;

const GroupPage = () => {
  const router = useRouter();
  const { loading, error, data } = useQuery(QUERY, {
    variables: { id: router.query.id },
  });

  return (
    <>
      <Banner />
      <UserBar />
      {!loading && <Group {...data.group} />}
    </>
  );
};

export default withApollo({ ssr: true })(GroupPage);
