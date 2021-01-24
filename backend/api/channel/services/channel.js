"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/services.html#core-services)
 * to customize this service
 */

const { convertRestQueryParams, buildQuery } = require("strapi-utils");

const findSortedByActiveStreams = async (params, populate) => {
  const model = strapi.query("channel").model;
  const filters = convertRestQueryParams(params);
  const published = filters.publicationState !== "preview";
  const activeStreamQuery = (query) => {
    buildQuery({ model, filters })(query);
    query.leftJoin("recordings", function () {
      const on = this.on("channels.activeStream", "=", "recordings.id");
      if (published) {
        this.onNotNull("recordings.published_at");
      }
      return on;
    });
    if (published) {
      query.whereNotNull("channels.published_at");
    }
    query
      .orderByRaw("recordings.live DESC NULLS LAST")
      .orderBy("recordings.startAt", "ASC")
      .orderBy("channels.updated_at", "DESC")
      .orderBy("channels.id", "ASC");
  };

  return (
    await model.query(activeStreamQuery).fetchAll({
      withRelated: populate,
      publicationState: filters.publicationState,
    })
  ).toJSON();
};

module.exports = {
  async find(params = {}, populate) {
    if (params._sort === "_activeStreams") {
      delete params._sort;
      return await findSortedByActiveStreams(params, populate);
    } else {
      params = { _publicationState: "live", ...params };
      return await strapi.query("channel").find(params, populate);
    }
  },
};
