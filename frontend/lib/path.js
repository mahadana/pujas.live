import { useRouter } from "next/router";
import slugify from "slugify";

import {
  getYouTubeEmbedVideoUrlFromVideoId,
  getYouTubeVideoIdFromUrl,
  getYouTubeVideoUrlFromVideoId,
} from "@/lib/util";

const makeSlug = (title) =>
  slugify(title || "-", {
    lower: true,
    strict: true,
  }).slice(0, 32);

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

export const getChannelRecordingsPath = (channel) =>
  `/channel/${channel.id}/${makeSlug(channel.title)}/recordings`;

export const getGroupEditPath = (group) =>
  `/group/${group.id}/${makeSlug(group.title)}/edit`;

export const getGroupMessagePath = (group) =>
  `/group/${group.id}/${makeSlug(group.title)}/message`;

export const getRecordingPath = (recording) =>
  `/recording/${recording.id}/${makeSlug(recording.title)}`;

export const getRecordingVideoUrl = (recording, { autoplay, skip } = {}) => {
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
