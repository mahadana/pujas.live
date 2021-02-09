import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Popover from "@material-ui/core/Popover";
import { makeStyles } from "@material-ui/core/styles";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";

import UploadImage from "@/components/UploadImage";

const useStyles = makeStyles((theme) => ({
  trigger: {
    cursor: "pointer",
  },
  paper: {
    maxWidth: "28rem",
    padding: "1.5rem",
  },
  image: {
    position: "relative",
    overflow: "hidden",
    width: "100%",
    paddingTop: "56.25%", // 16:9 Aspect Ratio
    marginBottom: "1rem",
    backgroundColor: "green",
    "& > img": {
      display: "block",
      position: "absolute",
      top: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
  },
  title: {
    marginBottom: "0.5rem",
    fontSize: "1.33rem",
  },
  meta: {
    marginBottom: "0.5rem",
    fontSize: "0.9rem",
    fontWeight: 500,
  },
  description: {
    fontSize: "0.9rem",
  },
}));

import { getHumanDateTime } from "shared/time";

const PreviewRecording = ({ recording }) => {
  const classes = useStyles();
  const fullTime = getHumanDateTime(recording.startAt);
  return (
    <PopupState variant="popover" popupId="demoPopover">
      {(popupState) => (
        <>
          <span className={classes.trigger} {...bindTrigger(popupState)}>
            {recording.title}
          </span>
          <Popover
            {...bindPopover(popupState)}
            anchorOrigin={{
              vertical: "center",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "center",
              horizontal: "center",
            }}
          >
            <Paper className={classes.paper} onClick={popupState.close}>
              <div className={classes.image}>
                <UploadImage image={recording.image} format="medium" />
              </div>
              <Typography className={classes.title} variant="h4">
                {recording.title}
              </Typography>
              {fullTime && (
                <Typography className={classes.meta} variant="body1">
                  {fullTime}
                </Typography>
              )}
              <Typography className={classes.description} variant="body1">
                {recording.description}
              </Typography>
            </Paper>
          </Popover>
        </>
      )}
    </PopupState>
  );
};

export default PreviewRecording;
