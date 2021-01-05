const fetch = require("cross-fetch");
const { createWriteStream, promises: fs } = require("fs");
const mime = require("mime-types");
const { basename } = require("path");
const tmp = require("tmp");

const mktemp = async (options) => {
  return new Promise((resolve, reject) => {
    tmp.file(options, (error, path, fd, cleanup) => {
      if (error) reject(error);
      resolve([path, fd, cleanup]);
    });
  });
};

const downloadToTemp = async (url) => {
  const result = await fetch(url);
  const [path, fd] = await mktemp();
  const stream = createWriteStream(null, { fd });
  await new Promise((resolve, reject) => {
    result.body.pipe(stream);
    result.body.on("error", reject);
    stream.on("finish", resolve);
  });
  return path;
};

const addFileToUploads = async (path, name) => {
  name = name || basename(path || "file");
  const uploads = await strapi.plugins.upload.services.upload.upload({
    data: [{}],
    files: [
      {
        path,
        name,
        type: mime.lookup(name),
        size: (await fs.stat(path)).size,
      },
    ],
  });
  return uploads[0];
};

const addUrlToUploads = async (url, name = null) => {
  const path = await downloadToTemp(url);
  try {
    return await addFileToUploads(path, name || basename(url));
  } finally {
    await fs.unlink(path);
  }
};

module.exports = {
  downloadToTemp,
  addFileToUploads,
  addUrlToUploads,
};
