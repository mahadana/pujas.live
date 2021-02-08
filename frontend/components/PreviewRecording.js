import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {},
}));

const PreviewRecording = ({ recording }) => {
  const classes = useStyles();
  return <span className={classes.root}>{recording.title}</span>;
};

export default PreviewRecording;
