const bootstrap = require("../bootstrap");
const { applyFakeChannels } = require("./channel");
const { applyFakeGroups } = require("./group");
const { applyFakeImages } = require("./image");
const { applyFakeMonasteries } = require("./monastery");
const { applyFakeRecordings } = require("./recording");

const applyFakes = async () => {
  await applyFakeImages();
  await applyFakeChannels();
  await applyFakeGroups();
  await applyFakeMonasteries();
  await applyFakeRecordings();
};

module.exports = {
  applyFakes,
};

if (require.main === module) {
  bootstrap(applyFakes);
}
