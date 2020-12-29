"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const yup = require("yup");

const isEmail = (x) => yup.string().required().email().isValidSync(x);
const isString = (x) => yup.string().required().isValidSync(x);

module.exports = {
  async message(ctx) {
    const { id } = ctx.params;
    const { name, email, message } = ctx.request.body;

    const group = await strapi.services.group.findOne({ id });
    const toEmail = group?.owner?.email;

    if (
      !isEmail(toEmail) ||
      !isString(name) ||
      !isEmail(email) ||
      !isString(message)
    ) {
      return { ok: false };
    }

    const frontendUrl = strapi.config.get("server.frontendUrl");
    const text = `${message}

---
The above message originated from ${name} <${email}> on ${frontendUrl}/
directed to the owner of the group "${group.name}".
To update this group, please visit ${frontendUrl}/groups/${id}/edit .
`;

    await strapi.plugins["email"].services.email.send({
      to: toEmail,
      from: "no-reply@pujas.live",
      fromName: 'Pujas.live',
      replyTo: `"${name}" <${email}>`,
      subject: `[Pujas.live] Message from ${name}`,
      text,
    });

    return { ok: true };
  },
};
