import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import BuildIcon from "@material-ui/icons/Build";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    zIndex: 100,
    bottom: 0,
    right: 0,
  },
}));

const ChantDebugButton = ({ dispatch, state, ...props }) => {
  const classes = useStyles();

  const onClick = () => dispatch({ type: "TOGGLE_DEBUG" });

  return (
    <div {...props} className={classes.root}>
      <IconButton onClick={onClick}>
        <Tooltip title="Debug">
          <BuildIcon
            color={state.debug ? "primary" : "disabled"}
            fontSize="large"
          />
        </Tooltip>
      </IconButton>
    </div>
  );
};

export default ChantDebugButton;
