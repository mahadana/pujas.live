import Fade from "@material-ui/core/Fade";
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
import escape from "lodash/escape";
import { useEffect, useReducer } from "react";
import { useIdleTimer } from "react-idle-timer";

import Chant from "@/components/chanting/Chant";
import ChantControls from "@/components/chanting/ChantControls";
import ChantingToc from "@/components/chanting/ChantingToc";
import ChantScroller from "@/components/chanting/ChantScroller";
import darkTheme from "@/lib/theme";
import { exitFullscreen, requestFullscreen } from "@/lib/util";

const lightTheme = createMuiTheme({
  ...darkTheme,
  palette: {
    type: "light",
  },
});

const useStyles = makeStyles((theme) => ({
  root: ({ maximize }) => ({
    position: "fixed",
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    fontSize: "1.25rem",
    ...(maximize
      ? {
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
        }
      : {
          width: "90vw",
          height: "92vh",
          top: "50%",
          left: "50%",
          marginLeft: "max(-45vw,-24rem)",
          marginTop: "-46vh",
          maxWidth: "48rem",
          borderRadius: "0.25rem",
          boxShadow: "1px 1px 6px rgb(0 0 0 / 80%)",
        }),
  }),
}));

const initialize = ({ mobile }) => ({
  activeIndex: "START",
  chant: null,
  controls: false,
  highlight: false,
  maximize: false,
  mobile,
  playing: false,
  speed: 1.0,
  textZoom: false,
  themeType: "light",
  view: "TOC",
});

const reducer = (state, action) => {
  switch (action.type) {
    case "HIDE_CONTROLS":
      return { ...state, controls: false };
    case "INCREMENT_ACTIVE_INDEX": {
      let { activeIndex, chant, playing } = state;
      if (!chant) {
        activeIndex = "START";
      } else if (activeIndex === "START") {
        activeIndex = 0;
      } else if (activeIndex === "END") {
        playing = false;
      } else {
        activeIndex += 1;
        if (activeIndex >= (chant.textCount || 0)) {
          activeIndex = "END";
          playing = false;
        }
      }
      return { ...state, activeIndex, playing };
    }
    case "SET_CHANT":
      return {
        ...state,
        chant: action.chant,
        activeIndex: action.chant.startIndex ?? "START",
      };
    case "SET_ACTIVE_INDEX":
      return { ...state, activeIndex: action.activeIndex };
    case "SET_SPEED":
      return { ...state, speed: action.speed };
    case "SHOW_CONTROLS":
      return { ...state, controls: true };
    case "STOP_PLAYING":
      return { ...state, playing: false };
    case "TOGGLE_HIGHLIGHT":
      return { ...state, highlight: !state.highlight };
    case "TOGGLE_MAXIMIZE":
      return { ...state, maximize: !state.maximize };
    case "TOGGLE_PLAYING": {
      if (!state.playing && state.activeIndex === "END") {
        return { ...state, activeIndex: "START", playing: true };
      } else {
        return { ...state, playing: !state.playing };
      }
    }
    case "TOGGLE_TEXT_ZOOM":
      return { ...state, textZoom: !state.textZoom };
    case "TOGGLE_THEME_TYPE":
      return {
        ...state,
        themeType: state.themeType === "light" ? "dark" : "light",
      };
    case "VIEW_CHANT":
      return {
        ...state,
        playing: true,
        controls: true,
        view: "CHANT",
      };
    case "VIEW_TOC":
      return {
        ...state,
        playing: false,
        controls: false,
        view: "TOC",
      };
    default:
      throw new Error(`Unknown action type ${action.type}`);
  }
};

