import dotenv from "dotenv";

import db from "./db";
import { dayjs } from "./time";
import YouTube from "./youtube";

const getStreamsAndVideoIds = async (knex) => {
  console.log(`Pass 1: get streams, determine channelId and videoId`);
  const streams = await knex
    .select("*")
    .from("streams")
    .leftJoin("monasteries", "streams.monastery", "monasteries.id")
    .orderBy("streams.id");
  const videoIds = [];
  const yt = new YouTube();
  const cyt = new YouTube({ cache: true, cacheTimeout: 60 * 60 * 24 });
  try {
    for (const stream of streams) {
      console.log(`  stream id = ${stream.id}, name = ${stream.name}`);
      stream.videoId = false;
      try {
        const channelId = await cyt.getChannelIdFromUrl(stream.channelUrl);
        console.log(`    channelId = ${channelId}`);
        if (!channelId) {
          console.warn(`    aborting (no channelId)...`);
          continue;
        }
        const videoId = await yt.getLatestVideoIdFromChannelId(channelId);
        console.log(`    videoId = ${videoId}`);
        if (videoId) {
          stream.videoId = videoId;
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
  return { streams, videoIds };
};

const getYouTubeDatas = async (videoIds) => {
  console.log(`Pass 2: get latest YouTube data for streams`);
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

const updateStreams = async (knex, streams, datas) => {
  console.log(`Pass 3: update streams with latest data`);
  for (const stream of streams) {
    const videoId = stream.videoId;
    console.log(
      `  stream id = ${stream.id}, ` +
        `videoId = ${stream.videoId}, name = ${stream.name}`
    );
    if (videoId) {
      const data = datas[videoId];
      if (data) {
        await updateStreamWithData(knex, stream, data);
      } else {
        console.warn(`    unexpectedly data not found, aborting...`);
      }
    } else {
      await updateStreamWithoutData(knex, stream);
    }
  }
};

const updateStreamWithData = async (knex, stream, data) => {
  const yt = new YouTube();
  const embeddable = !!data?.status?.embeddable;
  const toUpdate = {
    duration: null,
    embeddable,
    startAt:
      data?.liveStreamingDetails?.scheduledStartTime ||
      data?.liveStreamingDetails?.actualStartTime ||
      null,
    streamUrl: (embeddable
      ? yt.getEmbedVideoUrlFromVideoId
      : yt.getVideoUrlFromVideoId)(stream.videoId),
  };
  if (toUpdate.startAt) {
    const s = dayjs(toUpdate.startAt).utc();
    const e = dayjs(
      data?.liveStreamingDetails?.scheduledEndTime || s.add(1, "hour")
    ).utc();
    toUpdate.duration = e.diff(s, "minute");
  }
  await updateStream(knex, stream, toUpdate);
};

const updateStreamWithoutData = async (knex, stream) => {
  await updateStream(knex, stream, {
    duration: null,
    embeddable: false,
    startAt: null,
    streamUrl: null,
  });
};

const updateStream = async (knex, stream, toUpdate) => {
  ["duration", "embeddable", "startAt", "streamUrl"].forEach((key) => {
    if (stream[key] instanceof Date) {
      stream[key] = stream[key].toISOString().split(".")[0] + "Z";
    }
    if (stream[key] === toUpdate[key]) {
      delete toUpdate[key];
    }
  });
  const updateKeys = Object.keys(toUpdate);
  if (updateKeys.length == 0) {
    console.log("    nothing to update");
    return;
  }
  console.log("    updating:");
  for (const key of updateKeys) {
    console.log(`      ${key}: ${stream[key]} => ${toUpdate[key]}`);
  }
  try {
    await knex("streams").where({ id: stream.id }).update(toUpdate);
    console.log("    update success!");
  } catch (error) {
    console.error(`    error during update: ${error}`);
    console.error(error);
  }
};

export const processStreams = async () => {
  try {
    dotenv.config();
    if (!process.env.YOUTUBE_API_KEY) {
      console.warn("YOUTUBE_API_KEY not defined in worker/.env, bailing...");
      return;
    }
    const knex = db.init();
    try {
      console.log();
      const { streams, videoIds } = await getStreamsAndVideoIds(knex);
      console.log();
      const datas = await getYouTubeDatas(videoIds);
      console.log();
      if (datas) {
        await updateStreams(knex, streams, datas);
        console.log();
      }
    } finally {
      await knex.destroy();
    }
  } catch (error) {
    console.error("Got uncaught exception:");
    console.error(error);
  }
};

if (require.main === module) {
  processStreams().then().catch(console.error);
}
