const fs = require("fs");
const _ = require("lodash");
const path = require("path");
const URI = require("uri-js");
const yup = require("yup");

const encodeAddress = (address) => {
  if (_.isObject(address)) {
    if (address.name) {
      let name = address.name.replace(/"/g, '\\"');
      if (name.match(/["<>]/)) {
        name = `"${name}"`;
      }
      return `${name} <${address.address}>`;
    } else {
      return address.address;
    }
  } else {
    return address;
  }
};

const encodeMailto = ({ to, ...props }) =>
  URI.serialize({
    ...props,
    scheme: "mailto",
    to: _.castArray(to).map((address) => encodeAddress(address)),
  });

const getEmailTemplate = async (fileName) => {
  try {
    return await fs.promises.readFile(
      path.join(__dirname, "..", "email", fileName)
    );
  } catch {
    return null;
  }
};

const stringSchema = yup.string().ensure();
const requiredStringSchema = stringSchema.required("Required");
const emailSchema = requiredStringSchema.email("Invalid email address");
const passwordSchema = requiredStringSchema.min(
  6,
  "Should at least 6 characters"
);

module.exports = {
  emailSchema,
  encodeAddress,
  encodeMailto,
  getEmailTemplate,
  passwordSchema,
  requiredStringSchema,
  stringSchema,
};
