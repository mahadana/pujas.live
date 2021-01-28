import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Title from "@/components/Title";
import Typography from "@material-ui/core/Typography";
import { useState } from "react";

import ChannelRecordingsToggle from "@/components/ChannelRecordingsToggle";
import ChannelRecordingsList from "@/components/ChannelRecordingsList";
import VideoModal from "@/components/VideoModal";

const useStyles = makeStyles((theme) => ({
  heading: {
    fontSize: "2rem",
    fontWeight: 400,
    margin: "0.5em 0",
  },
}));

const ChannelRecordingsContent = ({ channel }) => {
  const [state, setState] = useState("curated");
  const classes = useStyles();

  const toggleState = () =>
    setState(state === "curated" ? "recent" : "curated");

  return (
    <VideoModal>
      <Container maxWidth="lg">
        <Title title={`${channel.title} Recordings`} />
        <ChannelRecordingsToggle
          className={classes.toggle}
          onChange={toggleState}
          state={state}
        />
        <Typography className={classes.heading} variant="h2">
          Recordings - {channel.title}
        </Typography>
        <ChannelRecordingsList channel={channel} state={state} />
      </Container>
    </VideoModal>
  );
};

export default ChannelRecordingsContent;
