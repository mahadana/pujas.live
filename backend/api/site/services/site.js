"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */

const yup = require("yup");

const {
  emailSchema,
  encodeAddress,
  encodeMailto,
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

    const frontendUrl = strapi.config.get("server.frontendUrl");
    const from = { name: params.name, address: params.email };

    await strapi.plugins["email"].services.email.sendTemplatedEmail(
      {
        from: {
          name: strapi.config.get("plugins.email.settings.defaultFromName"),
          address: strapi.config.get("plugins.email.settings.defaultFrom"),
        },
        replyTo: from,
        to: strapi.config.get("server.admin.auth.email"),
      },
      {
        subject: "[Pujas.live] Message from ${name}",
        text: await getEmailTemplate("site-message.txt"),
        html: await getEmailTemplate("site-message.html"),
      },
      {
        ...params,
        address: encodeAddress(from),
        aboutUrl: `${frontendUrl}/about`,
        mailto: encodeMailto({ to: from }),
      }
    );
  },
};
