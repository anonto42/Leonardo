import { Worker } from "bullmq";
import { redisConnection } from "./app/modules/Queue/redis";
import mongoose from "mongoose";
import config from "./config";
import workerFunction from "./app/modules/Queue/function";

;( async () => {
    const db = await mongoose.connect(`mongodb://localhost:${config.database_port}/${config.database_name}`);
    console.log("DB Connected on the BollMQ worker on:--> ",db.connection.host)
})()

const worker = new Worker(
  "task-queue",
  workerFunction,
  { connection: redisConnection }
);

worker.on("completed", (job) => {
  console.log(`🎉 Job ${job.id} finished`);
});

worker.on("failed", (job, err) => {
  console.log(`❌ Job ${job?.id} failed: ${err.message}`);
});