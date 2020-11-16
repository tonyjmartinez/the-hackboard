import { VStack, Heading, Box, Text } from "@chakra-ui/react";
import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "urql";

const GetPost = `
  query MyQuery($id: Int) {
    posts(where: {id: {_eq: $id}}) {
      id
      post_items
      created_at
      subtitle
      title
    }
  }
`;

interface ParamType {
  id: string;
}

const Post = () => {
  const { id } = useParams<ParamType>();

  const [result] = useQuery({ query: GetPost, variables: { id } });

  if (result.fetching) return <div>Loading...</div>;
  console.log("result", result.data);

  return (
    <VStack>
      {result.data.posts.map(
        ({ title, subtitle, post_items }: any, idx: number) => (
          <Box mt={20} w="60%" textAlign="left">
            <VStack spacing={7} align="start">
              <Heading>{title}</Heading>
              <Text>{subtitle}</Text>
              {post_items.length > 0 &&
                post_items.map((item: any, idx: number) => (
                  <div key={idx}>{JSON.stringify(item)}</div>
                ))}
            </VStack>
          </Box>
        )
      )}
    </VStack>
  );
};

export default Post;
