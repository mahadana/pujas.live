import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import CancelIcon from "@material-ui/icons/Cancel";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    zIndex: 100,
    top: 0,
    right: 0,
  },
  close: {
    position: "absolute",
    top: 0,
    right: 0,
    transition: "all 0.5s ease-out",
  },
  toc: {
    top: "-0.35rem",
    right: "-0.35rem",
  },
}));

const ChantCloseButton = ({ dispatch, state, ...props }) => {
  const classes = useStyles();

  const onClick = () => dispatch({ type: "CLOSE" });

  return (
    <div {...props} className={classes.root}>
      <div className={clsx(classes.close, state.view === "TOC" && classes.toc)}>
        <IconButton onClick={onClick}>
          <Tooltip title="Exit">
            <CancelIcon color="disabled" fontSize="large" />
          </Tooltip>
        </IconButton>
      </div>
    </div>
  );
};

export default ChantCloseButton;
