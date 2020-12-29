import cheerio from "cheerio";
import fetch from "cross-fetch";

const parseYouTubeChannelIdFromHtml = (html) => {
  const $ = cheerio.load(html);
  const nodes = $('meta[itemprop="channelId"]');
  return nodes.first().attr("content") || false;
};

const getYouTubeChannelIdFromWeb = async (url) => {
  const response = await fetch(url);
  if (response.ok) {
    const html = await response.text();
    return parseYouTubeChannelIdFromHtml(html);
  } else {
    return false;
  }
};

const getYouTubeChannelIdFromApi = async (user) => {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) {
    console.warn("YOUTUBE_API_KEY not defined in .env");
    return false;
  }
  const url =
    `https://www.googleapis.com/youtube/v3/channels?` +
    `part=id&forUsername=${user}&key=${key}`;
  const response = await fetch(url);
  if (!response.ok) return false;
  const data = await response.json();
  return data?.items?.[0]?.id || false;
};

export const getYouTubeChannelId = async (
  url,
  { api = true, web = true } = {}
) => {
  const regex = /^\s*(?:(?:http|https):\/\/)?(?:www\.)?youtube\.com\/(|c\/|channel\/|u\/|user\/)([a-zA-Z0-9\-_]+)\s*$/;
  let channelId = false;
  const m = String(url).match(regex);
  if (!m) {
    return channelId;
  }
  const [_, type, arg] = m;
  if (type === "channel/") {
    channelId = arg;
  }
  if (!channelId && web) {
    const cleanUrl = `https://www.youtube.com/${type}${arg}`;
    channelId = getYouTubeChannelIdFromWeb(cleanUrl);
  }
  if (!channelId && api) {
    channelId = getYouTubeChannelIdFromApi(arg);
  }
  return channelId;
};
