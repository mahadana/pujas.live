import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness5Icon from "@material-ui/icons/Brightness5";
import PauseCircleOutlineIcon from "@material-ui/icons/PauseCircleOutline";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";

import ChantingSpeedSlider from "@/components/chanting/ChantingSpeedSlider";
import ChantingVerseSlider from "@/components/chanting/ChantingVerseSlider";

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

const ChantingControls = ({
  goBack,
  maximize,
  playing,
  setMaximize,
  setPlaying,
  setSpeed,
  setThemeType,
  setVerseIndex,
  speed,
  themeType,
  verseCount,
  verseIndex,
}) => {
  const classes = useStyles();
  const onClickMaximize = () => setMaximize(!maximize);
  const onClickPlaying = () => {
    if (verseIndex > verseCount && !playing) {
      setVerseIndex(0);
    }
    setPlaying(!playing);
  };
  const onClickThemeType = () =>
    setThemeType(themeType === "light" ? "dark" : "light");
  return (
    <div className={classes.root}>
      <IconButton color="primary" onClick={goBack} size="small">
        <ArrowBackIcon />
      </IconButton>
      <IconButton color="primary" onClick={onClickPlaying} size="small">
        {playing ? (
          <PauseCircleOutlineIcon color="secondary" />
        ) : (
          <PlayCircleOutlineIcon />
        )}
      </IconButton>
      <IconButton color="primary" onClick={onClickMaximize} size="small">
        {maximize ? <ZoomOutIcon /> : <ZoomInIcon />}
      </IconButton>
      <IconButton color="primary" onClick={onClickThemeType} size="small">
        {themeType === "light" ? <Brightness4Icon /> : <Brightness5Icon />}
      </IconButton>
      <div className={classes.verseSlider}>
        <ChantingVerseSlider
          setVerseIndex={setVerseIndex}
          verseCount={verseCount}
          verseIndex={verseIndex}
        />
      </div>
      <div className={classes.speedSlider}>
        <ChantingSpeedSlider setSpeed={setSpeed} speed={speed} />
      </div>
    </div>
  );
};

export default ChantingControls;
