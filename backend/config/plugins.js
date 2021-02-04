module.exports = ({ env }) => {
  const config = {
    email: {
      provider: env("MAIL_PROVIDER", "nodemailer"),
      providerOptions: {
        host: env("MAIL_HOST", "mail"),
        port: env.int("MAIL_PORT", 25),
      },
      settings: {
        defaultFrom: {
          address: env("MAIL_FROM_ADDRESS", "contact@pujas.live"),
          name: env("MAIL_FROM_NAME", "Pujas.live"),
        },
      },
    },
  };
  // Disabled due to not working with large files on Linode.
  // https://github.com/strapi/strapi/issues/8449
  /*
  if (env("S3_ACCESS_KEY_ID") && env("S3_SECRET_ACCESS_KEY")) {
    config.upload = {
      provider: "s3",
      providerOptions: {
        accessKeyId: env("S3_ACCESS_KEY_ID"),
        secretAccessKey: env("S3_SECRET_ACCESS_KEY"),
        endpoint: env("S3_ENDPOINT"),
        params: {
          Bucket: env("S3_BUCKET"),
        },
        pathPrefix: "uploads/",
      },
    };
  }
  */
  return config;
};
