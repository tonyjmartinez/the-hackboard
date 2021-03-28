import {useAuth0} from '@auth0/auth0-react'
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
  Tooltip,
  BoxProps,
} from '@chakra-ui/react'
import React from 'react'
import {FiSun, FiMoon, FiPlusCircle} from 'react-icons/fi'
import {Link} from 'react-router-dom'

const Nav = ({...rest}: BoxProps) => {
  const {loginWithRedirect, isAuthenticated, logout} = useAuth0()
  const {colorMode, toggleColorMode} = useColorMode()
  const isLight = colorMode === 'light'

  const theme = useTheme()

  const buttonIconColor = useColorModeValue('cyan', 'teal')
  const iconColor = useColorModeValue('white', theme.colors.blue[800])

  return (
    <>
      <Flex w="100%" pos="fixed" {...rest}>
        <Box bg="gray.600" opacity="0.8">
          <Heading size="md" p={3} color="white">
            <Link to="/">The Hackboard</Link>
          </Heading>
        </Box>
      </Flex>
      <Flex w="100%" pos="fixed" bottom="0" {...rest}>
        <Spacer />
        <Box px={[2, 2, 6]} bg="gray.600" opacity="0.8">
          {isAuthenticated ? (
            <>
              <Link to="/new">
                <Tooltip label="New Post">
                  <IconButton
                    colorScheme={buttonIconColor}
                    aria-label="new post"
                    variant="solid"
                    icon={<FiPlusCircle size={30} color={iconColor} />}
                  />
                </Tooltip>
              </Link>

              <Button
                m={3}
                onClick={() => logout({returnTo: window.location.origin})}
                colorScheme="teal"
              >
                Logout
              </Button>
            </>
          ) : (
            <Button m={3} onClick={loginWithRedirect} colorScheme="teal">
              Login
            </Button>
          )}

          <IconButton
            onClick={toggleColorMode}
            colorScheme={buttonIconColor}
            aria-label="Dark Mode toggle"
            mr={3}
            icon={
              isLight ? (
                <FiMoon size={30} color={iconColor} />
              ) : (
                <FiSun size={30} color={iconColor} />
              )
            }
          />
        </Box>
      </Flex>
    </>
  )
}

export default Nav
