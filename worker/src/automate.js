import dotenv from "dotenv";
import _ from "lodash";

import db from "@/db";
import logger from "@/logger";
import { dayjs } from "@/time";
import YouTube from "@/youtube";

const getChannels = async (knex) => {
  logger.info(`Pass 1: get channels`);
  const channels = await knex
    .select("channels.*", "recordings.id AS rid")
    .from("channels")
    .leftJoin("recordings", "recordings.id", "channels.activeStream")
    .where("channels.automate", "youtube")
    .whereNotNull("channels.channelUrl")
    .orderBy("channels.id");
  const recordingIds = [];
  const channelMap = {};
  for (const channel of channels) {
    channelMap[channel.rid] = channel;
    recordingIds.push(channel.rid);
    delete channel.rid;
  }
  const recordings = await knex
    .select("*")
    .from("recordings")
    .whereIn("id", recordingIds);
  for (const recording of recordings) {
    const channel = channels[recording.id];
    if (channel) {
      channel.activeStream = recording;
    }
  }
  return channels;
};

const getVideoIdsFromChannels = async (channels) => {
  logger.info(`Pass 2: get YouTube video ids from channels`);
  const videoIds = [];
  const yt = new YouTube();
  const cyt = new YouTube({ cache: true, cacheTimeout: 60 * 60 * 24 });
  try {
    for (const channel of channels) {
      logger.info(`  channel id = ${channel.id}, title = ${channel.title}`);
      channel.videoId = false;
      try {
        const ytChannelId = await cyt.getChannelIdFromUrl(channel.channelUrl);
        logger.info(`    ytChannelId = ${ytChannelId}`);
        if (!ytChannelId) {
          logger.warn(`    aborting (no ytChannelId)...`);
          continue;
        }
        const videoId = await yt.getLatestVideoIdFromChannelId(ytChannelId);
        logger.info(`    videoId = ${videoId}`);
        if (videoId) {
          channel.videoId = videoId;
          videoIds.push(videoId);
        }
      } catch (error) {
        logger.error(`    got error: ${error.message}`);
      }
    }
  } finally {
    await cyt.destroy();
  }
  return _.uniq(videoIds);
};

const getYouTubeDatas = async (videoIds) => {
  logger.info(`Pass 3: get latest YouTube data for channels`);
  const yt = new YouTube();
  let datas;
  try {
    // TODO, there is a limit of 50 videos per request
    datas = await yt.getVideoDataFromVideoIds(videoIds);
  } catch (error) {
    logger.error(`  got error: ${error.message}`);
    datas = false;
  }
  if (datas) {
    logger.info(`  ${Object.keys(datas).length} data entries`);
  } else {
    logger.warn("  aborting (no data)...");
  }
  return datas;
};

const updateChannels = async (knex, channels, datas) => {
  logger.info(`Pass 4: update channels with latest data`);
  for (const channel of channels) {
    const videoId = channel.videoId;
    logger.info(
      `  channel id = ${channel.id}, ` +
        `videoId = ${channel.videoId}, title = ${channel.title}`
    );
    if (videoId) {
      const data = datas[videoId];
      if (data) {
        await updateChannelWithData(knex, channel, data);
      } else {
        logger.warn(`    unexpectedly data not found, aborting...`);
      }
    } else {
      await updateChannelWithoutData(knex, channel);
    }
  }
};

const makeRecordingValuesFromData = (data) => {
  const startAt =
    data.liveStreamingDetails?.actualStartTime ||
    data.liveStreamingDetails?.scheduledStartTime ||
    null;
  const endAt =
    data.liveStreamingDetails?.actualEndTime ||
    data.liveStreamingDetails?.scheduledEndTime ||
    null;
  const now = new Date();
  return {
    title: data.snippet?.title,
    description: data.snippet?.description,
    automate: "youtube",
    embed: !!data.status?.embeddable,
    live: data.snippet?.liveBroadcastContent === "live",
    startAt,
    endAt,
    duration:
      startAt && endAt ? dayjs(endAt).diff(dayjs(startAt), "minute") : null,
    extra: data.snippet?.thumbnails
      ? {
          image: { provider: "youtube", thumbnails: data.snippet.thumbnails },
        }
      : null,
    published_at: now,
    updated_at: now,
  };
};

