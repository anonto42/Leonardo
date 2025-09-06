import { Worker } from "bullmq";
import { redisConnection } from "./app/modules/Queue/redis";
import workerFunction from "./app/modules/Queue/function";

const worker = new Worker(
    "task-queue",
    workerFunction,
    { connection: redisConnection }
);

worker.on("completed", ( job ) => {
    console.log(`🎉 Job ${job.id} finished`)
});

worker.on("failed", ( job, err) => {
    console.log(`❌ Job ${job?.id} failed: ${err.message}`)
});