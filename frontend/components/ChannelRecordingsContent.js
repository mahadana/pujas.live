import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Title from "@/components/Title";
import { useState } from "react";

import ChannelRecordingsToggle from "@/components/ChannelRecordingsToggle";
import ChannelRecordingsList from "@/components/ChannelRecordingsList";
import PageHeading from "@/components/PageHeading";

const useStyles = makeStyles((theme) => ({
  toggle: {
    float: "right",
  },
}));

const ChannelRecordingsContent = ({ channel }) => {
  const [state, setState] = useState("recent");
  const classes = useStyles();

  const toggleState = () =>
    setState(state === "curated" ? "recent" : "curated");

  return (
    <Container maxWidth="lg">
      {!!channel.title && <Title title={`${channel.title} Recordings`} />}
      <ChannelRecordingsToggle
        className={classes.toggle}
        onChange={toggleState}
        state={state}
      />
      <PageHeading>{channel.title} Recordings</PageHeading>
      <ChannelRecordingsList channel={channel} state={state} />
    </Container>
  );
};

export default ChannelRecordingsContent;
