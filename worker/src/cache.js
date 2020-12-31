import redis from "redis";
import { promisify } from "util";

const REDIS_HOST = "redis";
const REDIS_PORT = 6379;

class Cache {
  constructor({ redisClient } = {}) {
    this.redisClient =
      redisClient || redis.createClient(REDIS_PORT, REDIS_HOST);
    // Async proxy for redis
    return new Proxy(this, {
      get: (target, key) => {
        if (target.hasOwnProperty(key)) {
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
