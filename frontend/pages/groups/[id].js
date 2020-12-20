import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { Container, makeStyles } from "@material-ui/core";
import Banner from "../../components/Banner";
import Group from "../../components/Group";
import UserBar from "../../components/UserBar";
import { withApollo } from "../../lib/context";

const useStyles = makeStyles((theme) => ({
  video: {
    position: "fixed",
    bottom: "5vh",
    right: "5vw",
    zIndex: 1000,
    width: "60vw",
    height: "40vh",
  },
}));

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

const GroupPage = () => {
  const classes = useStyles();
  const router = useRouter();
  const { loading, error, data } = useQuery(QUERY, {
    variables: { id: router.query.id },
  });

  return (
    <>
      <Banner />
      <UserBar />
      <Container maxWidth="lg">
        {!loading && (
          <>
            <Group {...data.group} />
            <p>
              Press <strong>S</strong> after joining the meeting to go into
              full-screen.
            </p>
            <iframe
              className={classes.video}
              allow="camera; microphone; fullscreen; display-capture"
              src={`https://meet.jit.si/MeditationGroup${data.group.id}`}
            />
          </>
        )}
      </Container>
    </>
  );
};

export default withApollo({ ssr: true })(GroupPage);
