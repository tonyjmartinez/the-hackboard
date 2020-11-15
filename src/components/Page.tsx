import React from "react";
import Card, { CardProps } from "./Card";
import { useQuery } from "urql";
import { Box, VStack } from "@chakra-ui/react";

const GetPosts = `
  query MyQuery {
    posts {
      id
      post_items
      title
      subtitle
      created_at
    }
  }
`;

export interface ItemType {
  title: string;
  subtitle: string;
  id?: number;
  created_at?: any;
}

const Page = () => {
  const [result] = useQuery({ query: GetPosts });
  return (
    <Box pb={6} pt={3}>
      <VStack spacing={7}>
        {result.data?.posts.map((item: ItemType, idx: number) => {
          const { title, subtitle, id, created_at } = item;
          return (
            <Card
              title={title}
              subtitle={subtitle}
              key={id}
              createdAt={created_at}
            />
          );
        })}
      </VStack>
    </Box>
  );
};

export default Page;
