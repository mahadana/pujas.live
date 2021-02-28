import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { useEffect } from "react";

import ButtonLink from "@/components/ButtonLink";
import Chant from "@/components/chanting/Chant";
import ChantEditorJsonButton from "@/components/chanting/editor/ChantEditorJsonButton";
import { useChantEditorReducer } from "@/components/chanting/editor/ChantEditorReducer";
import ChantEditorMediaPlayer from "@/components/chanting/editor/ChantEditorMediaPlayer";
import ChantEditorPlaybackSlider from "@/components/chanting/editor/ChantEditorPlaybackSlider";
import ChantEditorTable from "@/components/chanting/editor/ChantEditorTable";
import ChantEditorTimingField from "@/components/chanting/editor/ChantEditorTimingField";
import {
  exportTimingToStore,
  importTimingFromStore,
  timeToHuman,
} from "@/lib/chanting";

const useStyles = makeStyles((theme) => ({
  root: {},
  links: {
    display: "flex",
    justifyContent: "flex-start",
    "& > button": {
      marginLeft: "1rem",
    },
    [theme.breakpoints.up("md")]: {
      justifyContent: "flex-end",
    },
  },
}));

const ChantEditor = ({ chant }) => {
  const [state, dispatch] = useChantEditorReducer({ chant });
  const classes = useStyles();

  const { exportedTiming, timing } = state;

  useEffect(() => {
    if (!timing || chant !== state.chant) {
      const importedTiming = importTimingFromStore(chant.id);
      dispatch({ type: "IMPORT_TIMING", importedTiming });
    } else {
      exportTimingToStore(chant.id, exportedTiming);
    }
  }, [chant, timing]);

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <Typography variant="h3">{`${chant.id} ${chant.title}`}</Typography>
        </Grid>
        <Grid className={classes.links} item xs={12} md={5}>
          <ButtonLink href="/chantrain" variant="outlined">
            Table of Contents
          </ButtonLink>
          <ChantEditorJsonButton
            dispatch={dispatch}
            state={state}
            variant="outlined"
          >
            JSON
          </ChantEditorJsonButton>
        </Grid>
        <Grid item xs={12}>
          <ChantEditorTimingField
            dispatch={dispatch}
            fieldName="mediaUrl"
            fullWidth
            helperText="Example: https://www.abhayagiri.org/media/chanting/audio/morning.mp3"
            label="Media URL"
            size="small"
            state={state}
            variant="outlined"
            value={timing?.mediaUrl ?? ""}
          />
        </Grid>
        <Grid item xs={6} sm={4}>
          <ChantEditorTimingField
            dispatch={dispatch}
            fieldName="start"
            fullWidth
            label="Start"
            size="small"
            state={state}
            variant="outlined"
            value={timeToHuman(timing?.start, 1)}
          />
        </Grid>
        <Grid item xs={6} sm={4}>
          <ChantEditorTimingField
            dispatch={dispatch}
            fieldName="end"
            fullWidth
            label="End"
            size="small"
            state={state}
            variant="outlined"
            value={timeToHuman(timing?.end, 1)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <ChantEditorPlaybackSlider dispatch={dispatch} state={state} />
        </Grid>
        <Grid item xs={12}>
          <ChantEditorMediaPlayer dispatch={dispatch} state={state} />
          <ChantEditorTable dispatch={dispatch} state={state} />
          <hr />
        </Grid>
        <Grid item xs={12}>
          <Chant chant={chant} />
        </Grid>
      </Grid>
    </div>
  );
};

export default ChantEditor;
