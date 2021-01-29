const fs = require("fs");
const path = require("path");
const yup = require("yup");

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
  getEmailTemplate,
  passwordSchema,
  requiredStringSchema,
  stringSchema,
};