const updateChannelWithData = async (knex, channel, data) => {
  let recordingId, action;
  const now = new Date();
  const values = makeRecordingValuesFromData(data);
  const recordingUrl = new YouTube().getVideoUrlFromVideoId(channel.videoId);
  try {
    const existing = (
      await knex
        .select("*")
        .from("recordings")
        .where("recordingUrl", recordingUrl)
    )?.[0];
    if (existing) {
      if (existing.automate != "youtube") {
        logger.info(
          `    skipping existing recording id = ${existing.id}` +
            `, automate = ${existing.automate}`
        );
        return;
      }
      recordingId = existing.id;
      await knex("recordings")
        .update(values)
        .where("recordingUrl", recordingUrl);
      action = "updated";
    } else {
      [recordingId] = await knex
        .insert({
          ...values,
          recordingUrl,
          channel: channel.id,
          created_at: now,
        })
        .into("recordings")
        .returning("id");
      action = "created";
    }
    logger.info(
      `    ${action} recording id = ${recordingId}, title = ${values.title}`
    );
    await knex("channels")
      .update({ activeStream: recordingId })
      .where("id", channel.id);
  } catch (error) {
    logger.error(`    error during update: ${error}`);
  }
};

const updateChannelWithoutData = async (knex, channel) => {
  if (channel.activeStream) {
    await knex("channels")
      .update({ activeStream: null })
      .where("id", channel.id);
    logger.info(`    removed activeStream from channel id = ${channel.id}`);
  } else {
    logger.info(`    nothing to do...`);
  }
};

const getInactiveYouTubeRecordings = async (knex) => {
  const dbRecordings = await knex
    .select("recordings.id", "recordings.recordingUrl")
    .from("recordings")
    .leftJoin("channels", "channels.activeStream", "recordings.id")
    .where("recordings.automate", "=", "youtube")
    .where(function () {
      this.where("channels.automate", "!=", "youtube").orWhereNull(
        "channels.activeStream"
      );
    })
    .orderBy("recordings.updated_at", "asc")
    .orderBy("recordings.id", "desc")
    .limit(50); // TODO we currently limit these queries by 50 per YouTube limits
  const yt = new YouTube();
  let recordings = [];
  for (const recording of dbRecordings) {
    const videoId = await yt.getVideoIdFromUrl(recording.recordingUrl);
    if (videoId) {
      recording.videoId = videoId;
      recordings.push(recording);
    }
  }
  return recordings;
};

const updateRecording = async (knex, recording, values) => {
  await knex("recordings").update(values).where("id", recording.id);
};

const unpublishRecording = async (knex, recording) => {
  await knex("recordings")
    .update({ published_at: null, updated_at: new Date() })
    .where("id", recording.id);
};

const updateInactiveYouTubeRecordings = async (knex) => {
  logger.info(`Pass 5: update inactive YouTube recordings`);

  logger.info(`  get inactive YouTube recordings`);
  let recordings;
  try {
    // TODO, there is a limit of 50 videos per request
    recordings = await getInactiveYouTubeRecordings(knex);
  } catch (error) {
    logger.error(`    got error: ${error.message}`);
    return;
  }
  if (recordings.length > 0) {
    logger.info(`    ${recordings.length} entries`);
  } else {
    logger.warn(`     aborting (no recordings)...`);
    return;
  }

  logger.info(`  get latest YouTube data for recordings`);
  const yt = new YouTube();
  const videoIds = _.uniq(recordings.map((r) => r.videoId));
  let datas;
  try {
    // TODO, there is a limit of 50 videos per request
    datas = await yt.getVideoDataFromVideoIds(videoIds);
  } catch (error) {
    logger.error(`    got error: ${error.message}`);
    return;
  }
  const datasLength = Object.keys(datas).length;
  if (datas && datasLength > 0) {
    logger.info(`    ${datasLength} entries`);
  } else {
    logger.warn("     aborting (no data)...");
    return;
  }

  logger.info(`  update recordings`);
  for (const recording of recordings) {
    logger.info(`    id = ${recording.id}, videoId = ${recording.videoId}`);
    const data = datas[recording.videoId];
    try {
      if (data) {
        const values = makeRecordingValuesFromData(data);
        await updateRecording(knex, recording, values);
      } else {
        logger.info(`      no data (private?), unpublishing`);
        await unpublishRecording(knex, recording);
      }
    } catch (error) {
      logger.error(`      got error: ${error.message}`);
    }
  }
};

export const processAutomations = async () => {
  try {
    const knex = db.init();
    try {
      logger.info();
      const channels = await getChannels(knex);
      logger.info();
      const videoIds = await getVideoIdsFromChannels(channels);
      logger.info();
      const datas = await getYouTubeDatas(videoIds);
      if (datas) {
        logger.info();
        await updateChannels(knex, channels, datas);
      }
      logger.info();
      await updateInactiveYouTubeRecordings(knex);
      logger.info();
    } finally {
      await knex.destroy();
    }
  } catch (error) {
    logger.error(`Uncaught exception in processAutomations: ${error.message}`);
    console.error(error);
  }
};

if (require.main === module) {
  dotenv.config();
  if (process.env.YOUTUBE_API_KEY) {
    processAutomations().catch(console.error);
  } else {
    console.warn("YOUTUBE_API_KEY not defined in worker/.env");
  }
}
