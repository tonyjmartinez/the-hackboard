import React from "react";
import Card from "./Card";
import { useQuery } from "urql";
import { Box, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const GetPosts = `
  query MyQuery {
    posts(order_by: {created_at: desc}) {
      id
      post_items
      title
      subtitle
      created_at
      image
    }
  }
`;

export interface ItemType {
  title: string;
  subtitle: string;
  id?: number;
  created_at?: any;
  image?: string;
}

const Page = () => {
  const [result] = useQuery({ query: GetPosts });
  return (
    <Box pb={6} pt={3}>
      <VStack spacing={7}>
        {result.data?.posts.map((item: ItemType, idx: number) => {
          const { title, subtitle, id, image, created_at } = item;
          console.log("item", item);
          return (
            <Link to={`/posts/${id}`} key={idx}>
              <Card
                title={title}
                subtitle={subtitle}
                key={id}
                createdAt={created_at}
                imageUrl={image ? image : undefined}
              />
            </Link>
          );
        })}
      </VStack>
    </Box>
  );
};

export default Page;
