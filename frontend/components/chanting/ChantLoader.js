import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useEffect, useState } from "react";

import ChantDataUrlField from "@/components/chanting/inputs/ChantDataUrlField";
import Loading from "@/components/Loading";

const PRODUCTION_DATA_URL =
  "https://raw.githubusercontent.com/mahadana/chanting-pujas.live/main/dist";
const LOCAL_DATA_URL = "http://localhost:3030";
const LOCAL_STORAGE_DATA_URL_KEY = "dataUrl";

const fetchData = async (dataUrl) => {
  // Remote site needs header "Access-Control-Allow-Origin *"" if serving
  // from another domain;
  const chantsUrl = `${dataUrl}/chants.json`;
  const timingUrl = `${dataUrl}/timing.json`;
  const options = { cache: "no-cache" };
  const fetchers = [fetch(chantsUrl, options), fetch(timingUrl, options)];
  const [chantData, timing] = await Promise.all(
    (await Promise.all(fetchers)).map((response) => response.json())
  );

  const chantMap = chantData.chants.reduce((map, chant) => {
    map[chant.id] = chant;
    return map;
  }, {});

  const timingMap = timing.reduce((map, chantTiming) => {
    map[chantTiming.id] = chantTiming;
    return map;
  }, {});

  return {
    chantMap,
    chants: chantData.chants,
    timing,
    timingMap,
    toc: chantData.toc,
  };
};

const getDataUrlFromStore = () =>
  window.localStorage.getItem(LOCAL_STORAGE_DATA_URL_KEY) ?? null;

const setDataUrlToStore = (dataUrl) =>
  window.localStorage.setItem(LOCAL_STORAGE_DATA_URL_KEY, dataUrl);

const ChantLoader = ({ children }) => {
  const mobile = useMediaQuery("(max-width: 600px), (max-height: 600px)");
  const [data, setData] = useState(null);
  const [dataUrl, setDataUrl] = useState(null);

  useEffect(() => {
    if (!dataUrl) {
      setDataUrl(getDataUrlFromStore() ?? PRODUCTION_DATA_URL);
    }
    if (dataUrl) {
      if (data) setData(null);
      fetchData(dataUrl).then(setData).catch(console.error);
    }
  }, [dataUrl]);

  const onLocal = () => onSet(LOCAL_DATA_URL);
  const onProduction = () => onSet(PRODUCTION_DATA_URL);
  const onSet = (newUrl) => {
    setDataUrl(newUrl);
    setDataUrlToStore(newUrl);
  };

  return (
    <>
      <ChantDataUrlField
        onLocal={onLocal}
        onProduction={onProduction}
        onSet={onSet}
        url={dataUrl}
      />
      <Loading queryResult={{ data, loading: !data }}>
        {({ data: chantData }) => children({ chantData, mobile })}
      </Loading>
    </>
  );
};

export default ChantLoader;
