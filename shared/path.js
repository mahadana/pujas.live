const slugify = require("slugify");

const {
  getYouTubeEmbedVideoUrlFromVideoId,
  getYouTubeVideoIdFromUrl,
  getYouTubeVideoUrlFromVideoId,
} = require("./youtube");

const makeSlug = (title) =>
  slugify(title || "-", {
    lower: true,
    strict: true,
  }).slice(0, 32);

const getChannelRecordingsPath = (channel) =>
  `/channel/${channel.id}/${makeSlug(channel.title)}/recordings`;

const getGroupEditPath = (group) =>
  `/group/${group.id}/${makeSlug(group.title)}/edit`;

const getGroupMessagePath = (group) =>
  `/group/${group.id}/${makeSlug(group.title)}/message`;

const getRecordingPath = (recording) =>
  `/recording/${recording.id}/${makeSlug(recording.title)}`;

const getRecordingVideoUrl = (recording, { autoplay, skip } = {}) => {
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

module.exports = {
  getChannelRecordingsPath,
  getGroupEditPath,
  getGroupMessagePath,
  getRecordingPath,
  getRecordingVideoUrl,
};
