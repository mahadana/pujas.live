import Fade from "@material-ui/core/Fade";
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
import escape from "lodash/escape";
import { useCallback, useEffect, useReducer } from "react";

import Chant from "@/components/chanting/Chant";
import ChantCloseControls from "@/components/chanting/ChantCloseControls";
import ChantOperationControls from "@/components/chanting/ChantOperationControls";
import ChantDebugControls from "@/components/chanting/ChantDebugControls";
import ChantIdleProvider from "@/components/chanting/ChantIdleProvider";
import ChantPerformanceIndicators from "@/components/chanting/ChantPerformanceIndicators";
import ChantScroller from "@/components/chanting/ChantScroller";
import ChantSettingsPanel from "@/components/chanting/ChantSettingsPanel";
import ChantToc from "@/components/chanting/ChantToc";
import darkTheme from "@/lib/theme";
import { exitFullscreen, requestFullscreen } from "@/lib/util";
import {
  addExplicitTiming,
  normalizeTiming,
  importTimingFromStore,
  getChantNodes,
} from "@/lib/chanting";

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
    ...(state.fullscreen || state.mobile
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
  fade: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
}));

const initialize = ({ chants, mobile, toc }) => ({
  activeIndex: "START",
  chant: null,
  chants,
  close: false,
  debug: false,
  fontSize: 24,
  fullscreen: false,
  highlight: false,
  mobile,
  performance: false,
  playing: false,
  settings: false,
  speed: 1.0,
  themeType: "light",
  timing: null,
  toc,
  useTiming: null,
  view: "TOC",
});

