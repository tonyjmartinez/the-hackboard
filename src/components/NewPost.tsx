import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { ItemTypes } from "../util/enums";
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
  useTheme,
  Textarea,
  ButtonGroup,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { useMutation } from "urql";

import {
  Text as TextIcon,
  Image,
  Article,
  Code,
  CheckCircle,
  XCircle,
  Pencil,
} from "phosphor-react";
import { useAuth0 } from "@auth0/auth0-react";

type PostItemBtnProps = {
  text?: string;
  icon?: any;
  onClick?: () => void;
};

const InsertItem = `
  mutation ($value: String!, $userid: String!, $type: String!) {
    insert_items(objects: {value: $value, user_id: $userid, type: $type}) {
      returning {
        value
        id
      }
    }
  }
`;

const InsertPost = `
  mutation ($post_items: jsonb, $title: String, $user_id: String, $subtitle: String, $created_at: timestamptz) {
    insert_posts(objects: {post_items: $post_items, title: $title, user_id: $user_id, subtitle: $subtitle, created_at: $created_at}) {
      returning {
        id
        post_items
        title
        subtitle
      }
    }
  }
`;

const UpdatePostItem = `
  mutation ($id: Int, $value: String = "") {
    update_items(where: {id: {_eq: $id}}, _set: {value: $value}) {
      returning {
        id
        value
        type
      }
    }
  }
`;

interface EditableAreaProps {
  onChange?: (e: any) => void;
  onSubmit: (e: any) => void;
}

const EditableArea = ({ onChange, onSubmit }: EditableAreaProps) => {
  const theme = useTheme();
  const borderColor = useColorModeValue("gray", theme.colors.blue[500]);
  /* Here's a custom control */
  function EditableControls({ isEditing, onSubmit, onCancel, onEdit }: any) {
    return isEditing ? (
      <ButtonGroup justifyContent="center" size="sm">
        <IconButton
          aria-label="submit"
          icon={<CheckCircle />}
          onClick={onSubmit}
        />
        <IconButton aria-label="cancel" icon={<XCircle />} onClick={onCancel} />
      </ButtonGroup>
    ) : (
      <Flex justifyContent="center">
        <IconButton
          aria-label="edit"
          size="sm"
          icon={<Pencil />}
          onClick={onEdit}
        />
      </Flex>
    );
  }

  return (
    <Editable
      textAlign="center"
      defaultValue=""
      fontSize="2xl"
      isPreviewFocusable={false}
      submitOnBlur={false}
      startWithEditView
      placeholder="New text content"
      onChange={onChange}
      onSubmit={onSubmit}
    >
      {(props) => (
        <Box border={`2px solid ${borderColor}`} borderRadius="5px" p={3}>
          <FormLabel>Text Content</FormLabel>
          <EditablePreview />
          <EditableInput as={Textarea} />
          <EditableControls {...props} />
        </Box>
      )}
    </Editable>
  );
};

const PostItemBtn = ({ text, icon, onClick }: PostItemBtnProps) => {
  const iconColor = useColorModeValue("black", "blue.500");
  const boxColor = useColorModeValue("gray.100", "blue.900");
  const theme = useTheme();
  const shadowColor = useColorModeValue("gray", theme.colors.blue[500]);
  return (
    <Box
      bg={boxColor}
      height="160px"
      _hover={{ border: `10px solid ${shadowColor}` }}
      cursor="pointer"
      onClick={onClick}
    >
      <Center h="100%">
        <VStack>
          <Icon color={iconColor} as={icon} boxSize={14} />
          <Text>{text}</Text>
        </VStack>
      </Center>
    </Box>
  );
};

const NewPost = () => {
  const { handleSubmit, errors, register } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTextArea, setShowTextArea] = useState(false);
  const [postItems, setPostItems] = useState<number[]>([]);
  const [submittedTextId, setSubmittedTextId] = useState(-1);
  const [insertItemResult, insertItem] = useMutation(InsertItem);
  const [, insertPost] = useMutation(InsertPost);
  const [, updateItem] = useMutation(UpdatePostItem);

  const { user } = useAuth0();

  useEffect(() => {
    const newItemId = insertItemResult?.data?.insert_items?.returning[0].id;
    if (newItemId) {
      setPostItems((oldItems) => [...oldItems, newItemId]);
      setSubmittedTextId(newItemId);
    }
  }, [insertItemResult]);

  const sendItem = (value: string) => {
    insertItem({ value, userid: user.sub, type: ItemTypes.Text });
  };
  const sendUpdateItem = (value: string, id: number) => {
    updateItem({ value, id });
  };
  function validateTitle(value: string) {
    let error;
    if (!value) {
      error = "Title is required";
    }
    return error || true;
  }

  const onSubmit = async (values: any) => {
    const { title, subtitle } = values;
    setIsSubmitting(true);
    insertPost({
      title,
      subtitle,
      user_id: user.sub,
      post_items: postItems,
      created_at: moment(),
    });

    setIsSubmitting(false);
  };

  const onTextItemSubmit = (text: string) => {
    if (submittedTextId === -1) {
      sendItem(text);
    } else if (submittedTextId > 0) {
      sendUpdateItem(text, submittedTextId);
    }
  };

  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={errors.title} mt={10} mb={10}>
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
        <FormControl isInvalid={errors.title} mt={10} mb={10}>
          <FormLabel htmlFor="subtitle">Subtitle</FormLabel>
          <Input
            name="subtitle"
            placeholder="subtitle"
            ref={register({ validate: validateTitle })}
          />
        </FormControl>
        {showTextArea && <EditableArea onSubmit={onTextItemSubmit} />}

        {/* {showTextArea && (
          <FormControl isInvalid={errors.text}>
            <Textarea
              name="text"
              ref={register({ validate: validateTitle })}
              mt={6}
              onBlur={sendContent}
            />
          </FormControl>
        )} */}

        <Button
          mt={4}
          colorScheme="teal"
          isLoading={isSubmitting}
          type="submit"
        >
          Submit
        </Button>
      </form>
      <Heading m={6}>Add Content</Heading>
      <SimpleGrid columns={2} spacing={10} mt={6}>
        <PostItemBtn
          text="Text"
          icon={TextIcon}
          onClick={() => setShowTextArea(true)}
        />
        <PostItemBtn text="Image" icon={Image} />
        <PostItemBtn text="Markdown" icon={Article} />
        <PostItemBtn text="Code Snippet" icon={Code} />
      </SimpleGrid>
    </Container>
  );
};

export default NewPost;
