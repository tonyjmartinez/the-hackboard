import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { ItemTypes } from "../util/enums";
import ReactFilestack from "filestack-react";
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
        type
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

const UpdateItemValue = `
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
  onSubmit?: (e: any) => void;
  isSubmitting?: boolean;
  startWithEditView?: boolean;
  placeholder?: string;
  defaultValue?: string;
}

const EditableArea = ({
  onChange,
  onSubmit,
  isSubmitting = false,
  startWithEditView = true,
  placeholder = "",
  defaultValue = "",
}: EditableAreaProps) => {
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
      defaultValue={defaultValue}
      fontSize="2xl"
      isPreviewFocusable={false}
      submitOnBlur={false}
      startWithEditView={startWithEditView}
      placeholder={placeholder}
      onChange={onChange}
      onSubmit={onSubmit}
    >
      {(props) => (
        <Box border={`2px solid ${borderColor}`} borderRadius="5px" p={3}>
          <FormLabel>{isSubmitting ? "Loading..." : "Text Content"}</FormLabel>
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

const thumbnail = (url: any) => {
  const parts = url.split("/");
  parts.splice(3, 0, "resize=width:400");
  return parts.join("/");
};

type PostItem = {
  id: number;
  value: string;
  type: string;
};

const NewPost = () => {
  const { handleSubmit, errors, register } = useForm();
  const [showTextArea, setShowTextArea] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [postItemIds, setPostItemIds] = useState<number[]>([]);
  const [, setSubmittedTextId] = useState(-1);
  const [insertItemResult, insertItem] = useMutation(InsertItem);
  const [insertPostResult, insertPost] = useMutation(InsertPost);
  const [, updateItem] = useMutation(UpdateItemValue);
  const [, setUrl] = useState(null);
  const [postItems, setPostItems] = useState<PostItem[]>([]);

  console.log("post items", postItems);

  const { user } = useAuth0();

  const onFileUpload = (response: any) => {
    setUrl(thumbnail(response.filesUploaded[0].url));
  };

  useEffect(() => {
    const newItem = insertItemResult?.data?.insert_items?.returning[0];

    if (newItem) {
      const { value, id, type } = newItem;
      setPostItemIds((oldItems) => [...oldItems, newItem.id]);
      setPostItems((oldItems) => [...oldItems, { value, id, type }]);
      setSubmittedTextId(newItem.id);
      if (type === ItemTypes.Text) {
        setShowTextArea(false);
      }
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
    insertPost({
      title,
      subtitle,
      user_id: user.sub,
      post_items: postItemIds,
      created_at: moment(),
    });
  };

  const onTextItemSubmit = (text: string) => {
    sendItem(text);
    // if (submittedTextId === -1) {
    //   sendItem(text);
    // } else if (submittedTextId > 0) {
    //   sendUpdateItem(text, submittedTextId);
    // }
  };

  const ImageUploader = () => {
    return (
      <>
        <ReactFilestack
          apikey={`${process.env.REACT_APP_FILESTACK_KEY}`}
          componentDisplayMode={{ type: "immediate" }}
          actionOptions={{
            displayMode: "inline",
            container: "picker",
            accept: "image/*",
            allowManualRetry: true,
            fromSources: ["local_file_system"],
          }}
          onSuccess={onFileUpload}
        />
        <div
          id="picker"
          style={{
            marginTop: "2rem",
            height: "20rem",
            marginBottom: "2em",
          }}
        ></div>
      </>
    );
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
        {postItems?.map(({ value, id, type }: PostItem, idx: number) => {
          switch (type) {
            case ItemTypes.Text:
              return (
                <EditableArea
                  onSubmit={(val: string) => {
                    console.log("submitted...", val);
                    sendUpdateItem(val, id);
                  }}
                  defaultValue={value}
                  startWithEditView={false}
                />
              );
            default:
              return <div>Oops</div>;
          }
        })}
        {showTextArea && (
          <EditableArea
            onSubmit={onTextItemSubmit}
            isSubmitting={insertItemResult.fetching}
          />
        )}
        {showImageUpload && <ImageUploader />}

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
          isLoading={insertPostResult.fetching}
          loadingText="Submitting"
          colorScheme="teal"
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
        <PostItemBtn
          text="Image"
          icon={Image}
          onClick={() => setShowImageUpload(true)}
        />
        <PostItemBtn text="Markdown" icon={Article} />
        <PostItemBtn text="Code Snippet" icon={Code} />
      </SimpleGrid>
    </Container>
  );
};

export default NewPost;
