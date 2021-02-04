import { useRouter } from "next/router";

import { dayjs } from "shared/time";

export const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Pujas.live";

export const useRouteBack = (router) => {
  if (!router) {
    router = useRouter();
  }
  return {
    get: (path) =>
      path +
      (router.asPath ? "?back=" + encodeURIComponent(router.asPath) : ""),
    push: (path = "/") => router.push(router.query?.back || path),
  };
};

export const getStrapiError = (error) => {
  return error?.graphQLErrors?.[0]?.extensions?.exception?.data?.data?.[0]
    ?.messages?.[0];
};

const IS_ACTIVE_RECORDING_WINDOW = 5; // minutes

export const isActiveRecording = (recording, now = null) => {
  if (!now) now = dayjs().utc();
  if (!recording.live || !recording.startAt) {
    return false;
  } else {
    const startAt = dayjs(recording.startAt).utc();
    return !now.isAfter(startAt.add(IS_ACTIVE_RECORDING_WINDOW, "minute"));
  }
};

export const translateStrapiError = (error) => {
  const strapiError = getStrapiError(error);
  if (strapiError?.id === "Auth.form.error.invalid") {
    return "Incorrect email or password";
  } else if (error?.message === "Forbidden") {
    return "You are not logged in";
  } else if (strapiError?.message) {
    return strapiError.message;
  } else if (error?.message) {
    return error.message;
  } else {
    return "Unknown server error";
  }
};

export const sleep = (time) =>
  new Promise((resolve) => setTimeout(resolve, time));
