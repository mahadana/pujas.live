import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";

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
  button: {
    display: "flex",
    alignItems: "center",
    "& button": {
      borderRadius: 20,
    },
  },
}));

const CuratedRecording = ({ title, description, recording }) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Box className={classes.image}>
        <UploadImage image={recording.image} />
      </Box>
      <Box className={classes.text}>
        <h3>{title ? title : recording.title}</h3>
        <p>{description ? description : recording.description}</p>
      </Box>
      <Box className={classes.button}>
        <PlayRecordingButtonAndModal recording={recording}>
          Play Recording
        </PlayRecordingButtonAndModal>
      </Box>
    </Box>
  );
};

export default CuratedRecording;
