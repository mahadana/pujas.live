import slugify from "slugify";
import isNil from "lodash/isNil";

// TODO redundant with worker/src/youtube.js
export const getYouTubeVideoIdFromUrl = (url) => {
  // Based on https://stackoverflow.com/a/37704433
  const regex = /^\s*(?:(?:https?:)?\/\/)?(?:(?:www|m)\.)?(?:(?:youtube\.com|youtu\.be))(?:\/(?:[-\w]+\?v=|embed\/|v\/)?)([-\w]+)(?:\S+)?$/;
  const m = String(url).match(regex);
  return m ? m[1] : false;
};

// TODO redundant with worker/src/youtube.js
export const getYouTubeEmbedVideoUrlFromVideoId = (videoId, options = {}) => {
  let url = `https://www.youtube.com/embed/${videoId}`;
  const extras = [];
  if (options.autoplay) extras.push("autoplay=1");
  if (!isNil(options.skip)) extras.push("start=" + options.skip);
  if (extras.length) url += "?" + extras.join("&");
  return url;
};

// TODO redundant with worker/src/youtube.js
export const getYouTubeVideoUrlFromVideoId = (videoId, options = {}) => {
  let url = `https://youtu.be/${videoId}`;
  const extras = [];
  if (!isNil(options.skip)) extras.push("t=" + options.skip);
  if (extras.length) url += "?" + extras.join("&");
  return url;
};

export const getRecordingVideoUrl = (recording, { autoplay, skip }) => {
  let videoUrl = recording.recordingUrl;
  const youTubeVideoId = getYouTubeVideoIdFromUrl(videoUrl);
  if (youTubeVideoId) {
    videoUrl = (recording.embed
      ? getYouTubeEmbedVideoUrlFromVideoId
      : getYouTubeVideoUrlFromVideoId)(youTubeVideoId, {
      autoplay,
      skip,
    });
  }
  return videoUrl;
};

export const getBackFromQuery = (query, defaultPath = "/") => {
  return (query || {}).back || defaultPath;
};

export const getPushBackUrl = (router, path) =>
  path + (router.asPath ? "?back=" + encodeURIComponent(router.asPath) : "");

export const pushBack = (router, defaultPath = "/") => {
  router.push(getBackFromQuery(router.query, defaultPath));
};

const slugifyTitle = (title) =>
  slugify(title || "-", {
    lower: true,
    strict: true,
  }).slice(0, 32);

export const getChannelRecordingsPath = (channel) => {
  const slug = slugifyTitle(channel.title);
  return `/channel/${channel.id}/${slug}/recordings`;
};

export const getRecordingPath = (recording) => {
  const slug = slugifyTitle(recording.title);
  return `/recording/${recording.id}/${slug}`;
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
  } else if (error?.message) {
    return error.message;
  } else {
    return "Unknown server error";
  }
};

export const sleep = (time) =>
  new Promise((resolve) => setTimeout(resolve, time));
