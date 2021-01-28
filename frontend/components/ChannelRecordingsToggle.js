import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

const ChannelRecordingsToggle = ({ state, ...props }) => (
  <ToggleButtonGroup {...props} value={state} exclusive size="small">
    <ToggleButton value="curated">Curated</ToggleButton>
    <ToggleButton value="recent">Recent</ToggleButton>
  </ToggleButtonGroup>
);

export default ChannelRecordingsToggle;
