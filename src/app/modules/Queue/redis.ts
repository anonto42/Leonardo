import Redis, { RedisOptions } from "ioredis";
import config from "../../../config";

export const redisConnection: RedisOptions = {
    host: config.redis.redis_ip,
    port: Number(config.redis.redis_port!)
};

export const ConnectedRedis = new Redis(redisConnection);

export const RedisDB = {
    set: async (key: string, value: string) => ConnectedRedis.set(key, value),
    get: async (key: string) => ConnectedRedis.get(key)
};