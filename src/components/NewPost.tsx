import { useForm } from "react-hook-form";
import React, { useEffect, useState, ReactText, ReactNode } from "react";
import moment from "moment";
import { ItemTypes } from "../util/enums";
import { List, arrayMove } from "react-movable";
import ReactFilestack from "filestack-react";

import MarkdownEditor from "./MarkdownEditor";

import {
  FormErrorMessage,
  Center,
  Image,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  CloseButton,
  RadioGroup,
  Stack,
  Radio,
  TabPanel,
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
  BoxProps,
  Divider,
  HStack,
  Spacer,
  InputProps,
  TextareaProps,
} from "@chakra-ui/react";
import { useMutation } from "urql";

import {
  FiEdit,
  FiImage,
  FiFileText,
  FiCode,
  FiCheckCircle,
  FiXCircle,
  FiEdit2,
  FiX,
} from "react-icons/fi";
import { useAuth0 } from "@auth0/auth0-react";
import { ReactComponent } from "*.svg";

type PostItemBtnProps = {
  text?: string;
  icon?: any;
  onClick?: () => void;
};

const InsertItem = `
  mutation ($value: String!, $userid: String!, $type: String!, $is_public: Boolean = false) {
    insert_items(objects: {value: $value, user_id: $userid, type: $type, is_public: $is_public}) {
      returning {
        value
        id
        type
      }
    }
  }
`;

