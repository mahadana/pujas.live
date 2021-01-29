"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */

const yup = require("yup");

const {
  emailSchema,
  getEmailTemplate,
  requiredStringSchema,
} = require("../../../lib/util");

const messageSiteSchema = yup.object({
  email: emailSchema,
  message: requiredStringSchema,
  name: requiredStringSchema,
});

module.exports = {
  async message(params) {
    messageSiteSchema.validateSync(params);
    await strapi.plugins["email"].services.email.sendTemplatedEmail(
      {
        from: strapi.config.get("plugins.email.settings.defaultFrom"),
        fromName: strapi.config.get("plugins.email.settings.defaultFromName"),
        replyTo: `"${params.name}" <${params.email}>`,
        to: strapi.config.get("server.admin.auth.email"),
      },
      {
        subject: "[Pujas.live] Message from ${name}",
        text: await getEmailTemplate("site-message.txt"),
        html: await getEmailTemplate("site-message.html"),
      },
      {
        ...params,
        frontendUrl: strapi.config.get("server.frontendUrl"),
      }
    );
  },
};
