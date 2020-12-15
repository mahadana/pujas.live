import Queue from "bull";
import { GraphQLClient, gql } from "graphql-request";

(async () => {
  const queueOptions = { redis: { host: "redis" } };
  const testQueue = new Queue("test", queueOptions);

  const client = new GraphQLClient("http://backend:1337/graphql");

  const jobs = await testQueue.getRepeatableJobs();
  jobs.forEach((job) => {
    testQueue.removeRepeatableByKey(job.key);
    console.log(`Removed repeatable job ${job.key}`);
  });

  testQueue.add(
    {},
    {
      repeat: {
        every: 60000, // 60 seconds
      },
    }
  );

  testQueue.process(async (job) => {
    console.log(`Start job ${job.id}`);
    const result = await client.request(gql`
      {
        streams {
          id
          name
          description
          websiteUrl
          streamUrl
          embeddable
          image {
            url
          }
        }
      }
    `);
    console.log(result);
    console.log(`End job ${job.id}`);
  });
})();
