import React from 'react'
import {BoxProps, Box} from '@chakra-ui/react'

const BodyLayout = ({children, ...rest}: BoxProps) => {
  return (
    <Box w="100%" h="100vh" {...rest}>
      {children}
    </Box>
  )
}

export default BodyLayout
