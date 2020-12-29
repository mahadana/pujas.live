module.exports = ({ env }) => ({
  frontendUrl: env("FRONTEND_URL", "http://localhost:3000"),
});
