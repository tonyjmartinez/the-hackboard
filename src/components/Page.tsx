import React, { lazy } from "react";
import { useQuery } from "urql";
import { Box, useMediaQuery } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Skeleton from "./Skeleton";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

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
  const [sm, md, lg] = useMediaQuery([
    "(min-width: 0em)",
    "(min-width: 30em)",
    "(min-width: 80em)",
  ]);

  let cardHeight = 200;
  if (lg) {
    cardHeight = 700;
  } else if (md) {
    cardHeight = 450;
  } else if (sm) {
    cardHeight = 350;
  }

  if (!(result.data?.posts.length > 0)) {
    return <Skeleton />;
  }

  const posts = result.data?.posts;

  const Row = ({ index, style }: any) => {
    if (!posts || !posts[index]) return null;
    const { title, subtitle, id, image, created_at } = posts[index];
    console.log("index", index);

    return (
      <Box sx={{ style }} mt={index === 0 ? 24 : 0}>
        <Box w={["90%", "70%", "40%"]} margin="0px auto" marginY={6} key={id}>
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
      </Box>
    );
  };

  return (
    <AutoSizer>
      {({ height, width }) => (
        <List
          height={height}
          itemCount={posts.length}
          itemSize={cardHeight}
          width={width}
        >
          {Row}
        </List>
      )}
    </AutoSizer>
  );
};

export default Page;
