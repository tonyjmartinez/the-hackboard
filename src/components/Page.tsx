import React, { lazy } from "react";
import { useQuery } from "urql";
import { Box } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Skeleton from "./Skeleton";

const Card = lazy(() => import("./Card"));

const GetPosts = `
  query MyQuery @cached {
    posts(order_by: {created_at: desc}) {
      id
      post_items
      title
      subtitle
      created_at
      image
      is_public
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
    return <Skeleton />;
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
