import Queue from "bull";

import { processAutomations } from "@/automate";
import { redisHost, redisPort } from "@/cache";
import { processErrorCheck } from "@/errorcheck";
import logger from "@/logger";

const createQueue = async (name) => {
  console.log(`Creating ${name}...`);
  const options = { redis: { host: redisHost, port: redisPort } };
  const queue = new Queue(name, options);

  // TODO this won't work if we have multiple workers
  const jobs = await queue.getRepeatableJobs();
  for (const job of jobs) {
    console.log(`Removing ${name} job ${job.key}`);
    await queue.removeRepeatableByKey(job.key);
  }
  return queue;
};

const processQueue = (name, queue, work) => {
  console.log(`Processing ${name}...`);
  queue.process(async (job) => {
    logger.info(`Job start ${name} ${job.id}`);
    try {
      await work();
    } catch (error) {
      const message = `Job error ${name} ${job.id}: ${error.message}`;
      logger.error(message);
      console.error(message);
      console.error(error);
    }
    logger.info(`Job end ${name} ${job.id}`);
  });
};

const checkEnvironment = (name, keys, callback) => {
  for (const key of keys) {
    if (!process.env[key]) {
      console.warn(`${key} not defined, not scheduling ${name}`);
      return;
    }
  }
  callback();
};

const setupQueues = async () => {
  const automateQueue = await createQueue("automateQueue");
  const errorCheckQueue = await createQueue("errorCheckQueue");

  checkEnvironment("automateQueue", ["YOUTUBE_API_KEY"], () => {
    automateQueue.add(
      {},
      {
        removeOnComplete: true,
        removeOnFail: true,
        repeat: {
          cron: "* * * * *", // every minute
        },
      }
    );
    processQueue("automateQueue", automateQueue, processAutomations);
  });

  checkEnvironment(
    "errorCheckQueue",
    ["ADMIN_EMAIL", "FRONTEND_URL", "MAIL_FROM_ADDRESS", "MAIL_FROM_NAME"],
    () => {
      errorCheckQueue.add(
        {},
        {
          removeOnComplete: true,
          removeOnFail: true,
          repeat: { cron: "15 11 * * *" }, // 3:15am PST
        }
      );
      processQueue("errorCheckQueue", errorCheckQueue, processErrorCheck);
    }
  );
};

setupQueues().catch(console.error);
