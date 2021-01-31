import cheerio from "cheerio";
import crypto from "crypto";
import fetch from "cross-fetch";
import isNil from "lodash/isNil";

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

  async destroy() {
    if (this.cache) {
      await this.cache.quit();
    }
  }

  async getChannelIdFromUrl(url) {
    const regex = /^\s*(?:(?:https?):\/\/)?(?:(?:www|m)\.)?youtube\.com\/(c\/|channel\/|u\/|user\/)?([a-zA-Z0-9\-_]+)(?:[/?].+)??\s*$/;
    let channelId = false;
    const m = String(url).match(regex);
    if (!m) {
      return channelId;
    }
    const [, type, arg] = m;
    if (type === "channel/") {
      return arg;
    }
    let cacheKey;
    if (this.cache) {
      cacheKey = this._makeCacheKey("getChannelIdFromUrl:" + url);
      channelId = await this.cache.get(cacheKey);
      if (channelId) {
        return channelId;
      }
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
    if (this.cache) {
      await this.cache.setex(cacheKey, this.cacheTimeout, channelId);
    }
    return channelId;
  }

  getEmbedStreamUrlFromChannelId(channelId) {
    return `https://www.youtube.com/embed/live_stream?channel=${channelId}`;
  }

  getEmbedVideoUrlFromVideoId(videoId, options = {}) {
    let url = `https://www.youtube.com/embed/${videoId}`;
    const extras = [];
    if (options.autoplay) extras.push("autoplay=1");
    if (!isNil(options.skip)) extras.push("start=" + options.skip);
    if (extras.length) url += "?" + extras.join("&");
    return url;
  }

  async getJsonFromUrl(url) {
    return JSON.parse(await this.getTextFromUrl(url));
  }

  async getLatestVideoIdFromChannelId(channelId) {
    const url = this.getEmbedStreamUrlFromChannelId(channelId);
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
    const regex = /^\s*(?:(?:https?:)?\/\/)?(?:(?:www|m)\.)?(?:(?:youtube\.com|youtu\.be))(?:\/(?:[-\w]+\?v=|embed\/|v\/)?)([-\w]+)(?:\S+)?$/;
    const m = String(url).match(regex);
    return m ? m[1] : false;
  }

  getVideoUrlFromVideoId(videoId, options = {}) {
    let url = `https://youtu.be/${videoId}`;
    const extras = [];
    if (!isNil(options.skip)) extras.push("t=" + options.skip);
    if (extras.length) url += "?" + extras.join("&");
    return url;
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
