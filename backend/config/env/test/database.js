module.exports = () => ({
  connections: {
    default: {
      settings: {
        client: "sqlite",
        filename: ".tmp/test.db",
      },
      options: {
        pool: {
          min: 0,
          max: 1,
        },
      },
    },
  },
});
