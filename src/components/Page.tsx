import React from "react";
import Card from "./Card";
import { Center, VStack } from "@chakra-ui/core";

const Page = () => {
  return (
    <VStack spacing={7}>
      <Card />
      <Card />
      <Card />
    </VStack>
  );
};

export default Page;
