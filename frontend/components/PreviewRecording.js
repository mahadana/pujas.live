import Paper from "@material-ui/core/Paper";
import Popover from "@material-ui/core/Popover";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {
  bindTrigger,
  bindPopover,
  usePopupState,
} from "material-ui-popup-state/hooks";

import Link from "@/components/Link";
import RecordingImage from "@/components/RecordingImage";
import { getRecordingPath } from "shared/path";

const useStyles = makeStyles((theme) => ({
  paper: {
    maxWidth: "28rem",
    padding: "1.5rem",
    cursor: "pointer",
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
  const popupState = usePopupState({
    popupId: "preview-recording",
    variant: "popover",
  });
  const classes = useStyles();
  const fullTime = getHumanDateTime(recording.startAt);

  const popupLinkProps = {
    ...bindTrigger(popupState),
    href: getRecordingPath(recording),
  };
  const originalOnClick = popupLinkProps.onClick;
  popupLinkProps.onClick = (event) => {
    event.preventDefault();
    originalOnClick(event);
  };

  return (
    <>
      <Link {...popupLinkProps}>{recording.title}</Link>
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
            <RecordingImage format="medium" recording={recording} />
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
  );
};

export default PreviewRecording;
