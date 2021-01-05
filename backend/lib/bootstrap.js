const { dirname } = require("path");
const Strapi = require("strapi");

const bootstrap = (callback) => {
  const rootDir = dirname(__dirname);
  process.chdir(rootDir);
  Strapi({ dir: rootDir })
    .load()
    .then(callback)
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
};

module.exports = bootstrap;
