import { createContext, useContext } from "react";
import { withApollo as nextApollo } from "next-apollo";
import {
  ApolloClient,
  createHttpLink,
  gql,
  InMemoryCache,
  useQuery,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import JsCookie from "js-cookie";

export const apiUrl =
  typeof window === "undefined"
    ? // server
      "http://backend:1337"
    : // client
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

const httpLink = createHttpLink({
  uri: `${apiUrl}/graphql`,
});

const authLink = setContext((_, { headers }) => {
  const jwt = JsCookie.get("jwt");
  console.log('authLink', jwt);
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

export const withApollo = nextApollo(
  new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  })
);

export const withApolloAndUser = (params) => {
  return (Component) => {
    const wrapper = (props) => {
      const { user, setUser } = useContext(UserContext);
      useQuery(
        gql`
          {
            me {
              id
              email
            }
          }
        `,
        {
          onCompleted: (data) => {
            setUser(data.me);
          },
          skip: !!user || !JsCookie.get("jwt"),
          ssr: false,
        }
      );
      return <Component {...props} />;
    };

    if (process.env.NODE_ENV !== "production") {
      const name = Component.displayName || Component.name || "Component";
      wrapper.displayName = `withApolloAndUser(${name})`;
    }

    if (Component.getInitialProps) {
      wrapper.getInitialProps = async (ctx) => {
        return await Component.getInitialProps(ctx);
      };
    }
    return withApollo(params)(wrapper);
  };
};

export const UserContext = createContext({
  alert: null,
  alertUser: () => {},
  loginUser: () => {},
  logoutUser: () => {},
  setAlert: () => {},
  setUser: () => {},
  user: null,
});
