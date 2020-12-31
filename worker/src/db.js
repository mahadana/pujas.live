import dotenv from "dotenv";
import knex from "knex";

export const init = () => {
  dotenv.config();
  return knex({
    client: "pg",
    connection: {
      host: process.env.DATABASE_HOST || "db",
      port: process.env.DATABASE_PORT || 5432,
      user: process.env.DATABASE_USER || "strapi",
      password: process.env.DATABASE_PASSWORD || "strapi",
      database: process.env.DATABASE_NAME || "strapi",
    },
  });
};

export default {
  init,
};
