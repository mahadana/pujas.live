const isNil = require("lodash/isNil");

const getYouTubeEmbedStreamUrlFromChannelId = (channelId) => {
  return `https://www.youtube.com/embed/live_stream?channel=${channelId}`;
};

const getYouTubeEmbedVideoUrlFromVideoId = (videoId, options = {}) => {
  let url = `https://www.youtube.com/embed/${videoId}`;
  const extras = [];
  if (options.autoplay) extras.push("autoplay=1");
  if (!isNil(options.skip)) extras.push("start=" + options.skip);
  if (extras.length) url += "?" + extras.join("&");
  return url;
};

const getYouTubeVideoIdFromUrl = (url) => {
  // Based on https://stackoverflow.com/a/37704433
  const regex = /^\s*(?:(?:https?:)?\/\/)?(?:(?:www|m)\.)?(?:(?:youtube\.com|youtu\.be))(?:\/(?:[-\w]+\?v=|embed\/|v\/)?)([-\w]+)(?:\S+)?$/;
  const m = String(url).match(regex);
  return m ? m[1] : false;
};

const getYouTubeVideoUrlFromVideoId = (videoId, options = {}) => {
  let url = `https://youtu.be/${videoId}`;
  const extras = [];
  if (!isNil(options.skip)) extras.push("t=" + options.skip);
  if (extras.length) url += "?" + extras.join("&");
  return url;
};

module.exports = {
  getYouTubeEmbedStreamUrlFromChannelId,
  getYouTubeEmbedVideoUrlFromVideoId,
  getYouTubeVideoIdFromUrl,
  getYouTubeVideoUrlFromVideoId,
};
