export const plausibleDomain =
  process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || "localhost:3000";

const plausible = (eventName, options) => {
  if (typeof window !== "undefined" && window.plausible) {
    window.plausible(eventName, options);
  }
};

export default plausible;
