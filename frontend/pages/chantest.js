import Fade from "@material-ui/core/Fade";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import escape from "lodash/escape";
import sum from "lodash/sum";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";

import Chanting from "@/components/chanting/Chanting";
import ChantingControls from "@/components/chanting/ChantingControls";
import ChantingPaper from "@/components/chanting/ChantingPaper";
import ChantingWindow from "@/components/chanting/ChantingWindow";
import PageLayout from "@/components/PageLayout";
import ChantingToc from "@/components/chanting/ChantingToc";

const fetchChants = async () => {
  // Remote site needs header "Access-Control-Allow-Origin *"" if serving
  // from another domain;
  const response = await fetch(
    "https://vjagaro.github.io/community-chanting-book/dist/chanting.json"
  );
  return await response.json();
};

const fetchToc = async () => {
  const response = await fetch(
    "https://vjagaro.github.io/community-chanting-book/dist/toc.json"
  );
  return await response.json();
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
      { title, id: "combined", children: [] }
    );
  return chant.children.length > 0 ? addChantMeta(chant) : null;
};

const addChantMeta = (chant) => {
  const meta = getChantMeta(chant);
  return {
    ...chant,
    ...meta,
    // Ballpark seconds per char: 0.1, seconds per word: 1.0
    expectedTime: (0.1 * meta.charCount + 1.0 * meta.wordCount) / 2,
  };
};

const getChantMeta = (chant) => {
  const verseWordCounts = [];
  const verseCharCounts = [];

  const walkNode = (node) => {
    if (node?.type === "verse" && node?.html) {
      const [wordCount, charCount] = getWordCharCount(node.html);
      verseWordCounts.push(wordCount);
      verseCharCounts.push(charCount);
    } else if (node?.children) {
      node?.children?.forEach?.(walkNode);
    }
  };
  walkNode(chant);

  return {
    verseCount: verseWordCounts.length,
    verseWordCounts,
    verseCharCounts,
    wordCount: sum(verseWordCounts),
    charCount: sum(verseCharCounts),
  };
};

const addChantMap = (chants) => ({
  chantMap: chants.reduce((map, chant) => {
    map[chant.id] = chant;
    return map;
  }, {}),
  chants,
});

const setActiveChant = (chant, verseIndex) => {
  let walkIndex = 0;
  const walkNode = (node) => {
    if (node?.type === "verse") {
      walkIndex += 1;
      if (verseIndex && walkIndex == verseIndex) {
        node.active = true;
      } else if (node.active) {
        delete node.active;
      }
    } else if (node?.children) {
      node?.children?.forEach?.(walkNode);
    }
  };
  walkNode(chant);
};

