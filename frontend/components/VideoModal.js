import Box from "@material-ui/core/Box";
import Modal from "@material-ui/core/Modal";
import NoSsr from "@material-ui/core/NoSsr";
import { makeStyles } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import { useEffect } from "react";

import Title from "@/components/Title";
import VideoPlayer from "@/components/VideoPlayer";

const useStyles = makeStyles((theme) => ({
  modal: {
    zIndex: `${theme.zIndex.modal + 1} !important`,
  },
  container: {
    position: "relative",
    height: "100%",
    width: "100%",
  },
}));

const VideoModal = ({ children }) => {
  const router = useRouter();
  const classes = useStyles();

  const {
    videoModalBackPath: backPath,
    videoModalLive,
    videoModalSkip: skip,
    videoModalTitle: title,
    videoModalUrl: url,
    ...query
  } = router.query;
  const live = videoModalLive === "1";
  const closeProps = {
    as: backPath,
    href: { pathname: router.pathname, query },
    scroll: false,
    shallow: true,
    onClick: () => document?.exitFullscreen()?.catch(() => {}),
  };
  const open = !!url;

  useEffect(() => {
    if (open) {
      document.documentElement?.requestFullscreen?.()?.catch(console.error);
    }
  }, [open]);

  const onClose = () => {
    document.exitFullscreen().catch(() => {});
    router.push(closeProps.href, closeProps.as, closeProps);
  };

  return (
    <>
      {children}
      {open && !!title && <Title title={title} />}
      <NoSsr>
        <Modal className={classes.modal} onClose={onClose} open={open}>
          <Box className={classes.container}>
            <VideoPlayer
              autoplay={true}
              closeProps={closeProps}
              live={live}
              onEnded={onClose}
              skip={skip}
              url={url}
            />
          </Box>
        </Modal>
      </NoSsr>
    </>
  );
};

export default VideoModal;