const InsertPost = `
  mutation ($post_items: jsonb, $title: String, $user_id: String, $subtitle: String, $created_at: timestamptz, $image: String, $is_public: Boolean = false) {
    insert_posts(objects: {post_items: $post_items, title: $title, user_id: $user_id, subtitle: $subtitle, created_at: $created_at, image: $image, is_public: $is_public}) {
      returning {
        id
        post_items
        title
        subtitle
        image
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

const StyledBox = ({ children }: { children: ReactNode }) => {
  const theme = useTheme();
  const borderColor = useColorModeValue("gray", theme.colors.blue[500]);

  return (
    <Box border={`2px solid ${borderColor}`} borderRadius="5px" p={3}>
      {children}
    </Box>
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

const PostItemWrapper = ({ children, ...props }: any) => (
  <HStack {...props}>{children}</HStack>
);

export interface EditableTextProps extends InputProps {
  isEditing?: boolean;
  textValue: string;
  onTextSubmit?: (val: string) => void;
  singleLine?: boolean;
}
interface TextInputProps extends TextareaProps {
  inputValue: string;
  setInputValue: any;
}

const EditableText = ({
  textValue,
  onTextSubmit,
  isEditing = false,
  singleLine = false,
}: EditableTextProps) => {
  const [inputValue, setInputValue] = React.useState(textValue ?? "");
  const [editing, setEditing] = useState(isEditing);

  console.log("rerender...");
  if (editing) {
    return (
      <PostItemWrapper>
        {singleLine ? (
          <Input
            value={inputValue}
            onChange={(e) => {
              e.preventDefault();
              setInputValue(e.target.value);
            }}
            placeholder="Text content"
            size="sm"
          />
        ) : (
          <Textarea
            value={inputValue}
            onChange={(e) => {
              e.preventDefault();
              setInputValue(e.target.value);
            }}
            placeholder="Text content"
            size="sm"
          />
        )}

        <Spacer />
        <IconButton
          icon={<FiX />}
          onClick={() => setEditing(!editing)}
          aria-label="edit"
        />

        <IconButton
          icon={<FiCheckCircle />}
          onClick={() => onTextSubmit?.(inputValue)}
          aria-label="submit-text"
        />
      </PostItemWrapper>
    );
  }
  return (
    <PostItemWrapper>
      <Text whiteSpace="pre-line">{textValue}</Text>
      <Spacer />
      <IconButton
        icon={<FiEdit />}
        onClick={() => setEditing(!editing)}
        aria-label="edit"
      />
    </PostItemWrapper>
  );
};

const NewPost = () => {
  const { handleSubmit, errors, register } = useForm();
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [postItemIds, setPostItemIds] = useState<number[]>([]);
  const [, setSubmittedTextId] = useState(-1);
  const [insertItemResult, insertItem] = useMutation(InsertItem);
  const [insertPostResult, insertPost] = useMutation(InsertPost);
  const [, updateItem] = useMutation(UpdateItemValue);
  const [url, setUrl] = useState<string | null>(null);
  const [postItems, setPostItems] = useState<PostItem[]>([]);
  const [radioValue, setRadioValue] = React.useState<ReactText>("true");
  const [editing, setEditing] = useState<null | ItemTypes>(null);
  const [markdown, setMarkdown] = useState("");

  console.log("ids?", postItemIds);

  const { user } = useAuth0();

  console.log("insertPostResult", insertPostResult);

  const onFileUpload = (response: any) => {
    sendItem(thumbnail(response.filesUploaded[0].url), ItemTypes.Image);
    setEditing(null);
  };

  const onUrlSubmit = (val: string) => {
    sendItem(val, ItemTypes.Image);
    setEditing(null);
  };

  const onSelectCoverImage = (response: any) => {
    setUrl(thumbnail(response.filesUploaded[0].url));
  };

  useEffect(() => {
    const newItem = insertItemResult?.data?.insert_items?.returning[0];
    console.log("new?", insertItemResult);

    if (newItem) {
      const { value, id, type } = newItem;
      setPostItemIds((oldItems) => [...oldItems, newItem.id]);
      setPostItems((oldItems) => [...oldItems, { value, id, type }]);
      setSubmittedTextId(newItem.id);
      if (type === ItemTypes.Text) {
      }
      if (type === ItemTypes.Image) {
        setShowImageUpload(false);
        setEditing(null);
      }
    }
  }, [insertItemResult]);

  const sendItem = (value: string, type: string) => {
    insertItem({
      value,
      userid: user.sub,
      type,
      is_public: radioValue === "true",
    });
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
      image: url,
      is_public: radioValue === "true",
    });
  };

  const onTextItemSubmit = (text: string) => {
    sendItem(text, ItemTypes.Text);
  };

  const ImageUploader = () => {
    return (
      <>
        <ReactFilestack
          apikey={`${process.env.REACT_APP_FILESTACK_KEY}`}
          componentDisplayMode={{ type: "immediate" }}
          customRender={({ onPick }: any) => (
            <Button onClick={onPick}>Upload</Button>
          )}
          actionOptions={{
            accept: "image/*",
            allowManualRetry: true,
            fromSources: ["local_file_system"],
          }}
          onSuccess={onFileUpload}
        />
      </>
    );
  };

  const renderEditingComponent = (editing: any) => {
    switch (editing) {
      case ItemTypes.Text:
        return (
          <EditableText
            key="editable"
            textValue=""
            onTextSubmit={onTextItemSubmit}
            isEditing
          />
        );
      case ItemTypes.Markdown:
        return (
          <MarkdownEditor
            key="markdown"
            value={markdown}
            setValue={setMarkdown}
          />
        );
      case ItemTypes.Image:
        return (
          <>
            <FormLabel mb={6}>Image Content</FormLabel>
            <Tabs variant="soft-rounded" colorScheme="teal">
              <TabList>
                <Tab>Upload Image</Tab>
                <Tab>Image URL</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <ReactFilestack
                    apikey={`${process.env.REACT_APP_FILESTACK_KEY}`}
                    componentDisplayMode={{ type: "immediate" }}
                    customRender={({ onPick }: any) => (
                      <Button onClick={onPick}>Select Cover Image</Button>
                    )}
                    actionOptions={{
                      accept: "image/*",
                      allowManualRetry: true,
                      fromSources: ["local_file_system"],
                    }}
                    onSuccess={onFileUpload}
                  />
                </TabPanel>
                <TabPanel>
                  <EditableText
                    onTextSubmit={onUrlSubmit}
                    textValue=""
                    isEditing
                    singleLine
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={errors.title} marginY={3}>
          <HStack>
            <Heading m={6}>New Post</Heading>
            <Spacer />
            <Button
              mt={4}
              isLoading={insertPostResult.fetching}
              loadingText="Submitting"
              colorScheme="teal"
              type="submit"
            >
              Submit
            </Button>
          </HStack>

          <FormLabel htmlFor="title">Title</FormLabel>
          <Input
            name="title"
            placeholder="title"
            ref={register({ validate: validateTitle })}
            mb={3}
            autoComplete="off"
          />

          <FormErrorMessage>
            {errors.title && errors.title.message}
          </FormErrorMessage>
        </FormControl>

        <FormLabel htmlFor="coverImage">Cover Image</FormLabel>
        <Tabs variant="soft-rounded" colorScheme="teal" name="coverImage">
          <TabList>
            <Tab>Image URL</Tab>
            <Tab>Upload Image</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Input
                placeholder="Image URL"
                autoComplete="off"
                onChange={(e) => setUrl(e.target.value)}
                name="imageurl"
              />
            </TabPanel>
            <TabPanel>
              <ReactFilestack
                apikey={`${process.env.REACT_APP_FILESTACK_KEY}`}
                componentDisplayMode={{ type: "immediate" }}
                customRender={({ onPick }: any) => (
                  <Button onClick={onPick}>Select Cover Image</Button>
                )}
                actionOptions={{
                  accept: "image/*",
                  allowManualRetry: true,
                  fromSources: ["local_file_system"],
                }}
                onSuccess={onSelectCoverImage}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
        <FormControl isInvalid={errors.title} marginY={3}>
          <FormLabel htmlFor="subtitle">Subtitle</FormLabel>
          <Input
            name="subtitle"
            placeholder="subtitle"
            ref={register({ validate: validateTitle })}
            autoComplete="off"
          />
        </FormControl>
        <RadioGroup
          value={radioValue}
          onChange={(val) => setRadioValue(val)}
          mb={12}
        >
          <Stack spacing={4} direction="row">
            <Radio value="true">Public</Radio>
            <Radio value="false">Private</Radio>
          </Stack>
        </RadioGroup>
      </form>
      <List
        values={postItems}
        onChange={({ oldIndex, newIndex }) => {
          setPostItems(arrayMove(postItems, oldIndex, newIndex));
          setPostItemIds(arrayMove(postItemIds, oldIndex, newIndex));
        }}
        renderList={({ children, props }) => <Box {...props}>{children}</Box>}
        renderItem={({ value, props, index }) => {
          const { value: val, id, type } = value;
          console.log("render value.", val);
          switch (type) {
            case ItemTypes.Text:
              return (
                <Box key={index} {...props}>
                  <EditableText
                    textValue={val}
                    onTextSubmit={(newVal: string) =>
                      sendUpdateItem(newVal, id)
                    }
                  />
                </Box>
              );
            case ItemTypes.Image:
              return (
                <VStack key={index} {...props}>
                  <FormLabel>Image Content</FormLabel>
                  <Image src={val} mb={12} />
                  <CloseButton />
                </VStack>
              );

            default:
              return null;
          }
        }}
      />

      <Divider />
      {editing && (
        <StyledBox>
          <FormLabel color="blue.500">New Content</FormLabel>
          {renderEditingComponent(editing)}
        </StyledBox>
      )}

      {showImageUpload && <ImageUploader />}

      <Heading m={6}>Add Content</Heading>
      <SimpleGrid columns={2} spacing={10} mt={6}>
        <PostItemBtn
          text="Text"
          icon={FiEdit}
          onClick={() => setEditing(ItemTypes.Text)}
        />
        <PostItemBtn
          text="Image"
          icon={FiImage}
          onClick={() => setEditing(ItemTypes.Image)}
        />

        <PostItemBtn
          text="Markdown"
          icon={FiFileText}
          onClick={() => setEditing(ItemTypes.Markdown)}
        />
        <PostItemBtn text="Code Snippet" icon={FiCode} />
      </SimpleGrid>
    </Container>
  );
};

export default NewPost;
