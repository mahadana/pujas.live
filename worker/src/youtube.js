import cheerio from "cheerio";
import crypto from "crypto";
import fetch from "cross-fetch";

import Cache from "./cache";

const DEFAULT_CACHE_PREFIX = "worker-cache";
const DEFAULT_CACHE_TIMEOUT = 60; // seconds

class YouTube {
  constructor({
    apiKey = process.env.YOUTUBE_API_KEY,
    cache,
    cachePrefix = DEFAULT_CACHE_PREFIX,
    cacheTimeout = DEFAULT_CACHE_TIMEOUT,
  } = {}) {
    this.apiKey = apiKey;
    this.cache = cache === true ? new Cache() : cache;
    this.cachePrefix = cachePrefix;
    this.cacheTimeout = cacheTimeout;
  }

  async getChannelIdFromUrl(url) {
    const regex = /^\s*(?:(?:https?):\/\/)?(?:(?:www|m)\.)?youtube\.com\/(c\/|channel\/|u\/|user\/)?([a-zA-Z0-9\-_]+)(?:\/.+)??\s*$/;
    let channelId = false;
    const m = String(url).match(regex);
    if (!m) {
      return channelId;
    }
    const [_, type, arg] = m;
    if (type === "channel/") {
      channelId = arg;
    }
    if (!channelId) {
      const s = type !== undefined ? type : "";
      const webUrl = `https://www.youtube.com/${s}${arg}`;
      const html = await this.getTextFromUrl(webUrl);
      const $ = cheerio.load(html);
      const nodes = $('meta[itemprop="channelId"]');
      channelId = nodes.first().attr("content") || false;
    }
    if (!channelId && this.apiKey) {
      const apiUrl =
        `https://www.googleapis.com/youtube/v3/channels` +
        `?part=id&forUsername=${arg}&key=${this.apiKey}`;
      const data = await this.getJsonFromUrl(apiUrl);
      channelId = data?.items?.[0]?.id || false;
    }
    return channelId;
  }

  async getJsonFromUrl(url) {
    return JSON.parse(await this.getTextFromUrl(url));
  }

  async getTextFromUrl(url) {
    if (this.cache) {
      return await this._getCachedTextFromUrl(url);
    } else {
      return await this._getTextFromUrl(url);
    }
  }

  async getVideoDataFromVideoIds(ids) {
    if (!this.apiKey || !ids || ids.length === 0) {
      return false;
    }
    if (!Array.isArray(ids)) {
      ids = [ids];
    }
    const url =
      `https://www.googleapis.com/youtube/v3/videos` +
      `?part=liveStreamingDetails%2Csnippet%2Cstatus&` +
      ids.map((id) => `id=${id}`).join("&") +
      `&key=${this.apiKey}`;
    const data = await this.getJsonFromUrl(url);
    const result = {};
    data.items.forEach((item) => {
      result[item.id] = item;
    });
    return result;
  }

  async getVideoIdFromUrl(url) {
    // Based on https://stackoverflow.com/a/37704433
    const regex = /^\s*(?:(?:https?:)?\/\/)?(?:(?:www|m)\.)?(?:(?:youtube\.com|youtu\.be))(?:\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(?:\S+)?$/;
    const m = String(url).match(regex);
    return m ? m[1] : false;
  }

  async getVideoIdFromChannelId(channelId) {
    const url = `https://www.youtube.com/embed/live_stream?channel=${channelId}`;
    const html = await this.getTextFromUrl(url);
    const $ = cheerio.load(html);
    const nodes = $('link[rel="canonical"]');
    const videoUrl = nodes.first().attr("href");
    if (videoUrl) {
      const videoId = await this.getVideoIdFromUrl(videoUrl);
      if (videoId !== "live_stream") {
        return videoId;
      }
    }
    return false;
  }

  async _getCachedTextFromUrl(url) {
    const key = this._makeCacheKey(url);
    let data = await this.cache.get(key);
    if (data === null) {
      data = await this._getTextFromUrl(url);
      this.cache.setex(key, this.cacheTimeout, data);
    }
    return data;
  }

  async _getTextFromUrl(url) {
    const response = await fetch(url);
    if (response.ok) {
      return await response.text();
    } else {
      throw new Error(`Could not fetch ${url}`);
    }
  }

  _makeCacheKey(url) {
    // We hash URLs because they can contain private keys
    const hash = crypto.createHash("sha1").update(url).digest("hex");
    return `${this.cachePrefix}-${hash}`;
  }
}

export default YouTube;
