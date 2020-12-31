import Queue from "bull";
import { processStreams } from "./stream";

const setupQueues = async () => {
  const queueOptions = { redis: { host: "redis" } };
  const processStreamsQueue = new Queue("processStreams", queueOptions);

  const jobs = await processStreamsQueue.getRepeatableJobs();
  jobs.forEach((job) => {
    processStreamsQueue.removeRepeatableByKey(job.key);
    console.log(`Removed repeatable job ${job.key}`);
  });

  processStreamsQueue.add(
    {},
    {
      repeat: {
        every: 60 * 1000, // 60 seconds
      },
    }
  );

  processStreamsQueue.process(async (job) => {
    console.log(`Start processStream job ${job.id}`);
    await processStreams();
    console.log(`End processStream job ${job.id}`);
  });
};

setupQueues().then().catch(console.errro);
