import {
  VStack,
  Image,
  Heading,
  Center,
  Box,
  Text,
  AspectRatio,
} from "@chakra-ui/react";
import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "urql";
import PostContent from "./PostContent";

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
`;

interface ParamType {
  id: string;
}

const Post = () => {
  const { id } = useParams<ParamType>();

  const [result] = useQuery({
    query: GetPost,
    variables: { id: parseInt(id) },
  });

  if (result.fetching) return <div>Loading...</div>;

  return (
    <>
      {result.data?.posts?.map(
        ({ title, subtitle, post_items, image }: any, idx: number) => {
          console.log("image", image);
          return (
            <Box key={idx} m="auto" mt={20} w="80%" textAlign="left">
              <VStack spacing={7} align="start">
                {image && (
                  <Center w="100%">
                    <AspectRatio ratio={16 / 9} w={["80%", "80%", "60%"]}>
                      <Image src={image} />
                    </AspectRatio>
                  </Center>
                )}

                <Heading>{title}</Heading>
                <Text>{subtitle}</Text>
                {post_items.length > 0 &&
                  post_items.map((item: any, idx: number) => (
                    <PostContent key={item} itemId={item} />
                  ))}
              </VStack>
            </Box>
          );
        }
      )}
    </>
  );
};

export default Post;
