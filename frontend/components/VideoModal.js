import Box from "@material-ui/core/Box";
import Modal from "@material-ui/core/Modal";
import NoSsr from "@material-ui/core/NoSsr";
import { makeStyles } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import { useEffect } from "react";

import Title from "@/components/Title";
import VideoPlayer from "@/components/VideoPlayer";
import { exitFullscreen, requestFullscreen } from "@/lib/util";

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
    videoModalSkip,
    videoModalTitle: title,
    videoModalUrl: url,
    ...query
  } = router.query;
  const live = videoModalLive === "1";
  const skip = videoModalSkip ? parseInt(videoModalSkip) : undefined;
  const closeProps = {
    as: backPath,
    href: { pathname: router.pathname, query },
    scroll: false,
    shallow: true,
    onClick: exitFullscreen,
  };
  const open = !!url;

  useEffect(() => {
    if (open) requestFullscreen();
  }, [open]);

  const onClose = () => {
    router.push(closeProps.href, closeProps.as, {
      scroll: closeProps.scroll,
      shallow: closeProps.shallow,
    });
    exitFullscreen();
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
