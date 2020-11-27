import React, { lazy } from "react";
import { useQuery } from "urql";
import { Box, SkeletonCircle, SkeletonText } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Card = lazy(() => import("./Card"));

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
  console.log("result", result);
  if (!(result.data?.posts.length > 0)) {
    return (
      <Box
        padding="6"
        boxShadow="lg"
        bg="blue.100"
        w={["80%", "80%", "40%"]}
        m="auto"
        mb={6}
        mt={12}
      >
        <SkeletonCircle size="10" />
        <SkeletonText mt="4" noOfLines={4} spacing="4" />
      </Box>
    );
  }

  return (
    <Box pb={6} pt={3}>
      {result.data?.posts.map((item: ItemType, idx: number) => {
        const { title, subtitle, id, image, created_at } = item;
        console.log("item", item);
        return (
          <Box w={["80%", "80%", "40%"]} m="auto" marginY={6} key={id}>
            <Link to={`/posts/${id}`}>
              <Card
                title={title}
                subtitle={subtitle}
                key={id}
                createdAt={created_at}
                imageUrl={image ? image : undefined}
              />
            </Link>
          </Box>
        );
      })}
    </Box>
  );
};

export default Page;
