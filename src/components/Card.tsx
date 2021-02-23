import React from "react";
import {
  Box,
  Img as Image,
  AspectRatio,
  Badge,
  BoxProps,
} from "@chakra-ui/react";
import moment from "moment";
// Sample card from Airbnb

export interface CardProps extends BoxProps {
  title: string;
  subtitle: string;
  createdAt?: any;
  imageUrl?: string;
}

const Card = ({
  title,
  subtitle,
  createdAt,
  imageUrl = "https://bit.ly/2Z4KKcF",
}: CardProps) => {
  return (
    <Box w="90%" m="auto" borderWidth="1px" borderRadius="lg" overflow="hidden">
      <AspectRatio ratio={16 / 9}>
        <Image src={imageUrl} alt={"post image"} />
      </AspectRatio>

      <Box p="6">
        <Box d="flex" alignItems="baseline">
          <Badge borderRadius="full" px="2" colorScheme="teal">
            New
          </Badge>
          <Box
            color="gray.500"
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize="xs"
            textTransform="uppercase"
            ml="2"
          >
            {moment(createdAt).fromNow()}
          </Box>
        </Box>

        <Box
          mt="1"
          fontWeight="semibold"
          as="h4"
          lineHeight="tight"
          isTruncated
        >
          {title}
        </Box>

        <Box>{subtitle}</Box>
      </Box>
    </Box>
  );
};

export default Card;
