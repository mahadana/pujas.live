import { useRouter } from "next/router";

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
