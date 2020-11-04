import { useForm } from "react-hook-form";
import React, { useState } from "react";
import {
  FormErrorMessage,
  Center,
  useColorModeValue,
  VStack,
  Text,
  SimpleGrid,
  Box,
  FormLabel,
  Heading,
  Icon,
  FormControl,
  Input,
  Button,
  Container,
  IconButton,
} from "@chakra-ui/core";
import { AddIcon } from "@chakra-ui/icons";

import { VscComment } from "react-icons/vsc";
const NewPost = () => {
  const { handleSubmit, errors, register } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const iconColor = useColorModeValue("black", "blue.500");

  function validateTitle(value: string) {
    let error;
    if (!value) {
      error = "Title is required";
    }
    return error || true;
  }

  function onSubmit(values: any) {
    setIsSubmitting(true);

    setTimeout(() => {
      alert(JSON.stringify(values, null, 2));
      setIsSubmitting(false);
    }, 1000);
  }

  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={errors.title} mt={10}>
          <Heading m={6}>New Post</Heading>
          <FormLabel htmlFor="title">Title</FormLabel>
          <Input
            name="title"
            placeholder="title"
            ref={register({ validate: validateTitle })}
          />
          <FormErrorMessage>
            {errors.title && errors.title.message}
          </FormErrorMessage>
        </FormControl>
        <Button
          mt={4}
          variantColor="teal"
          isLoading={isSubmitting}
          type="submit"
        >
          Submit
        </Button>
      </form>
      <Heading m={6}>Add Content</Heading>
      <SimpleGrid columns={2} spacing={10} mt={6}>
        <Box bg="gray.100" height="160px">
          <Center h="100%">
            <VStack>
              <Icon color={iconColor} as={VscComment} boxSize={14} />
              <Text>Text</Text>
            </VStack>
          </Center>
        </Box>
        <Box bg="gray.100" height="160px">
          <Center h="100%">
            <VStack>
              <Icon color={iconColor} as={VscComment} boxSize={14} />
              <Text>Text</Text>
            </VStack>
          </Center>
        </Box>
        <Box bg="gray.100" height="160px">
          <Center h="100%">
            <VStack>
              <Icon color={iconColor} as={VscComment} boxSize={14} />
              <Text>Text</Text>
            </VStack>
          </Center>
        </Box>
        <Box bg="gray.100" height="160px">
          <Center h="100%">
            <VStack>
              <Icon color={iconColor} as={VscComment} boxSize={14} />
              <Text>Text</Text>
            </VStack>
          </Center>
        </Box>
      </SimpleGrid>
    </Container>
  );
};

export default NewPost;
