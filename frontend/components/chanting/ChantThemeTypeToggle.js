import Typography from "@material-ui/core/Typography";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness5Icon from "@material-ui/icons/Brightness5";

import ChantToggleGroup from "@/components/chanting/ChantToggleGroup";

const ChantThemeTypeToggle = ({ dispatch, state }) => {
  const onChange = (themeType) =>
    dispatch({ type: "SET_THEME_TYPE", themeType });

  return (
    <>
      <Typography id="chant-theme-type-toggle">Colors</Typography>
      <ChantToggleGroup
        aria-label="Colors"
        aria-labelledby="chant-theme-type-toggle"
        buttons={[
          { icon: <Brightness5Icon />, title: "Light", value: "light" },
          { icon: <Brightness4Icon />, title: "Dark", value: "dark" },
        ]}
        onChange={onChange}
        value={state.themeType}
      />
    </>
  );
};

export default ChantThemeTypeToggle;
