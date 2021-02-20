import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness5Icon from "@material-ui/icons/Brightness5";
import PauseCircleOutlineIcon from "@material-ui/icons/PauseCircleOutline";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";

import ChantActiveSlider from "@/components/chanting/ChantActiveSlider";
import ChantSpeedSlider from "@/components/chanting/ChantSpeedSlider";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    zIndex: 10,
    top: 0,
    left: 0,
    width: "2rem",
    height: "100%",
    padding: "0.5rem 0",
    fontSize: "1rem",
    textAlign: "center",
  },
  speedSlider: {
    position: "absolute",
    bottom: "1rem",
    left: 0,
    width: "100%",
    height: "20%",
    textAlign: "center",
  },
  verseSlider: {
    position: "absolute",
    bottom: "calc(20% + 2rem)",
    left: 0,
    width: "100%",
    height: "calc(100% - (20% + 1rem + 10.5rem))",
    textAlign: "center",
  },
}));

const ChantControls = ({ dispatch, state, ...props }) => {
  const classes = useStyles();
  const onClickBack = () => dispatch({ type: "VIEW_TOC" });
  const onClickMaximize = () => dispatch({ type: "TOGGLE_MAXIMIZE" });
  const onClickPlaying = () => dispatch({ type: "TOGGLE_PLAYING" });
  const onClickThemeType = () => dispatch({ type: "TOGGLE_THEME_TYPE" });
  const setActiveIndex = (activeIndex) =>
    dispatch({ type: "SET_ACTIVE_INDEX", activeIndex });
  const setSpeed = (speed) => dispatch({ type: "SET_SPEED", speed });

  return (
    <div {...props} className={classes.root}>
      <IconButton color="primary" onClick={onClickBack} size="small">
        <ArrowBackIcon />
      </IconButton>
      <IconButton color="primary" onClick={onClickPlaying} size="small">
        {state.playing ? (
          <PauseCircleOutlineIcon color="secondary" />
        ) : (
          <PlayCircleOutlineIcon />
        )}
      </IconButton>
      <IconButton color="primary" onClick={onClickMaximize} size="small">
        {state.maximize ? <ZoomOutIcon /> : <ZoomInIcon />}
      </IconButton>
      <IconButton color="primary" onClick={onClickThemeType} size="small">
        {state.themeType === "light" ? (
          <Brightness4Icon />
        ) : (
          <Brightness5Icon />
        )}
      </IconButton>
      <div className={classes.verseSlider}>
        <ChantActiveSlider
          textCount={state.chant?.textCount}
          activeIndex={state.activeIndex}
          setActiveIndex={setActiveIndex}
        />
      </div>
      <div className={classes.speedSlider}>
        <ChantSpeedSlider setSpeed={setSpeed} speed={state.speed} />
      </div>
    </div>
  );
};

export default ChantControls;
