import { useQuery } from "@apollo/client";
import { Container, makeStyles } from "@material-ui/core";
import { useRouter } from "next/router";

import Banner from "../../components/Banner";
import Group from "../../components/Group";
import Loading from "../../components/Loading";
import UserBar from "../../components/UserBar";
import { withApollo } from "../../lib/apollo";
import { GROUP_QUERY } from "../../lib/schema";

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

const GroupPage = () => {
  const classes = useStyles();
  const router = useRouter();
  const groupId = router.query.id;
  const { loading, data } = useQuery(GROUP_QUERY, {
    skip: !groupId,
    variables: { id: groupId },
  });
  const group = data?.group;

  return (
    <>
      <Banner />
      <UserBar />
      <Container maxWidth="lg">
        {loading || !group ? (
          <Loading />
        ) : (
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

export default withApollo()(GroupPage);
