import { useEffect, useState } from "react";

import { getChantDataUrl } from "@/components/chanting/ChantDataUrlContent";
import Loading from "@/components/Loading";

const fetchData = async () => {
  const dataUrl = getChantDataUrl();
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

const ChantLoader = ({ children }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!data) {
      fetchData().then(setData).catch(console.error);
    }
  }, [data]);

  return (
    <Loading queryResult={{ data, loading: !data }}>
      {() => children(data)}
    </Loading>
  );
};

export default ChantLoader;
