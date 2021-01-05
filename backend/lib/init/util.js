const getOne = async (params, modelName, plugin) => {
  const model = await strapi.query(modelName, plugin).findOne(params);
  if (model) {
    return model;
  } else {
    throw new Error(`Cannot find ${modelName} ${JSON.stringify(params)}`);
  }
};

module.exports = {
  getOne,
};
