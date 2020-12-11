import React, { useState, useEffect, lazy, Suspense } from "react";
import "./App.css";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { createClient, Provider } from "urql";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme/theme";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const NewPost = lazy(() => import("./components/NewPost"));
const Post = lazy(() => import("./components/Post"));
const Page = lazy(() => import("./components/Page"));
const Nav = lazy(() => import("./components/Nav"));

const App = () => {
  const [accessToken, setAccessToken] = useState<string>("");

  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      const getToken = async () => {
        const token = await getAccessTokenSilently();
        setAccessToken(token);
      };

      getToken();
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  const client = createClient({
    url: "https://the-hackboard.herokuapp.com/v1/graphql",
    fetchOptions: () => {
      if (accessToken) {
        return {
          headers: { authorization: `Bearer ${accessToken}` },
        };
      }
      return {};
    },
  });

  return (
    <React.StrictMode>
      <Auth0Provider
        domain={process.env.REACT_APP_AUTH0_DOMAIN ?? ""}
        clientId={process.env.REACT_APP_AUTH0_CLIENT_ID ?? ""}
        redirectUri={window.location.origin}
        audience={process.env.REACT_APP_AUTH0_AUDIENCE}
        scope={process.env.REACT_APP_AUTH0_SCOPE}
      >
        <Provider value={client}>
          <ChakraProvider theme={theme}>
            <Router>
              <Suspense fallback={<div>Loading...</div>}>
                <Switch>
                  <Route component={NewPost} path="/new" />
                  <Route path="/posts/:id" children={<Post />} />
                  <Route component={Page} path="/" />
                </Switch>
                <Nav />
              </Suspense>
            </Router>
          </ChakraProvider>
        </Provider>
      </Auth0Provider>
    </React.StrictMode>
  );
};

export default App;
