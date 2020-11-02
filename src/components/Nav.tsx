import { useAuth0 } from "@auth0/auth0-react";
import { Box, Button, useColorMode } from "@chakra-ui/core";
import React from "react";

const Nav = () => {
  const { loginWithRedirect, isAuthenticated, logout } = useAuth0();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box pos="fixed" bottom="0" w="100%" bg="purple.400">
      {isAuthenticated ? (
        <Button
          m={3}
          onClick={() => logout({ returnTo: window.location.origin })}
        >
          Logout
        </Button>
      ) : (
        <Button m={3} onClick={loginWithRedirect}>
          Login
        </Button>
      )}
      <Button onClick={toggleColorMode}>
        Toggle {colorMode === "light" ? "Dark" : "Light"}
      </Button>
    </Box>
  );
};

export default Nav;
