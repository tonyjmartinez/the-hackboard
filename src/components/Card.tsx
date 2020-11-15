import React from "react";
import { Box, Image, Badge } from "@chakra-ui/react";
import moment from "moment";
// Sample card from Airbnb

export interface CardProps {
  title: string;
  subtitle: string;
  id?: number;
  createdAt?: any;
}

const Card = ({ title, subtitle, createdAt }: CardProps) => {
  const property = {
    imageUrl: "https://bit.ly/2Z4KKcF",
    imageAlt: "Rear view of modern home with pool",
    beds: 3,
    baths: 2,
    title: `${title ? title : "Oops no title"}`,
    formattedPrice: "$1,900.00",
    reviewCount: 34,
    rating: 4,
  };

  return (
    <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Image src={property.imageUrl} alt={property.imageAlt} />

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
          {property.title}
        </Box>

        <Box>{subtitle}</Box>
      </Box>
    </Box>
  );
};

export default Card;
