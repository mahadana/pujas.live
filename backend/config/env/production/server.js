module.exports = ({ env }) => ({
  frontendUrl: env("FRONTEND_URL", "https://pujas.live"),
});
