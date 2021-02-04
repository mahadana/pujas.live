import redis from "redis";
import { promisify } from "util";

export const redisHost = process.env.REDIS_HOST || "redis";
export const redisPort = process.env.REDIS_PORT || 6379;

class Cache {
  constructor({ redisClient } = {}) {
    this.redisClient = redisClient || redis.createClient(redisPort, redisHost);
    // Async proxy for redis
    return new Proxy(this, {
      get: (target, key) => {
        if (Object.prototype.hasOwnProperty.call(target, key)) {
          return target[key];
        }
        const method = Reflect.get(target.redisClient, key);
        if (typeof method === "function") {
          return promisify(method).bind(target.redisClient);
        } else {
          return method;
        }
      },
    });
  }
}

export default Cache;
