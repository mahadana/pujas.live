import dotenv from "dotenv";
import _ from "lodash";

import db from "./db";
import { dayjs } from "./time";
import YouTube from "./youtube";

const getChannels = async (knex) => {
  console.log(`Pass 1: get channels`);
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
  console.log(`Pass 2: get YouTube video ids from channels`);
  const videoIds = [];
  const yt = new YouTube();
  const cyt = new YouTube({ cache: true, cacheTimeout: 60 * 60 * 24 });
  try {
    for (const channel of channels) {
      console.log(`  channel id = ${channel.id}, title = ${channel.title}`);
      channel.videoId = false;
      try {
        const ytChannelId = await cyt.getChannelIdFromUrl(channel.channelUrl);
        console.log(`    ytChannelId = ${ytChannelId}`);
        if (!ytChannelId) {
          console.warn(`    aborting (no ytChannelId)...`);
          continue;
        }
        const videoId = await yt.getLatestVideoIdFromChannelId(ytChannelId);
        console.log(`    videoId = ${videoId}`);
        if (videoId) {
          channel.videoId = videoId;
          videoIds.push(videoId);
        }
      } catch (error) {
        console.error(`    got error: ${error.message}`);
        console.error(error);
      }
    }
  } finally {
    await cyt.destroy();
  }
  return _.uniq(videoIds);
};

const getYouTubeDatas = async (videoIds) => {
  console.log(`Pass 3: get latest YouTube data for channels`);
  const yt = new YouTube();
  let datas;
  try {
    // TODO, there is a limit of 50 videos per request
    datas = await yt.getVideoDataFromVideoIds(videoIds);
  } catch (error) {
    console.error(`  got error: ${error.message}`);
    console.error(error);
    datas = false;
  }
  if (datas) {
    console.log(`  ${Object.keys(datas).length} data entries`);
  } else {
    console.warn("  aborting (no data)...");
  }
  return datas;
};

const updateChannels = async (knex, channels, datas) => {
  console.log(`Pass 4: update channels with latest data`);
  for (const channel of channels) {
    const videoId = channel.videoId;
    console.log(
      `  channel id = ${channel.id}, ` +
        `videoId = ${channel.videoId}, title = ${channel.title}`
    );
    if (videoId) {
      const data = datas[videoId];
      if (data) {
        await updateChannelWithData(knex, channel, data);
      } else {
        console.warn(`    unexpectedly data not found, aborting...`);
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
        console.log(
          `    skipping existing recording id = ${existing.id}` +
            `, automate = ${existing.automate}`
        );
        return;
      }
      recordingId = existing.id;
      await knex("recordings")
        .update({ ...values, updated_at: now })
        .where("recordingUrl", recordingUrl);
      action = "updated";
    } else {
      [recordingId] = await knex
        .insert({
          ...values,
          recordingUrl,
          channel: channel.id,
          published_at: now,
          updated_at: now,
          created_at: now,
        })
        .into("recordings")
        .returning("id");
      action = "created";
    }
    console.log(
      `    ${action} recording id = ${recordingId}, title = ${values.title}`
    );
    await knex("channels")
      .update({ activeStream: recordingId })
      .where("id", channel.id);
  } catch (error) {
    console.error(`    error during update: ${error}`);
    console.error(error);
  }
};

const updateChannelWithoutData = async (knex, channel) => {
  if (channel.activeStream) {
    await knex("channels")
      .update({ activeStream: null })
      .where("id", channel.id);
    console.log(`    removed activeStream from channel id = ${channel.id}`);
  } else {
    console.log(`    nothing to do...`);
  }
};

const getInactiveYouTubeRecordings = async (knex) => {
  const dbRecordings = await knex
    .select("recordings.id", "recordings.recordingUrl")
    .from("recordings")
    .leftJoin("channels", "channels.activeStream", "recordings.id")
    .where("recordings.automate", "youtube")
    .whereNull("channels.activeStream")
    .orderBy("recordings.id");
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

const updateInactiveYouTubeRecordings = async (knex) => {
  console.log(`Pass 5: update inactive YouTube recordings`);

  console.log(`  get inactive YouTube recordings`);
  let recordings;
  try {
    recordings = await getInactiveYouTubeRecordings(knex);
  } catch (error) {
    console.error(`    got error: ${error.message}`);
    console.error(error);
    return;
  }
  if (recordings.length > 0) {
    console.log(`    ${recordings.length} entries`);
  } else {
    console.warn(`     aborting (no recordings)...`);
    return;
  }

  console.log(`  get latest YouTube data for recordings`);
  const yt = new YouTube();
  const videoIds = _.uniq(recordings.map((r) => r.videoId));
  let datas;
  try {
    // TODO, there is a limit of 50 videos per request
    datas = await yt.getVideoDataFromVideoIds(videoIds);
  } catch (error) {
    console.error(`    got error: ${error.message}`);
    console.error(error);
    return;
  }
  const datasLength = Object.keys(datas).length;
  if (datas && datasLength > 0) {
    console.log(`    ${datasLength} entries`);
  } else {
    console.warn("     aborting (no data)...");
    return;
  }

  console.log(`  update recordings`);
  for (const recording of recordings) {
    console.log(`    id = ${recording.id}, videoId = ${recording.videoId}`);
    const data = datas[recording.videoId];
    if (!data) {
      console.warn(`      data not found, skipping...`);
      continue;
    }
    const values = makeRecordingValuesFromData(data);
    try {
      await knex("recordings").update(values).where("id", recording.id);
    } catch (error) {
      console.error(`      got error: ${error.message}`);
      console.error(error);
    }
  }
};

export const processAutomations = async () => {
  try {
    const knex = db.init();
    try {
      console.log();
      const channels = await getChannels(knex);
      console.log();
      const videoIds = await getVideoIdsFromChannels(channels);
      console.log();
      const datas = await getYouTubeDatas(videoIds);
      if (datas) {
        console.log();
        await updateChannels(knex, channels, datas);
      }
      console.log();
      await updateInactiveYouTubeRecordings(knex);
      console.log();
    } finally {
      await knex.destroy();
    }
  } catch (error) {
    console.error("Got uncaught exception:");
    console.error(error);
  }
};

if (require.main === module) {
  dotenv.config();
  if (process.env.YOUTUBE_API_KEY) {
    processAutomations().then().catch(console.error);
  } else {
    console.warn("YOUTUBE_API_KEY not defined in worker/.env");
  }
}
