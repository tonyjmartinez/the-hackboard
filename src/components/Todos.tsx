import React from "react";
import { useQuery } from "urql";
const TodosQuery = `
  query {
    posts {
      title
    }
  }
`;

const Todos = () => {
  const [result] = useQuery({
    query: TodosQuery,
  });
  console.log("result?", result);
  const { data, fetching, error } = result;
  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;
  return <div>{JSON.stringify(data)}</div>;
};

export default Todos;
