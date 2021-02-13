"use strict";

// Based on https://github.com/strapi/strapi/tree/master/packages/strapi-provider-upload-aws-s3

/**
 * Module dependencies
 */

/* eslint-disable no-unused-vars */
// Public node modules.
const _ = require("lodash");
const AWS = require("aws-sdk");

const { Readable } = require("stream");

/**
 * @param binary Buffer
 * returns readableInstanceStream Readable
 */
function bufferToStream(binary) {
  const readableInstanceStream = new Readable({
    read() {
      this.push(binary);
      this.push(null);
    },
  });

  return readableInstanceStream;
}

module.exports = {
  init({ pathPrefix = "", ...config }) {
    const S3 = new AWS.S3({
      apiVersion: "2006-03-01",
      ...config,
    });

    return {
      upload(file, customParams = {}) {
        return new Promise((resolve, reject) => {
          // upload file on S3 bucket
          let path = pathPrefix;
          path += file.path ? `${file.path}/` : "";

          const stream = bufferToStream(file.buffer);

          S3.upload(
            {
              Key: `${path}${file.hash}${file.ext}`,
              Body: stream,
              // Body: Buffer.from(file.buffer, "binary"),
              ACL: "public-read",
              ContentType: file.mime,
              ...customParams,
            },
            (err, data) => {
              if (err) {
                return reject(err);
              }

              // set the bucket file url
              file.url = data.Location;

              resolve();
            }
          );
        });
      },
      delete(file, customParams = {}) {
        return new Promise((resolve, reject) => {
          // delete file on S3 bucket
          let path = pathPrefix;
          path = file.path ? `${file.path}/` : "";
          S3.deleteObject(
            {
              Key: `${path}${file.hash}${file.ext}`,
              ...customParams,
            },
            (err, data) => {
              if (err) {
                return reject(err);
              }

              resolve();
            }
          );
        });
      },
    };
  },
};
