"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async message(ctx) {
    await strapi.services.site.message(ctx.request.body);
    return { ok: true };
  },
};
