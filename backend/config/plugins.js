module.exports = ({ env }) => {
  const provider = env("MAIL_PROVIDER", "mailtrap");
  let providerOptions;
  if (provider === "mailjet") {
    providerOptions = {
      publicApiKey: env("MAILJET_PUBLIC_KEY"),
      secretApiKey: env("MAILJET_SECRET_KEY"),
    };
  } else {
    providerOptions = {
      user: env("MAILTRAP_USER"),
      password: env("MAILTRAP_PASSWORD"),
    };
  }
  return {
    email: {
      provider,
      providerOptions,
      settings: {
        defaultFrom: env("MAIL_DEFAULT_FROM", "contact@pujas.live"),
        defaultFromName: "Pujas.live",
      },
    },
  };
};
