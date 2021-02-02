import Box from "@material-ui/core/Box";
import Modal from "@material-ui/core/Modal";
import NoSsr from "@material-ui/core/NoSsr";
import { makeStyles } from "@material-ui/core/styles";
import { useRouter } from "next/router";

import Title from "@/components/Title";
import VideoPlayer from "@/components/VideoPlayer";

export const useVideoModalHref = () => {
  const router = useRouter();
  return ({ title, url }) => ({
    pathname: router.pathname,
    query: {
      ...router.query,
      videoModalBackPath: router.asPath,
      videoModalTitle: title,
      videoModalUrl: url,
    },
  });
};

const useStyles = makeStyles((theme) => ({
  modal: {
    zIndex: "1301 !important",
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
    videoModalTitle: title,
    videoModalUrl: url,
    ...query
  } = router.query;
  const closeProps = {
    as: backPath,
    href: { pathname: router.pathname, query },
    scroll: false,
    shallow: true,
  };
  const open = !!url;

  const onClose = () => {
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
              onEnded={onClose}
              url={url}
            />
          </Box>
        </Modal>
      </NoSsr>
    </>
  );
};

export default VideoModal;
