import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useEffect, useState } from "react";

import Loading from "@/components/Loading";

const CCB_URL =
  "https://pujas-live.sfo3.digitaloceanspaces.com/chantest/ccb.json";

const fetchData = async () => {
  // Remote site needs header "Access-Control-Allow-Origin *"" if serving
  // from another domain;
  const data = await (await fetch(CCB_URL)).json();

  data.chants = {
    chantMap: data.chants.reduce((map, chant) => {
      map[chant.id] = chant;
      return map;
    }, {}),
    chants: data.chants,
    toc: data.toc,
  };

  return data;
};

const ChantLoader = ({ children }) => {
  const mobile = useMediaQuery("(max-width: 600px), (max-height: 600px)");
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!data) {
      fetchData().then(setData).catch(console.error);
    }
  }, [data]);

  return (
    <Loading queryResult={{ data, loading: !data }}>
      {({ data }) => children({ ...data, mobile })}
    </Loading>
  );
};

export default ChantLoader;
