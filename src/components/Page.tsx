import React from "react";
import Card from "./Card";
import { Box, VStack } from "@chakra-ui/core";

const Page = () => {
  return (
    <Box pb={6} pt={3}>
      <VStack spacing={7}>
        <Card />
        <Card />
        <Card />
      </VStack>
    </Box>
  );
};

export default Page;