const reducer = (state, action) => {
  switch (action.type) {
    case "CLOSE": {
      if (state.settings) {
        return { ...state, settings: false };
      } else if (state.view === "CHANT") {
        return {
          ...state,
          activeIndex: "START",
          chant: null,
          playing: false,
          view: "TOC",
        };
      } else {
        return {
          ...state,
          activeIndex: "START",
          chant: null,
          close: true,
          fullscreen: false,
          playing: false,
        };
      }
    }
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
        chantSet: action.chantSet,
        link: action.link,
        title: action.title,
        useTiming: state.useTiming,
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
    case "SET_FONT_SIZE":
      return { ...state, fontSize: action.fontSize };
    case "SET_FULLSCREEN":
      return { ...state, fullscreen: action.fullscreen };
    case "SET_SPEED":
      return { ...state, speed: action.speed };
    case "SET_THEME_TYPE":
      return { ...state, themeType: action.themeType };
    case "STOP_PLAYING":
      return { ...state, playing: false };
    case "TOGGLE_DEBUG":
      return { ...state, debug: !state.debug };
    case "TOGGLE_HIGHLIGHT":
      return { ...state, highlight: !state.highlight };
    case "TOGGLE_PERFORMANCE":
      return { ...state, performance: !state.performance };
    case "TOGGLE_PLAYING": {
      if (!state.playing && state.activeIndex === "END") {
        return { ...state, activeIndex: "START", playing: true };
      } else {
        return { ...state, playing: !state.playing };
      }
    }
    case "TOGGLE_SETTINGS":
      return { ...state, controls: !state.settings, settings: !state.settings };
    case "TOGGLE_USE_TIMING":
      return { ...state, useTiming: !state.useTiming };
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

const addChantMeta = (chant, useTiming) => {
  const nodes = getChantNodes(chant);

  let timing = useTiming ? importTimingFromStore(chant.id) : null;
  if (timing) {
    timing = addExplicitTiming(normalizeTiming(timing, nodes.length - 2));
    nodes.forEach((node, index) => {
      if (index < 2) {
        node.start = node.end = timing.start;
        node.duration = 0;
      } else {
        const timeNode = timing.nodes[index - 2];
        node.start = timeNode.start;
        node.end = timeNode.end;
        node.duration = timeNode.end - timeNode.start;
      }
    });
  } else {
    let lastEnd = 0;
    nodes.forEach((node) => {
      node.start = lastEnd;
      if (node.type === "verse") {
        const [, charCount] = getWordCharCount(node.html);
        if (node.lang == "pi" || String(node.html).match(/[āīūḷṇṃḍṭṅñ]/)) {
          node.duration = 0.7 + 0.14 * charCount;
        } else {
          node.duration = 1.2 + 0.07 * charCount;
        }
      } else {
        node.duration = 1;
      }
      node.end = lastEnd = node.start + node.duration;
    });
  }

  // const walkNode = (node) => {
  //   if (node?.html) {
  //     if (node.start) startIndex = textIndex;
  //     [node.wordCount, node.charCount] = getWordCharCount(node.html);
  //     if (timing) {
  //       const timeIndex = textIndex - 2; // ignore first two headers
  //       const timeNodes = timing.nodes;
  //       const timeNode = timeNodes[timeIndex];
  //       if (timeIndex == -1) {
  //         let duration = null;
  //         for (let i = 0; !_isFinite(duration) && i < timeNodes.length; i++) {
  //           duration = timeNodes[i].start;
  //         }
  //         if (!_isFinite(duration)) duration = 0.001;
  //         node.duration = duration;
  //       } else if (timeIndex >= 0 && timeNode && timeNode.start) {
  //         let end = timeNode.end;
  //         for (
  //           let i = timeIndex + 1;
  //           !_isFinite(end) && i < timeNodes.length;
  //           i++
  //         ) {
  //           end = timeNodes[i].start;
  //         }
  //         if (!isFinite(end)) end = 999999999;
  //         node.duration = end - timeNode.start;
  //       } else {
  //         node.duration = 0.001;
  //       }
  //     } else {
  //       if (node.type === "verse") {
  //         if (node.lang == "pi" || String(node.html).match(/[āīūḷṇṃḍṭṅñ]/)) {
  //           node.duration = 0.7 + 0.14 * node.charCount;
  //         } else {
  //           node.duration = 1.2 + 0.07 * node.charCount;
  //         }
  //       } else {
  //         node.duration = 1;
  //       }
  //     }
  //     node.textIndex = textIndex++;
  //     textNodeMap.push(node);
  //   } else if (node?.children) {
  //     node?.children?.forEach?.(walkNode);
  //   }
  // };
  // walkNode(chant);

  chant.timing = timing;
  chant.startIndex = nodes.find((node) => node.startLink)?.index ?? 0;
  chant.textCount = nodes.length;
  chant.textNodeMap = nodes;
  console.log(chant);
  return chant;
};

const getChantFromToc = ({ chants, chantSet, link, title, useTiming }) => {
  const chant = chantSet
    .map((chantId) => chants.chantMap[chantId])
    .filter((chant) => chant)
    .reduce(
      (combined, chant) => {
        combined.children.push({
          type: "h2",
          startLink: chant.id === link,
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
        combined.id = combined.id ? `${combined.id},${chant.id}` : chant.id;
        combined.lang = combined.lang
          ? combined.lang === chant.lang
            ? chant.lang
            : "mixed"
          : chant.lang;
        return combined;
      },
      { title, id: "", children: [{ type: "h1", html: escape(title) }] }
    );

  return chant.children?.length > 0 ? addChantMeta(chant, useTiming) : null;
};

// This inner component is needed for the theme to apply.
const ChantWindowInner = ({ dispatch, state }) => {
  const classes = useStyles({ state });

  const onOpenToc = useCallback(
    (props) => dispatch({ ...props, type: "OPEN_CHANT_FROM_TOC" }),
    [dispatch]
  );

  return (
    <div className={classes.root}>
      <ChantCloseControls dispatch={dispatch} state={state} />
      <ChantDebugControls dispatch={dispatch} state={state} />
      <ChantOperationControls dispatch={dispatch} state={state} />
      <ChantSettingsPanel dispatch={dispatch} state={state} />
      <Fade in={state.view === "CHANT"}>
        <div className={classes.fade}>
          <ChantScroller dispatch={dispatch} state={state}>
            <Chant
              chant={state.chant}
              fontSize={state.fontSize}
              highlight={state.highlight}
            />
          </ChantScroller>
        </div>
      </Fade>
      <Fade in={state.view === "TOC"}>
        <div className={classes.fade}>
          <ChantToc onOpen={onOpenToc} raw={state.debug} toc={state.toc} />
        </div>
      </Fade>
      <ChantPerformanceIndicators />
    </div>
  );
};

const ChantWindow = ({
  allowFullscreen = true,
  chants,
  mobile,
  onClose,
  toc,
}) => {
  const reducerDefaults = { chants, mobile, toc };
  const [state, dispatch] = useReducer(reducer, reducerDefaults, initialize);

  useEffect(() => {
    if (allowFullscreen) {
      if (state.fullscreen) {
        requestFullscreen();
      } else {
        exitFullscreen();
      }
    }
  }, [allowFullscreen, state.fullscreen, state.mobile]);

  useEffect(() => {
    if (state.close) onClose();
  }, [state.close]);

  const theme = state.themeType === "dark" ? darkTheme : lightTheme;

  return (
    <ChantIdleProvider>
      <ThemeProvider theme={theme}>
        <ChantWindowInner dispatch={dispatch} state={state} />
      </ThemeProvider>
    </ChantIdleProvider>
  );
};

export default ChantWindow;
