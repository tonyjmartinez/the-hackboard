import React, { useState, useEffect, lazy, Suspense } from "react";
import "./App.css";
import { useAuth0 } from "@auth0/auth0-react";
import { createClient, Provider } from "urql";
import Nav from "./components/Nav";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme/theme";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const NewPost = lazy(() => import("./components/NewPost"));
const Post = lazy(() => import("./components/Post"));
const Page = lazy(() => import("./components/Page"));

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
  );
};

export default App;
