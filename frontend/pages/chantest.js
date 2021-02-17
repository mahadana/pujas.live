import Fade from "@material-ui/core/Fade";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import sum from "lodash/sum";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";

import Chanting from "@/components/chanting/Chanting";
import ChantingControls from "@/components/chanting/ChantingControls";
import ChantingPaper from "@/components/chanting/ChantingPaper";
import ChantingSelectList from "@/components/chanting/ChantingSelectList";
import ChantingWindow from "@/components/chanting/ChantingWindow";
import PageLayout from "@/components/PageLayout";

const fetchChantings = async () => {
  // Remote site needs header "Access-Control-Allow-Origin *"" if serving
  // from another domain;
  const response = await fetch(
    "https://vjagaro.github.io/community-chanting-book/dist/chanting.json"
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

const getChantingMeta = (chanting) => {
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
  walkNode(chanting);

  return {
    verseCount: verseWordCounts.length,
    verseWordCounts,
    verseCharCounts,
    wordCount: sum(verseWordCounts),
    charCount: sum(verseCharCounts),
  };
};

const applyChantingMeta = (chantings) =>
  chantings.map((chanting) => {
    const chantingMeta = getChantingMeta(chanting);
    return {
      ...chanting,
      ...chantingMeta,
      // Ballpark seconds per char: 0.1, seconds per word: 1.0
      expectedTime:
        (0.1 * chantingMeta.charCount + 1.0 * chantingMeta.wordCount) / 2,
    };
  });

const setActiveChanting = (chanting, verseIndex) => {
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
  walkNode(chanting);
};

const ChanTestPage = () => {
  const paperRef = useRef();
  const timeRef = useRef();
  const [chantings, setChantings] = useState(null);
  const [chanting, setChanting] = useState(null);
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
    if (chanting) setActiveChanting(chanting, verseIndex);
    setVerseIndexBase(verseIndex);
  };

  useEffect(() => {
    if (!chantings) {
      fetchChantings()
        .then((chantings) => setChantings(applyChantingMeta(chantings)))
        .catch(console.error);
    }
  }, []);

  useEffect(() => {
    setMaximize(isMobile);
  }, [isMobile]);

  useEffect(() => {
    const paper = paperRef.current;
    if (chanting && paper) {
      let top;
      if (verseIndex <= 0) {
        top = 0;
      } else if (verseIndex > chanting.verseCount) {
        top = paper.firstElementChild.clientHeight;
      } else {
        const activeEl = document.querySelector(".chanting-verse-active");
        const activeTop = activeEl?.offsetTop || 0;
        const activeHeight = activeEl?.clientHeight || 0;
        const halfActiveHeight = parseInt(activeHeight / 2);
        const viewWindow = parseInt(paper.clientHeight * 0.9); // 90%
        const targetTop = activeTop + halfActiveHeight - paper.scrollTop;
        const targetBottom = targetTop + activeHeight;
        const viewTop = parseInt((paper.clientHeight - viewWindow) / 2);
        const viewBottom = parseInt((paper.clientHeight + viewWindow) / 2);

        if (targetTop < viewTop || targetBottom > viewBottom) {
          top = activeTop + halfActiveHeight - parseInt(paper.clientHeight / 2);
          top = Math.max(0, top);
        } else {
          top = null;
        }
      }
      if (top !== null) {
        paper.scrollTo({ top, left: 0, behavior: "smooth" });
      }
    }
  }, [verseIndex]);

  useEffect(() => {
    clearTimeRef();
    if (chanting && playing) {
      if (verseIndex > chanting.verseCount) {
        setPlaying(false);
      } else {
        let verseTime;
        if (verseIndex <= 0) {
          verseTime = 1;
        } else if (chanting.charCount > 0) {
          verseTime =
            (chanting.expectedTime * chanting.verseCharCounts[verseIndex - 1]) /
            chanting.charCount;
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

  const goBack = () => {
    setChanting(null);
    setPlaying(false);
    setVerseIndex(0);
  };
  const onChantingSelect = (chanting) => {
    window.scrollTo({ top: 0, left: 0 });
    setChanting(chanting);
  };
  const onWindowActive = () => setShowControls(true);
  const onWindowIdle = () => setShowControls(false);

  return (
    <PageLayout queryResult={{ data: chantings, loading: !chantings }}>
      {({ data: chantings }) => (
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
            {!chanting ? (
              <ChantingSelectList
                chantings={chantings}
                onSelect={onChantingSelect}
              />
            ) : (
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
                      verseCount={chanting.verseCount}
                      verseIndex={verseIndex}
                    />
                  </div>
                </Fade>
                <ChantingPaper ref={paperRef}>
                  <Chanting chanting={chanting} />
                </ChantingPaper>
              </>
            )}
          </ChantingWindow>
        </>
      )}
    </PageLayout>
  );
};

export default ChanTestPage;
