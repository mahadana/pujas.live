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
import ChantSettings from "@/components/chanting/ChantSettings";
import darkTheme from "@/lib/theme";
import { exitFullscreen, requestFullscreen } from "@/lib/util";

const lightTheme = createMuiTheme({
  ...darkTheme,
  palette: {
    type: "light",
  },
});

const useStyles = makeStyles((theme) => ({
  root: ({ state }) => ({
    position: "fixed",
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    fontSize: "1.25rem",
    ...(state.maximize || state.mobile
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

const initialize = ({ chants, mobile, toc }) => ({
  activeIndex: "START",
  chant: null,
  chants,
  close: false,
  debug: false,
  fontSize: 24,
  highlight: false,
  idle: false,
  maximize: false,
  mobile,
  playing: false,
  settings: false,
  speed: 1.0,
  themeType: "light",
  toc,
  view: "TOC",
});

const reducer = (state, action) => {
  switch (action.type) {
    case "CLOSE":
      return { ...state, close: true, maximize: false, playing: false };
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
    case "OPEN_CHANT_FROM_TOC": {
      const chant = getChantFromToc({
        chants: state.chants,
        chantIndex: action.chantIndex,
        partIndex: action.partIndex,
        toc: state.toc,
        volumeIndex: action.volumeIndex,
      });
      if (chant) {
        return {
          ...state,
          activeIndex: chant.startIndex ?? "START",
          chant,
          // TODO handle raw chants explicitly by not showing chant window
          playing: !String(chant.title).match(
            /^(Appendix|Pāli Phonetics|Glossary)/
          ),
          view: "CHANT",
        };
      } else {
        return state;
      }
    }
    case "SET_ACTIVE_INDEX":
      return { ...state, activeIndex: action.activeIndex };
    case "SET_DEBUG":
      return { ...state, debug: action.debug, highlight: action.debug };
    case "SET_FONT_SIZE":
      return { ...state, fontSize: action.fontSize };
    case "SET_IDLE":
      return { ...state, idle: action.idle };
    case "SET_SPEED":
      return { ...state, speed: action.speed };
    case "SET_THEME_TYPE":
      return { ...state, themeType: action.themeType };
    case "STOP_PLAYING":
      return { ...state, playing: false };
    case "TOGGLE_MAXIMIZE":
      return { ...state, maximize: !state.maximize };
    case "TOGGLE_PLAYING": {
      if (!state.playing && state.activeIndex === "END") {
        return { ...state, activeIndex: "START", playing: true };
      } else {
        return { ...state, playing: !state.playing };
      }
    }
    case "TOGGLE_SETTINGS":
      return { ...state, controls: !state.settings, settings: !state.settings };
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
      if (node.type === "raw") return;
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

const getChantFromToc = ({
  chants,
  chantIndex,
  partIndex,
  toc,
  volumeIndex,
}) => {
  const tocPart = toc[volumeIndex]?.parts?.[partIndex];
  const tocChant = tocPart?.chants?.[chantIndex];
  let chantSet, link, title;
  if (tocChant) {
    chantSet = tocChant.chantSet || tocPart.chantSet;
    link = tocChant.link;
    title = tocPart.title;
  } else {
    chantSet = tocPart.chantSet;
    link = tocPart.link;
    title = tocPart.title;
  }

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
        if (chant.type === "raw") {
          combined.children.push({
            type: "raw",
            html: chant.html,
          });
        } else {
          chant.children.forEach((node) => {
            if (String(node?.type).match(/^h\d$/)) {
              node = { ...node, type: "h3" };
            }
            combined.children.push(node);
          });
        }
        combined.lang = combined.lang
          ? combined.lang === chant.lang
            ? chant.lang
            : "mixed"
          : chant.lang;
        return combined;
      },
      { title, id: "combined", children: [{ type: "h1", html: escape(title) }] }
    );

  return chant.children?.length > 0 ? addChantMeta(chant) : null;
};

// This inner component is needed for the theme to apply.
const ChantingWindowInner = ({ dispatch, state }) => {
  const classes = useStyles({ state });
  return (
    <div className={classes.root}>
      <Fade in={state.view === "CHANT" && (state.settings || !state.idle)}>
        <ChantControls dispatch={dispatch} state={state} />
      </Fade>
      <Fade in={state.view === "CHANT" && state.settings}>
        <ChantSettings dispatch={dispatch} state={state} />
      </Fade>
      {state.view === "CHANT" && (
        <ChantScroller dispatch={dispatch} state={state}>
          <Chant
            chant={state.chant}
            fontSize={state.fontSize}
            highlight={state.highlight}
          />
        </ChantScroller>
      )}
      {state.view === "TOC" && (
        <ChantingToc dispatch={dispatch} state={state} />
      )}
    </div>
  );
};

const ChantingWindow = ({
  allowFullscreen = true,
  chants,
  mobile,
  onClose,
  toc,
}) => {
  const [state, dispatch] = useReducer(
    reducer,
    { chants, mobile, toc },
    initialize
  );

  useIdleTimer({
    debounce: 500,
    onActive: () => {
      dispatch({ type: "SET_IDLE", idle: false });
    },
    onIdle: () => {
      dispatch({ type: "SET_IDLE", idle: true });
    },
    timeout: 1000 * 2,
  });

  useEffect(() => {
    if (allowFullscreen) {
      if (state.maximize) {
        requestFullscreen();
      } else {
        exitFullscreen();
      }
    }
  }, [allowFullscreen, state.maximize, state.mobile]);

  useEffect(() => {
    if (state.close) onClose();
  }, [state.close]);

  return (
    <ThemeProvider theme={state.themeType === "dark" ? darkTheme : lightTheme}>
      <ChantingWindowInner dispatch={dispatch} state={state} />
    </ThemeProvider>
  );
};

export default ChantingWindow;
