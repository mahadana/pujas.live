import Box from "@material-ui/core/Box";
import { emphasize, fade, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import UploadImage from "@/components/UploadImage";
import PlayRecordingButtonLink from "@/components/PlayRecordingButtonLink";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    padding: "1.5em",
    "&:nth-child(odd)": {
      backgroundColor: fade(
        emphasize(theme.palette.background.default, 0.5),
        0.15
      ),
    },
    "&:last-child": {
      marginBottom: "1em",
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
    flex: "100 1 14em",
    marginRight: "2em",
    "& > h3": {
      margin: 0,
      fontSize: "1.5em",
      fontWeight: 400,
    },
    "& > p": {
      marginBottom: 0,
      fontSize: "1.1em",
      [theme.breakpoints.down("sm")]: {
        marginBottom: "1em",
      },
    },
  },
  button: {
    display: "flex",
    flex: "1 0 11em",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const ChannelRecording = ({ recording }) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Box className={classes.image}>
        <UploadImage image={recording.image} />
      </Box>
      <Box className={classes.text}>
        <Typography variant="h3">{recording.title}</Typography>
        <Typography variant="body1">{recording.description}</Typography>
      </Box>
      <Box className={classes.button}>
        <PlayRecordingButtonLink recording={recording} skip={recording.skip}>
          Watch
        </PlayRecordingButtonLink>
      </Box>
    </Box>
  );
};

export default ChannelRecording;
