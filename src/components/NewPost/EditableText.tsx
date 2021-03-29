import { HStack, IconButton, Input, InputProps, Spacer, Textarea, Text} from "@chakra-ui/react"
import React, { useState } from "react"
import { FiCheckCircle, FiX, FiEdit } from "react-icons/fi"

export interface EditableTextProps extends InputProps {
  isEditing?: boolean
  textValue: string
  onTextSubmit?: (val: string) => void
  singleLine?: boolean
}

const PostItemWrapper = ({children, ...props}: any) => (
  <HStack {...props}>{children}</HStack>
)

const EditableText = ({
  textValue,
  onTextSubmit,
  isEditing = false,
  singleLine = false,
}: EditableTextProps) => {
  const [inputValue, setInputValue] = React.useState(textValue ?? '')
  const [editing, setEditing] = useState(isEditing)

  if (editing) {
    return (
      <PostItemWrapper>
        {singleLine ? (
          <Input
            value={inputValue}
            onChange={e => {
              e.preventDefault()
              setInputValue(e.target.value)
            }}
            placeholder="Text content"
            size="sm"
          />
        ) : (
          <Textarea
            value={inputValue}
            onChange={e => {
              e.preventDefault()
              setInputValue(e.target.value)
            }}
            placeholder="Text content"
            size="sm"
          />
        )}

        <Spacer />
        <IconButton
          icon={<FiCheckCircle />}
          onClick={() => {
            onTextSubmit?.(inputValue)
            setEditing(false)
          }}
          aria-label="submit-text"
        />
        <IconButton
          icon={<FiX />}
          onClick={() => setEditing(!editing)}
          aria-label="stop editing"
        />
      </PostItemWrapper>
    )
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
  )
}

export default EditableText