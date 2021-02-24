import Typography from "@material-ui/core/Typography";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit";

import ChantToggleGroup from "@/components/chanting/ChantToggleGroup";

const ChantFullscreenToggle = ({ dispatch, state }) => {
  const onChange = (fullscreen) =>
    dispatch({ type: "SET_FULLSCREEN", fullscreen });

  return (
    <>
      <Typography id="chant-fullscreen-toggle">Fullscreen</Typography>
      <ChantToggleGroup
        aria-label="Fullscreen"
        aria-labelledby="chant-fullscreen-toggle"
        buttons={[
          { icon: <FullscreenExitIcon />, title: "Off", value: false },
          { icon: <FullscreenIcon />, title: "On", value: true },
        ]}
        onChange={onChange}
        value={state.fullscreen}
      />
    </>
  );
};

export default ChantFullscreenToggle;
