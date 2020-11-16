import React, { useState, useEffect } from "react";
import "./App.css";
import { useAuth0 } from "@auth0/auth0-react";
import { createClient, Provider } from "urql";
import Nav from "./components/Nav";
import { ChakraProvider, Box } from "@chakra-ui/react";
import theme from "./theme/theme";
import Page from "./components/Page";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import NewPost from "./components/NewPost";
import Post from "./components/Post";

const App = () => {
  const [accessToken, setAccessToken] = useState<string>("");

  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();

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
          <Switch>
            <Route path="/new">
              <Box mb={90}>
                <NewPost />
              </Box>
            </Route>
            <Route path="/posts/:id" children={<Post />} />
            <Route path="/">
              <Box mb={90}>
                <Page />
              </Box>
            </Route>
          </Switch>

          {!isLoading && <Nav />}
        </Router>
      </ChakraProvider>
    </Provider>
  );
};

export default App;
