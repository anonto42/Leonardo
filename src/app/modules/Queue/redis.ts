import { RedisOptions } from "ioredis";
import config from "../../../config";

export const redisConnection: RedisOptions = {
    host: config.redis.redis_ip,
    port: Number(config.redis.redis_port!)
};