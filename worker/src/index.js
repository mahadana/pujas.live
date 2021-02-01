import Queue from "bull";
import dotenv from "dotenv";

import { processAutomations } from "./automate";
import logger from "./logger";

dotenv.config();

const setupQueues = async () => {
  const queueOptions = { redis: { host: "redis" } };
  const automateQueue = new Queue("automateQueue", queueOptions);

  const jobs = await automateQueue.getRepeatableJobs();
  jobs.forEach((job) => {
    automateQueue.removeRepeatableByKey(job.key);
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
    logger.info(`Start automateQueue job ${job.id}`);
    try {
      await processAutomations();
    } catch (error) {
      logger.error(error.message);
      console.error(error);
    }
    logger.info(`End automateQueue job ${job.id}`);
  });
};

setupQueues().catch(console.error);
