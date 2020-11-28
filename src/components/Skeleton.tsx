import { Box, SkeletonCircle, SkeletonText } from "@chakra-ui/react";
import React from "react";

const SkeletonContainer = () => (
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

export default SkeletonContainer;
