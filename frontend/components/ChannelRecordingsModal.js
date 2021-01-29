import { useLazyQuery } from "@apollo/client";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import { useState } from "react";

import ChannelRecordingsToggle from "@/components/ChannelRecordingsToggle";
import ChannelRecordingsList from "@/components/ChannelRecordingsList";
import CloseButtonLink from "@/components/CloseButtonLink";
import Loading from "@/components/Loading";
import Title from "@/components/Title";
import { CHANNEL_QUERY } from "@/lib/schema";
import { useEffect } from "react";

export const useChannelRecordingsModalHref = () => {
  const router = useRouter();
  return ({ id }) => ({
    pathname: router.pathname,
    query: {
      ...router.query,
      channelRecordingsModalBackPath: router.asPath,
      channelRecordingsModalChannelId: id,
    },
  });
};

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: "absolute",
    right: 0,
    top: 0,
    color: "#999",
    fontSize: 45,
  },
  title: {
    "& > h2": {
      display: "flex",
      justifyContent: "space-between",
    },
    "& button:last-child": {
      marginRight: "4em",
    },
  },
}));

const ChannelRecordingsModal = ({ children }) => {
  const [getChannel, result] = useLazyQuery(CHANNEL_QUERY, {
    fetchPolicy: "cache-and-network",
  });
  const [state, setState] = useState("curated");
  const router = useRouter();
  const classes = useStyles();

  const {
    channelRecordingsModalBackPath: backPath,
    channelRecordingsModalChannelId: channelId,
    ...query
  } = router.query;
  const closeProps = {
    as: backPath,
    href: { pathname: router.pathname, query },
    scroll: false,
    shallow: true,
  };
  const open = !!channelId;

  useEffect(() => {
    if (channelId) {
      getChannel({ variables: { id: channelId } });
    }
  }, [channelId]);

  const onClose = () => {
    router.push(closeProps.href, closeProps.as, closeProps);
  };
  const onExited = () => setState("curated");
  const toggleState = () =>
    setState(state === "curated" ? "recent" : "curated");

  return (
    <>
      {children}
      <Loading {...result}>
        {({ data: { channel } }) => (
          <Dialog
            maxWidth="lg"
            open={open}
            onClose={onClose}
            onExited={onExited}
            scroll="body"
          >
            {open && <Title title={`Recordings | ${channel.title}`} />}
            <CloseButtonLink className={classes.closeButton} {...closeProps} />
            <DialogTitle className={classes.title}>
              <Box>Recordings - {channel.title}</Box>
              <Box>
                <ChannelRecordingsToggle onChange={toggleState} state={state} />
              </Box>
            </DialogTitle>
            <DialogContent dividers={false}>
              <ChannelRecordingsList channel={channel} state={state} />
            </DialogContent>
          </Dialog>
        )}
      </Loading>
    </>
  );
};

export default ChannelRecordingsModal;
