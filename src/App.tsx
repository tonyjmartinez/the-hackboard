import React, { useState, useEffect } from "react";
import "./App.css";
import { useAuth0 } from "@auth0/auth0-react";
import { createClient, Provider } from "urql";
import Todos from "./components/Todos";
import Nav from "./components/Nav";
import { Button } from "@chakra-ui/core";

const App = () => {
  const [show, setShow] = useState(false);
  const [accessToken, setAccessToken] = useState<string>("");

  const {
    user,
    isAuthenticated,
    isLoading,
    getAccessTokenSilently,
    getIdTokenClaims,
  } = useAuth0();
  console.log("is auth?", isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      const getToken = async () => {
        const token = await getAccessTokenSilently();
        console.log("token", token);
        setAccessToken(token);
      };

      getToken();
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  const client = createClient({
    url: "https://the-hackboard.herokuapp.com/v1/graphql",
    fetchOptions: () => {
      return {
        headers: { authorization: accessToken ? `Bearer ${accessToken}` : "" },
      };
    },
  });

  return (
    <Provider value={client}>
      <div>
        <Button onClick={() => setShow(!show)}>click</Button>
        {show && <Todos />}
      </div>
      <Nav />
    </Provider>
  );
};

export default App;
