import { Box, Center, Icon, SimpleGrid, useColorModeValue, useTheme, VStack, Text} from '@chakra-ui/react';
import React from 'react';
import { FiEdit, FiImage, FiFileText, FiCode } from 'react-icons/fi';
import { ItemTypes } from 'util/enums';

type PostItemBtnProps = {
  text?: string
  icon?: any
  onClick?: () => void
}

const PostItemBtn = ({text, icon, onClick}: PostItemBtnProps) => {
  const iconColor = useColorModeValue('black', 'blue.500')
  const boxColor = useColorModeValue('gray.100', 'blue.900')
  const theme = useTheme()
  const shadowColor = useColorModeValue('gray', theme.colors.blue[500])
  return (
    <Box
      bg={boxColor}
      height="160px"
      _hover={{border: `10px solid ${shadowColor}`}}
      cursor="pointer"
      onClick={onClick}
    >
      <Center h="100%">
        <VStack>
          <Icon color={iconColor} as={icon} boxSize={14} />
          <Text>{text}</Text>
        </VStack>
      </Center>
    </Box>
  )
}

export interface NewContentProps {
  setEditing: (itemType: ItemTypes) => void
}

const NewContent = ({setEditing}: NewContentProps) => {
  
  return (
      <SimpleGrid columns={2} spacing={10} mt={6}>
        <PostItemBtn
          text="Text"
          icon={FiEdit}
          onClick={() => setEditing(ItemTypes.Text)}
        />
        <PostItemBtn
          text="Image"
          icon={FiImage}
          onClick={() => setEditing(ItemTypes.Image)}
        />

        <PostItemBtn
          text="Markdown"
          icon={FiFileText}
          onClick={() => setEditing(ItemTypes.Markdown)}
        />
        <PostItemBtn text="Code Snippet" icon={FiCode} />
      </SimpleGrid>
  )
}

export default NewContent