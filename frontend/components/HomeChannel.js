import Box from "@material-ui/core/Box";
import { emphasize, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import ChannelRecordingsLink from "@/components/ChannelRecordingsLink";
import Link from "@/components/Link";
import Upcoming from "@/components/Upcoming";
import UploadImage from "@/components/UploadImage";
import PlayRecordingButtonLink from "@/components/PlayRecordingButtonLink";
import { isActiveRecording } from "@/lib/util";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    padding: "1.5em",
    "&:nth-child(odd)": {
      backgroundColor: emphasize(theme.palette.background.default, 0.05),
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
  const active = isActiveRecording(props.activeStream);
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
          {props.channelUrl && (
            <Link href={props.channelUrl} target="_blank" rel="noreferrer">
              {props.monastery?.title || "Livestream"} channel
            </Link>
          )}
          <ChannelRecordingsLink channel={props}>
            Recordings
          </ChannelRecordingsLink>
        </p>
      </Box>
      <Box className={classes.links}>
        {props.activeStream && (
          <PlayRecordingButtonLink
            active={active}
            recording={props.activeStream}
          >
            Livestream
          </PlayRecordingButtonLink>
        )}
      </Box>
    </Box>
  );
};

export default HomeChannel;
