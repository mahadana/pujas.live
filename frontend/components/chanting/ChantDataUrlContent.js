import Typography from "@material-ui/core/Typography";
import { useEffect, useState } from "react";

import ChantDataUrlField from "@/components/chanting/inputs/ChantDataUrlField";

const PRODUCTION_DATA_URL =
  "https://raw.githubusercontent.com/mahadana/chanting-pujas.live/main/dist";
const LOCAL_DATA_URL = "http://localhost:3030";
const LOCAL_STORAGE_DATA_URL_KEY = "chantDataUrl";

export const hasChantDataUrl = () => Boolean(getChantDataUrlFromStore());

export const getChantDataUrl = () =>
  getChantDataUrlFromStore() || PRODUCTION_DATA_URL;

export const setDefaultChantDataUrl = () =>
  setChantDataUrlToStore(PRODUCTION_DATA_URL);

const getChantDataUrlFromStore = () =>
  window.localStorage.getItem(LOCAL_STORAGE_DATA_URL_KEY) ?? null;

const setChantDataUrlToStore = (url) =>
  window.localStorage.setItem(LOCAL_STORAGE_DATA_URL_KEY, url);

const ChantDataUrlContent = () => {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (url === null) {
      setUrl(getChantDataUrlFromStore() ?? PRODUCTION_DATA_URL);
    }
  }, [url]);

  const onLocal = () => onSet(LOCAL_DATA_URL);
  const onProduction = () => onSet(PRODUCTION_DATA_URL);
  const onSet = (newUrl) => {
    setUrl(newUrl);
    setChantDataUrlToStore(newUrl);
  };

  return (
    <>
      <Typography gutterBottom variant="h4">
        Chant Testing
      </Typography>
      <ChantDataUrlField
        onLocal={onLocal}
        onProduction={onProduction}
        onSet={onSet}
        url={url}
      />
    </>
  );
};

export default ChantDataUrlContent;
