import {useForm} from 'react-hook-form'
import {useEffect, useState, ReactText, ReactNode} from 'react'
import moment from 'moment'
import {ItemTypes} from '../../util/enums'
import {List, arrayMove} from 'react-movable'
import ReactFilestack from 'filestack-react'
import useRequireAuth from '../../hooks/use-require-auth'
import Interweave from 'interweave'
import EditableText from 'components/NewPost/EditableText'
import NewContent from './NewContent'

import MarkdownEditor from './MarkdownEditor'

import {
  FormErrorMessage,
  Center,
  Image,
  Tabs,
  Tab,
  TabList,
  TabPanels,
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
  IconButton,
  Divider,
  HStack,
  Spacer,
  InputProps,
  AspectRatio,
} from '@chakra-ui/react'
// import {useMutation} from 'react-query'
import useGqlMutation from 'hooks/use-gql-mutation'

import {
  FiEdit,
  FiImage,
  FiFileText,
  FiCode,
  FiCheckCircle,
  FiX,
} from 'react-icons/fi'
import {useAuth0} from '@auth0/auth0-react'



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
`

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
`

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
`

const StyledBox = ({children}: {children: ReactNode}) => {
  const theme = useTheme()
  const borderColor = useColorModeValue('gray', theme.colors.blue[500])

  return (
    <Box
      border={'2px solid'}
      borderColor={borderColor}
      borderRadius="5px"
      p={3}
    >
      {children}
    </Box>
  )
}



const thumbnail = (url: any) => {
  const parts = url.split('/')
  parts.splice(3, 0, 'resize=width:400')
  return parts.join('/')
}

type PostItem = {
  id: number
  value: string
  type: string
}

interface ItemType {
  value: string
  userid: any
  type: ItemTypes
  is_public: boolean
}

const NewPost = () => {
  const {handleSubmit, errors, register} = useForm()
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [postItemIds, setPostItemIds] = useState<number[]>([])
  const [, setSubmittedTextId] = useState(-1)
  const itemMutation = useGqlMutation(InsertItem)
  const postMutation = useGqlMutation(InsertPost)
  const itemValueMutation = useGqlMutation(UpdateItemValue)
  const [url, setUrl] = useState<string | null>(null)
  const [postItems, setPostItems] = useState<PostItem[]>([])
  const [radioValue, setRadioValue] = useState<ReactText>('true')
  const [editing, setEditing] = useState<null | ItemTypes>(null)
  const [markdown, setMarkdown] = useState('')
  const {user} = useAuth0()
  const buttonColor = useColorModeValue('gray', 'blue')

  const {data: insertItemResult, mutate: insertItem} = itemMutation
  const {data: updateItemResult, mutate: updateItem} = itemValueMutation
  const {
    data: insertPostResult,
    mutate: insertPost,
    isLoading: insertPostLoading,
  } = postMutation

  const auth = useRequireAuth()

  const onFileUpload = (response: any) => {
    sendItem(thumbnail(response.filesUploaded[0].url), ItemTypes.Image)
    setEditing(null)
  }

  const onUrlSubmit = (val: string) => {
    sendItem(val, ItemTypes.Image)
    setEditing(null)
  }

  const onSelectCoverImage = (response: any) => {
    setUrl(thumbnail(response.filesUploaded[0].url))
  }

  useEffect(() => {
    const newItem = insertItemResult?.insert_items?.returning[0]

    if (newItem) {
      const {value, id, type} = newItem
      setPostItemIds(oldItems => [...oldItems, newItem.id])
      setPostItems(oldItems => [...oldItems, {value, id, type}])
      setSubmittedTextId(newItem.id)
      if (type === ItemTypes.Text) {
      }
      if (type === ItemTypes.Image) {
        setShowImageUpload(false)
      }
      if (type === ItemTypes.Markdown) {
        setMarkdown('')
      }
      setEditing(null)
    }
  }, [insertItemResult])

  useEffect(() => {
    const updatedItem = updateItemResult?.data?.update_items?.returning[0]
    if (updatedItem) {
      const newItems = [...postItems]
      const idx = newItems.findIndex(val => val.id === updatedItem.id)
      newItems[idx] = updatedItem
      setPostItems(newItems)
    }
  }, [updateItemResult])

  if (!auth) return <div>Loading...</div>

  const sendItem = (value: string, type: string) => {
    insertItem({
      value,
      userid: user.sub,
      type,
      is_public: radioValue === 'true',
    })
  }
  const sendUpdateItem = (value: string, id: number) => {
    updateItem({value, id})
  }
  function validateTitle(value: string) {
    let error
    if (!value) {
      error = 'Title is required'
    }
    return error || true
  }

  const onSubmit = async (values: any) => {
    const {title, subtitle} = values

    insertPost({
      title,
      subtitle,
      user_id: user.sub,
      post_items: postItemIds,
      created_at: moment(),
      image: url,
      is_public: radioValue === 'true',
    })
  }

  const onTextItemSubmit = (text: string) => {
    sendItem(text, ItemTypes.Text)
  }

  const ImageUploader = () => {
    return (
      <>
        <ReactFilestack
          apikey={`${process.env.REACT_APP_FILESTACK_KEY}`}
          componentDisplayMode={{type: 'immediate'}}
          customRender={({onPick}: any) => (
            <Button onClick={onPick}>Upload</Button>
          )}
          actionOptions={{
            accept: 'image/*',
            allowManualRetry: true,
            fromSources: ['local_file_system'],
          }}
          onSuccess={onFileUpload}
        />
      </>
    )
  }

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
        )
      case ItemTypes.Markdown:
        return (
          <VStack>
            <MarkdownEditor
              key="markdown"
              value={markdown}
              setValue={setMarkdown}
            />
            <IconButton
              icon={<FiCheckCircle />}
              onClick={() => sendItem(markdown, ItemTypes.Markdown)}
              aria-label="submit-text"
            />
          </VStack>
        )
      case ItemTypes.Image:
        return (
          <>
            <FormLabel mb={6}>Image Content</FormLabel>
            <Tabs variant="soft-rounded" colorScheme="teal">
              <TabList>
                <Tab>Image URL</Tab>
                <Tab>Upload Image</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <EditableText
                    onTextSubmit={onUrlSubmit}
                    textValue=""
                    isEditing
                    singleLine
                  />
                </TabPanel>
                <TabPanel>
                  <ReactFilestack
                    apikey={`${process.env.REACT_APP_FILESTACK_KEY}`}
                    componentDisplayMode={{type: 'immediate'}}
                    customRender={({onPick}: any) => (
                      <Button onClick={onPick}>Select Cover Image</Button>
                    )}
                    actionOptions={{
                      accept: 'image/*',
                      allowManualRetry: true,
                      fromSources: ['local_file_system'],
                    }}
                    onSuccess={onFileUpload}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </>
        )

      default:
        return null
    }
  }

  return (
    <Container pb={10}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={errors.title} marginY={3}>
          <HStack>
            <Heading m={6}>New Post</Heading>
            <Spacer />
            <Button
              mt={4}
              isLoading={insertPostLoading}
              loadingText="Submitting"
              type="submit"
              colorScheme={buttonColor}
            >
              Submit
            </Button>
          </HStack>

          <FormLabel htmlFor="title">Title</FormLabel>
          <Input
            name="title"
            placeholder="title"
            ref={register({validate: validateTitle})}
            mb={3}
            autoComplete="off"
          />

          <FormErrorMessage>
            {errors.title && errors.title.message}
          </FormErrorMessage>
        </FormControl>

        <FormLabel htmlFor="coverImage">Cover Image</FormLabel>
        <Tabs
          variant="soft-rounded"
          colorScheme={buttonColor}
          name="coverImage"
        >
          <TabList>
            <Tab>Image URL</Tab>
            <Tab>Upload Image</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Input
                placeholder="Image URL"
                autoComplete="off"
                onChange={e => setUrl(e.target.value)}
                name="imageurl"
              />
            </TabPanel>
            <TabPanel>
              <ReactFilestack
                apikey={`${process.env.REACT_APP_FILESTACK_KEY}`}
                componentDisplayMode={{type: 'immediate'}}
                customRender={({onPick}: any) => (
                  <Button onClick={onPick}>Select Cover Image</Button>
                )}
                actionOptions={{
                  accept: 'image/*',
                  allowManualRetry: true,
                  fromSources: ['local_file_system'],
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
            ref={register({validate: validateTitle})}
            autoComplete="off"
          />
        </FormControl>
        <RadioGroup
          value={radioValue}
          onChange={val => setRadioValue(val)}
          mb={12}
        >
          <Stack spacing={4} direction="row">
            <Radio value="true">Public</Radio>
            <Radio value="false">Private</Radio>
          </Stack>
        </RadioGroup>
      </form>
      {postItems?.length > 0 && <Heading m={6}>Post Content</Heading>}

      <List
        values={postItems}
        onChange={({oldIndex, newIndex}) => {
          setPostItems(arrayMove(postItems, oldIndex, newIndex))
          setPostItemIds(arrayMove(postItemIds, oldIndex, newIndex))
        }}
        renderList={({children, props}) => <Box {...props}>{children}</Box>}
        renderItem={({value, props, index}) => {
          const {value: val, id, type} = value
          switch (type) {
            case ItemTypes.Text:
              return (
                <Box key={index} py={6} {...props}>
                  <EditableText
                    textValue={val}
                    onTextSubmit={(newVal: string) =>
                      sendUpdateItem(newVal, id)
                    }
                  />
                  <Divider mt={3} />
                </Box>
              )
            case ItemTypes.Image:
              return (
                <VStack key={index} py={6} {...props}>
                  <FormLabel>Image Content</FormLabel>
                  <AspectRatio ratio={16 / 9} w={['80%', '80%', '60%']} mb={6}>
                    <Image src={val} mb={12} />
                  </AspectRatio>
                  <Divider mt={3} />
                </VStack>
              )

            case ItemTypes.Markdown:
              return (
                <Box key={index} py={6} {...props}>
                  <Interweave content={val} />
                  <Divider mt={3} />
                </Box>
              )

            default:
              return null
          }
        }}
      />

      {editing && (
        <StyledBox>
          <FormLabel color="blue.500">New Content</FormLabel>
          {renderEditingComponent(editing)}
        </StyledBox>
      )}

      {showImageUpload && <ImageUploader />}

      <Heading m={6}>Add Content</Heading>
      <NewContent setEditing={setEditing}/>
    </Container>
  )
}

export default NewPost
