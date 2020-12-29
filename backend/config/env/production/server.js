module.exports = ({ env }) => ({
  frontendUrl: env("FRONTEND_URL", "https://neo.pujas.live"),
});
