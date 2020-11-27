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
  useTheme,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { FiSun, FiMoon, FiPlusCircle } from "react-icons/fi";
import { Link } from "react-router-dom";

const Nav = () => {
  const { loginWithRedirect, isAuthenticated, logout } = useAuth0();
  const { colorMode, toggleColorMode } = useColorMode();
  const isLight = colorMode === "light";

  const theme = useTheme();
  const darkBlue = useColorModeValue("gray", theme.colors.blue[800]);

  const buttonIconColor = useColorModeValue("cyan", "teal");
  const iconColor = useColorModeValue("white", darkBlue);

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
                  colorScheme={buttonIconColor}
                  aria-label="new post"
                  variant="solid"
                  icon={<FiPlusCircle size={40} color={iconColor} />}
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
            colorScheme={buttonIconColor}
            aria-label="Dark Mode toggle"
            icon={
              isLight ? (
                <FiMoon size={40} color={iconColor} />
              ) : (
                <FiSun size={40} color={iconColor} />
              )
            }
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default Nav;
