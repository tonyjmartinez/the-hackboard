import React from "react";
import { useQuery } from "urql";
import { ItemTypes } from "../util/enums";
import { Text, Image } from "@chakra-ui/react";
import Skeleton from "./Skeleton";

export const GetItem = `
  query MyQuery($id: Int) {
    items(where: {id: {_eq: $id}}) {
      id
      type
      value
    }
  }
`;

export type PostContentProps = {
  itemId: number;
};
const PostContent = ({ itemId }: PostContentProps) => {
  const [result] = useQuery({ query: GetItem, variables: { id: itemId } });
  console.log("res", result);

  if (result.fetching || !result.data) {
    return <Skeleton />;
  }
  console.log("result", result);
  const { type, value } = result.data?.items[0];
  console.log("result", result);

  // return <div>{result.data?.items[0].value}</div>;
  switch (type) {
    case ItemTypes.Text:
      return <Text>{value}</Text>;
    case ItemTypes.Image:
      return <Image src={value} />;
    default:
      return <Text>Oops</Text>;
  }
};

export default PostContent;
