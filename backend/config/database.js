module.exports = ({ env }) => ({
  defaultConnection: "default",
  connections: {
    default: {
      connector: "bookshelf",
      settings: {
        client: "postgres",
        host: env("DATABASE_HOST", "db"),
        port: env.int("DATABASE_PORT", 5432),
        database: env("DATABASE_NAME", "strapi"),
        username: env("DATABASE_USER", "strapi"),
        password: env("DATABASE_PASSWORD", "strapi"),
        schema: "public",
      },
      options: {
        // debug: true,
        useNullAsDefault: true,
      },
    },
  },
});
