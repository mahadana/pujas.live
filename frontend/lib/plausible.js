export const plausibleDomainKey = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN_KEY;
export const plausibleUrl = process.env.NEXT_PUBLIC_PLAUSIBLE_URL;

if (!plausibleDomainKey) {
  throw new Error(`NEXT_PUBLIC_PLAUSIBLE_DOMAIN_KEY is not defined`);
} else if (!plausibleUrl) {
  throw new Error(`NEXT_PUBLIC_PLAUSIBLE_URL is not defined`);
}

const plausible = (eventName, options) => {
  if (typeof window !== "undefined") {
    window?.plausible?.(eventName, options);
  }
};

export default plausible;
