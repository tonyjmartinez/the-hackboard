import { useAuth0 } from "@auth0/auth0-react";
import {
  Flex,
  Heading,
  IconButton,
  Spacer,
  Box,
  Button,
  useColorMode,
  Center,
  Icon,
  useColorModeValue,
} from "@chakra-ui/core";
import React from "react";
import {
  AddIcon,
  MoonIcon,
  PlusSquareIcon,
  SearchIcon,
  SunIcon,
} from "@chakra-ui/icons";
import { Link } from "react-router-dom";

const Nav = () => {
  const { loginWithRedirect, isAuthenticated, logout } = useAuth0();
  const { colorMode, toggleColorMode } = useColorMode();
  const isLight = colorMode === "light";

  const iconColor = useColorModeValue("cyan", "teal");

  return (
    <Box pos="fixed" bottom="0" w="100%">
      <Flex>
        <Center bg="blue.600">
          <Heading size="md" p={3} color="white">
            <Link to="/">The Hackboard</Link>
          </Heading>
        </Center>

        <Spacer />
        <Box p="3" bg="blue.400">
          {isAuthenticated ? (
            <>
              <Link to="/new">
                <IconButton
                  colorScheme={iconColor}
                  aria-label="new post"
                  variant="solid"
                  icon={<AddIcon />}
                />
              </Link>

              <Button
                m={3}
                onClick={() => logout({ returnTo: window.location.origin })}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button m={3} onClick={loginWithRedirect}>
              Login
            </Button>
          )}

          <IconButton
            onClick={toggleColorMode}
            colorScheme={iconColor}
            aria-label="Dark Mode toggle"
            icon={isLight ? <MoonIcon /> : <SunIcon />}
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default Nav;
