import { withApollo as nextApollo } from "next-apollo";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { createUploadLink } from "apollo-upload-client";
import JsCookie from "js-cookie";

export const backendUrl =
  typeof window === "undefined"
    ? // server
      "http://backend:1337"
    : // client
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337";

const httpLink = createUploadLink({
  uri: `${backendUrl}/graphql`,
});

const authLink = setContext((_, { headers }) => {
  const jwt = JsCookie.get("jwt");
  if (jwt) {
    return {
      headers: {
        ...headers,
        Authorization: `Bearer ${jwt}`,
      },
    };
  } else {
    return { headers };
  }
});

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

export const withApollo = nextApollo(apolloClient);
