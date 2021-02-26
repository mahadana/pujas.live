import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useEffect, useState } from "react";

import Loading from "@/components/Loading";

const CCB_URL =
  "https://pujas-live.sfo3.digitaloceanspaces.com/chantest/ccb.json";

const fetchData = async (rawToc) => {
  // Remote site needs header "Access-Control-Allow-Origin *"" if serving
  // from another domain;
  const data = await (await fetch(CCB_URL)).json();

  data.chants = {
    chantMap: data.chants.reduce((map, chant) => {
      map[chant.id] = chant;
      return map;
    }, {}),
    chants: data.chants,
  };

  if (rawToc) return data;

  data.toc.forEach((volume) => {
    volume.parts.forEach((part) => {
      if (volume.volume == 1 && (part.part == 1 || part.part == 2)) {
        part.chantSet.pop();
        part.chants = part.chants.slice(-1);
      } else if (volume.volume == 2 && part.part == 3) {
        part.chants = [];
      } else if (volume.volume == 1 && part.part == 4) {
        part.chants.shift(); // Remove Añjali
      }
      part.chants.forEach((chant) => {
        if (!chant.chantSet && !(volume.volume == 2 && part.part == 2)) {
          chant.chantSet = [chant.link];
        }
      });
    });
  });

  return data;
};

const ChantLoader = ({ children, rawToc = false }) => {
  const mobile = useMediaQuery("(max-width: 600px), (max-height: 600px)");
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!data) {
      fetchData(rawToc).then(setData).catch(console.error);
    }
  }, [data]);

  return (
    <Loading queryResult={{ data, loading: !data }}>
      {({ data }) => children({ ...data, mobile })}
    </Loading>
  );
};

export default ChantLoader;
