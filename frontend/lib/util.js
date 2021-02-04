import isNil from "lodash/isNil";
import { useRouter } from "next/router";

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

export const useRouteBack = (router) => {
  if (!router) {
    router = useRouter();
  }
  return {
    get: (path) =>
      path +
      (router.asPath ? "?back=" + encodeURIComponent(router.asPath) : ""),
    push: (path = "/") => router.push(router.query?.back || path),
  };
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