const ChanTestPage = () => {
  const paperRef = useRef();
  const timeRef = useRef();
  const [toc, setToc] = useState(null);
  const [chants, setChants] = useState(null);
  const [chant, setChant] = useState(null);
  const [verseIndex, setVerseIndexBase] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [themeType, setThemeType] = useState("light");
  const [speed, setSpeed] = useState(1.0);
  const isMobile = !useMediaQuery((theme) => theme.breakpoints.up("sm"));
  const [maximize, setMaximize] = useState(undefined);
  const [showControls, setShowControls] = useState(true);

  const clearTimeRef = () => {
    if (timeRef.current) {
      clearTimeout(timeRef.current);
      timeRef.current = null;
    }
  };

  const setVerseIndex = (verseIndex) => {
    if (chant) setActiveChant(chant, verseIndex);
    setVerseIndexBase(verseIndex);
  };

  useEffect(() => {
    if (!chants) {
      fetchChants()
        .then((chants) => setChants(addChantMap(chants)))
        .catch(console.error);
    }
    if (!toc) {
      fetchToc()
        .then((toc) => setToc(toc))
        .catch(console.error);
    }
  }, []);

  useEffect(() => {
    setMaximize(isMobile);
  }, [isMobile]);

  useEffect(() => {
    const paperEl = paperRef.current;
    if (chant && paperEl) {
      let top;
      if (verseIndex <= 0) {
        top = 0;
      } else if (verseIndex > chant.verseCount) {
        top = paperEl.firstElementChild.clientHeight;
      } else {
        const activeEl = paperEl.querySelector(".chant-verse-active");
        const activeTop = activeEl?.offsetTop || 0;
        const activeHeight = activeEl?.clientHeight || 0;
        const halfActiveHeight = parseInt(activeHeight / 2);
        const viewWindow = parseInt(paperEl.clientHeight * 0.9); // 90%
        const targetTop = activeTop + halfActiveHeight - paperEl.scrollTop;
        const targetBottom = targetTop + activeHeight;
        const viewTop = parseInt((paperEl.clientHeight - viewWindow) / 2);
        const viewBottom = parseInt((paperEl.clientHeight + viewWindow) / 2);

        console.log({
          paper: paperEl,
          viewWindow,
          targetTop,
          targetBottom,
          viewTop,
          viewBottom,
        });

        if (targetTop < viewTop || targetBottom > viewBottom) {
          top =
            activeTop + halfActiveHeight - parseInt(paperEl.clientHeight / 2);
          top = Math.max(0, top);
        } else {
          top = null;
        }
      }
      if (top !== null) {
        paperEl.scrollTo({ top, left: 0, behavior: "smooth" });
      }
    }
  }, [verseIndex]);

  useEffect(() => {
    clearTimeRef();
    if (chant && playing) {
      if (verseIndex > chant.verseCount) {
        setPlaying(false);
      } else {
        let verseTime;
        if (verseIndex <= 0) {
          verseTime = 1;
        } else if (chant.charCount > 0) {
          verseTime =
            (chant.expectedTime * chant.verseCharCounts[verseIndex - 1]) /
            chant.charCount;
        } else {
          verseTime = 2; // If we don't know...
        }
        console.log(`Verse ${verseIndex} waiting ${verseTime.toFixed(1)}s`);
        timeRef.current = setTimeout(
          () => setVerseIndex(verseIndex + 1),
          (1000 * verseTime) / speed
        );
      }
    }

    return clearTimeRef;
  }, [playing, verseIndex]);

  useEffect(() => {
    const paperEl = paperRef.current;
    if (chant && paperEl) {
      const startEl = paperEl.querySelector(".chant-start");
      const top = (startEl?.offsetTop || 0) - 200;
      paperEl.scrollTo({ top, left: 0, behavior: "smooth" });
    }
  }, [chant]);

  const goBack = () => {
    setChant(null);
    setPlaying(false);
    setVerseIndex(0);
  };
  const onTocOpen = (props) => {
    const chant = getChantFromToc({ ...props, chants });
    setChant(chant);
    window.scrollTo({ top: 0, left: 0 });
  };
  const onWindowActive = () => setShowControls(true);
  const onWindowIdle = () => setShowControls(false);
  const loading = !chants && !toc;

  return (
    <PageLayout queryResult={{ data: !loading, loading }}>
      <>
        <Head>
          <link href="/fonts/style.css" rel="stylesheet" />
        </Head>
        <ChantingWindow
          maximize={maximize}
          onActive={onWindowActive}
          onIdle={onWindowIdle}
          themeType={themeType}
        >
          {chant ? (
            <>
              <Fade in={showControls}>
                <div>
                  <ChantingControls
                    goBack={goBack}
                    maximize={maximize}
                    playing={playing}
                    setMaximize={setMaximize}
                    setPlaying={setPlaying}
                    setSpeed={setSpeed}
                    setThemeType={setThemeType}
                    setVerseIndex={setVerseIndex}
                    speed={speed}
                    themeType={themeType}
                    verseCount={chant.verseCount}
                    verseIndex={verseIndex}
                  />
                </div>
              </Fade>
              <ChantingPaper ref={paperRef}>
                <Chanting chant={chant} />
              </ChantingPaper>
            </>
          ) : (
            toc && <ChantingToc toc={toc} onOpen={onTocOpen} />
          )}
        </ChantingWindow>
      </>
    </PageLayout>
  );
};

export default ChanTestPage;
