import {
  VStack,
  Image,
  Heading,
  Center,
  Box,
  Text,
  AspectRatio,
} from '@chakra-ui/react'
import React from 'react'
import {useParams} from 'react-router-dom'
import {useQuery} from 'react-query'
import PostContent from './PostContent'

const GetPost = `
  query MyQuery($id: Int) {
    posts(where: {id: {_eq: $id}}) {
      id
      post_items
      created_at
      subtitle
      title
      image
    }
  }
`

interface ParamType {
  id: string
}

const Post = () => {
  const {id} = useParams<ParamType>()

  const {data, isFetching, error, status} = useQuery<any | undefined>([
    GetPost,
    {
      id: parseInt(id),
    },
  ])

  if (isFetching || !data) return <div>Loading...</div>

  return (
    <Box maxW="675px" m="auto">
      {data?.posts?.map(
        ({title, subtitle, post_items, image}: any, idx: number) => {
          return (
            <Box key={idx} m="auto" mt={20}  textAlign="left">
              <VStack spacing={7} align="start">
              <Box w="100%" textAlign="center">
                {image && (
                  <Center w="100%">
                    <AspectRatio ratio={16 / 9} w={['80%', '80%', '60%']}>
                      <Image src={image} />
                    </AspectRatio>
                  </Center>
                )}
                <Heading size="2xl" mb={6}>{title}</Heading>
                <Heading size="md">{subtitle}</Heading>
              </Box>
                {post_items.length > 0 &&
                  post_items.map((item: any, idx: number) => (
                    <PostContent key={item} itemId={item} />
                  ))}
              </VStack>
            </Box>
          )
        },
      )}
    </Box>
  )
}

export default Post
