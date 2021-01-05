import Queue from "bull";
import dotenv from "dotenv";

import { processAutomations } from "./automate";

dotenv.config();

const setupQueues = async () => {
  const queueOptions = { redis: { host: "redis" } };
  const automateQueue = new Queue("automateQueue", queueOptions);

  const jobs = await automateQueue.getRepeatableJobs();
  jobs.forEach((job) => {
    automateQueue.removeRepeatableByKey(job.key);
    console.log(`Removed repeatable job ${job.key}`);
  });

  if (process.env.YOUTUBE_API_KEY) {
    automateQueue.add(
      {},
      {
        repeat: {
          every: 60 * 1000, // 60 seconds
        },
      }
    );
  } else {
    console.warn(
      "YOUTUBE_API_KEY not defined in worker/.env" +
        ", not scheduling automateQueue"
    );
    return;
  }

  automateQueue.process(async (job) => {
    console.log(`Start automateQueue job ${job.id}`);
    try {
      await processAutomations();
    } catch (error) {
      console.error(error);
    }
    console.log(`End automateQueue job ${job.id}`);
  });
};

setupQueues().then().catch(console.error);
