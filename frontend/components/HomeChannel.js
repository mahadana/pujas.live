import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import CuratedRecordingLink from "@/components/CuratedRecordingLink";
import Link from "@/components/Link";
import Upcoming from "@/components/Upcoming";
import UploadImage from "@/components/UploadImage";
import PlayRecordingButtonAndModal from "@/components/PlayRecordingButtonAndModal";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    padding: "1.5em",
    "&:nth-child(odd)": {
      backgroundColor: "#eee",
    },
  },
  image: {
    flex: "0 0 12em",
    "& > img": {
      display: "block",
      objectFit: "cover",
      width: "10em",
      height: "10em",
    },
  },
  text: {
    flex: "1 1 20em",
    marginRight: "2em",
    "& > h3": {
      margin: 0,
      fontSize: "1.5em",
      fontWeight: 400,
    },
    "& > p": {
      marginBottom: 0,
      fontSize: "1.1em",
    },
  },
  monasteryLinks: {
    "& > a": {
      marginRight: "1em",
    },
  },
  links: {
    display: "flex",
    alignItems: "center",
  },
}));

const HomeChannel = (props) => {
  const classes = useStyles();

  // Remove curated recordings where recording is null
  // TODO this is definetely not ideal and would better be done
  // in the query.
  if (Array.isArray(props.curatedRecordings)) {
    props = Object.assign({}, props);
    props.curatedRecordings = props.curatedRecordings.filter(
      (cr) => cr.recording
    );
  }

  return (
    <Box className={classes.root}>
      <Box className={classes.image}>
        <UploadImage image={props.image} />
      </Box>
      <Box className={classes.text}>
        <h3>{props.title}</h3>
        {props.activeStream?.startAt && (
          <Typography variant="subtitle2">
            <Upcoming
              time={props.activeStream.startAt}
              duration={props.activeStream.duration}
            />
          </Typography>
        )}
        <p>{props.description}</p>
        <p className={classes.monasteryLinks}>
          {props.monastery && props.monastery.websiteUrl && (
            <Link
              href={props.monastery.websiteUrl}
              target="_blank"
              rel="noopener"
            >
              {props.monastery.title} website
            </Link>
          )}
          {props.curatedRecordings?.length ? (
            <CuratedRecordingLink curatedRecordings={props.curatedRecordings} />
          ) : null}
          {props.channelUrl && (
            <Link href={props.channelUrl} target="_blank" rel="noreferrer">
              {props.monastery?.title || "Livestream"} channel
            </Link>
          )}
        </p>
      </Box>
      <Box className={classes.links}>
        {props.activeStream && (
          <PlayRecordingButtonAndModal recording={props.activeStream}>
            {props.activeStream?.live ? "Join Livestream" : "Livestream"}
          </PlayRecordingButtonAndModal>
        )}
      </Box>
    </Box>
  );
};

export default HomeChannel;
