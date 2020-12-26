import { listTimeZones } from "timezone-support";

export const getChannelIdFromChannelUrl = (url) => {
  const urlObject = new URL(url);
  return urlObject.pathname.split("/").pop(); //searchParams.get("")
};

export const getBackFromQuery = (query, defaultPath = "/") => {
  return (query || {}).back || defaultPath;
};

export const getPushBackUrl = (router, path) =>
  path + (router.asPath ? "?back=" + encodeURIComponent(router.asPath) : "");

export const pushBack = (router, defaultPath = "/") => {
  router.push(getBackFromQuery(router.query, defaultPath));
};

export const getStrapiError = (error) => {
  return error?.graphQLErrors?.[0]?.extensions?.exception?.data?.data?.[0]
    ?.messages?.[0];
};

export const translateStrapiError = (error) => {
  const strapiError = getStrapiError(error);
  if (strapiError?.id === "Auth.form.error.invalid") {
    return "Incorrect email or password";
  } else if (error?.message === "Forbidden") {
    return "You are not logged in";
  } else if (strapiError?.message) {
    return strapiError.message;
  } else {
    return "Unknown server error";
  }
};

export const TIMEZONES = listTimeZones();

export const getLocalTimeZone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "Etc/UTC";
  }
};
