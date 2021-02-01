export const plausibleDomainKey = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN_KEY;
export const plausibleUrl = process.env.NEXT_PUBLIC_PLAUSIBLE_URL;

const plausible = (eventName, options) => {
  if (typeof window !== "undefined" && window.plausible) {
    window.plausible(eventName, options);
  }
};

export default plausible;
