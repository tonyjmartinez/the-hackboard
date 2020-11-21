import React from "react";
import { useQuery } from "urql";

export const GetItem = `
  query MyQuery($id: Int) {
    items(where: {id: {_eq: $id}}) {
      id
      type
      value
    }
  }
`;

export type TextContentProps = {
  itemId: number;
};
const TextContent = ({ itemId }: TextContentProps) => {
  const [result] = useQuery({ query: GetItem, variables: { id: itemId } });
  console.log("result", result);
  return <div>{result.data?.items[0].value}</div>;
};

export default TextContent;
