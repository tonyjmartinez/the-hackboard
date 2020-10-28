import React, { createContext, useState, useEffect } from "react";
import "./App.css";
import { useAuth0 } from "@auth0/auth0-react";
import { createClient, Provider } from "urql";
import Todos from "./components/Todos";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return <button onClick={() => loginWithRedirect()}>Log In</button>;
};

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button onClick={() => logout({ returnTo: window.location.origin })}>
      Log Out
    </button>
  );
};

const App = () => {
  const [show, setShow] = useState(false);
  const [token, setToken] = useState("");

  const {
    user,
    isAuthenticated,
    isLoading,
    getAccessTokenSilently,
    getIdTokenClaims,
  } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      const getToken = async () => {
        // const accessToken = await getAccessTokenSilently({
        //   audience: `https://the-hackboard.us.auth0.com/api/v2/`,
        //   scope: "read:current_user",
        // });
        const accessToken = await getAccessTokenSilently();
        console.log("token", accessToken);
        setToken(accessToken);
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
      // const token = getToken();
      return {
        headers: { authorization: token ? `Bearer ${token}` : "" },
      };
    },
  });

  return (
    <Provider value={client}>
      <div>
        <LoginButton />
        <LogoutButton />
        <button onClick={() => setShow(!show)}>click</button>
        {show && <Todos />}
      </div>
    </Provider>
  );
};

export default App;