const getWordCharCount = (html) => {
  const simple = (html || "")
    .replace(/<[^>]*>/g, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[-]/g, " ")
    .replace(/[^\sa-zA-Z0-9]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return [simple.split(" ").length, simple.length];
};

const addChantMeta = (chant) => {
  let textIndex = 0;
  let startIndex = 0;
  const textNodeMap = [];

  const walkNode = (node) => {
    if (node?.html) {
      if (node.start) startIndex = textIndex;
      node.textIndex = textIndex++;
      [node.wordCount, node.charCount] = getWordCharCount(node.html);
      if (node.type === "verse") {
        if (node.lang == "pi" || String(node.html).match(/[āīūḷṇṃḍṭṅñ]/)) {
          node.duration = 0.7 + 0.14 * node.charCount;
        } else {
          node.duration = 1.2 + 0.07 * node.charCount;
        }
      } else {
        if (node.html.match(/^bow$/i)) {
          node.duration = 2;
        } else {
          node.duration = 1;
        }
      }
      textNodeMap.push(node);
    } else if (node?.children) {
      node?.children?.forEach?.(walkNode);
    }
  };
  walkNode(chant);

  chant.startIndex = startIndex;
  chant.textCount = textIndex;
  chant.textNodeMap = textNodeMap;
  return chant;
};

const getChantFromToc = ({ chants, chantSet = [], link, title }) => {
  const chant = chantSet
    .map((chantId) => chants.chantMap[chantId])
    .filter((chant) => chant)
    .reduce(
      (combined, chant) => {
        combined.children.push({
          type: "h2",
          start: chant.id === link,
          html: escape(chant.title),
        });
        chant.children.forEach((node) => {
          if (String(node?.type).match(/^h\d$/)) {
            node = { ...node, type: "h3" };
          }
          combined.children.push(node);
        });
        combined.lang = combined.lang
          ? combined.lang === chant.lang
            ? chant.lang
            : "mixed"
          : chant.lang;
        return combined;
      },
      { title, id: "combined", children: [{ type: "h1", html: escape(title) }] }
    );
  return chant.children.length > 0 ? addChantMeta(chant) : null;
};

const ChantingWindowInner = ({ chants, dispatch, state, toc }) => {
  const classes = useStyles({ maximize: state.maximize || state.mobile });

  const onTocOpen = (props) => {
    const chant = getChantFromToc({ ...props, chants });
    if (chant) {
      dispatch({ type: "SET_CHANT", chant });
      dispatch({ type: "VIEW_CHANT" });
    }
  };

  return (
    <div className={classes.root}>
      <Fade in={state.controls}>
        <ChantControls dispatch={dispatch} state={state} />
      </Fade>
      {state.view === "CHANT" && (
        <ChantScroller dispatch={dispatch} state={state}>
          <Chant
            chant={state.chant}
            highlight={state.highlight}
            textZoom={state.textZoom}
          />
        </ChantScroller>
      )}
      {state.view === "TOC" && (
        <ChantingToc chant={state.chant} toc={toc} onOpen={onTocOpen} />
      )}
    </div>
  );
};

const ChantingWindow = ({
  allowFullscreen = true,
  mobile = false,
  ...props
}) => {
  const [state, dispatch] = useReducer(reducer, { mobile }, initialize);

  const { reset: resetIdleTimer } = useIdleTimer({
    debounce: 500,
    onActive: () => {
      if (state.view === "CHANT") {
        dispatch({ type: "SHOW_CONTROLS" });
      }
    },
    onIdle: () => {
      if (state.view === "CHANT") {
        dispatch({ type: "HIDE_CONTROLS" });
      }
    },
    timeout: 1000 * 5,
  });

  useEffect(resetIdleTimer, [state.mode]);

  useEffect(() => {
    if (allowFullscreen) {
      if (state.maximize) {
        requestFullscreen();
      } else {
        exitFullscreen();
      }
    }
  }, [allowFullscreen, state.maximize, state.mobile]);

  return (
    <ThemeProvider theme={state.themeType === "dark" ? darkTheme : lightTheme}>
      <ChantingWindowInner {...props} dispatch={dispatch} state={state} />
    </ThemeProvider>
  );
};

export default ChantingWindow;
