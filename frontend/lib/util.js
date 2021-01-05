// TODO redundant with worker/src/youtube.js
export const getYouTubeVideoIdFromUrl = (url) => {
  // Based on https://stackoverflow.com/a/37704433
  const regex = /^\s*(?:(?:https?:)?\/\/)?(?:(?:www|m)\.)?(?:(?:youtube\.com|youtu\.be))(?:\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(?:\S+)?$/;
  const m = String(url).match(regex);
  return m ? m[1] : false;
};

// TODO redundant with worker/src/youtube.js
export const getYouTubeEmbedVideoUrlFromVideoId = (videoId) => {
  return `https://www.youtube.com/embed/${videoId}`;
};

export const getBackFromQuery = (query, defaultPath = "/") => {
  return (query || {}).back || defaultPath;
};

export const getPushBackUrl = (router, path) =>
  path + (router.asPath ? "?back=" + encodeURIComponent(router.asPath) : "");

export const pushBack = (router, defaultPath = "/") => {
  router.push(getBackFromQuery(router.query, defaultPath));
};

export const getStrapiError = (error) => {
  return error?.graphQLErrors?.[0]?.extensions?.exception?.data?.data?.[0]
    ?.messages?.[0];
};

export const translateStrapiError = (error) => {
  const strapiError = getStrapiError(error);
  if (strapiError?.id === "Auth.form.error.invalid") {
    return "Incorrect email or password";
  } else if (error?.message === "Forbidden") {
    return "You are not logged in";
  } else if (strapiError?.message) {
    return strapiError.message;
  } else {
    return "Unknown server error";
  }
};

export const sleep = (time) =>
  new Promise((resolve) => setTimeout(resolve, time));
