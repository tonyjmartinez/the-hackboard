import React from 'react'
import {useQuery} from 'react-query'
import {ItemTypes} from '../util/enums'
import {Text, Image, AspectRatio} from '@chakra-ui/react'
import Skeleton from './Skeleton'
import Interweave from 'interweave'

export const GetItem = `
  query MyQuery($id: Int) {
    items(where: {id: {_eq: $id}}) {
      id
      type
      value
    }
  }
`

export type PostContentProps = {
  itemId: number
}

export interface PostContentType {
  items: any[]
}
const PostContent = ({itemId}: PostContentProps) => {
  const {data, isFetching} = useQuery<PostContentType | undefined>([
    GetItem,
    {id: itemId},
  ])

  if (isFetching || !data) {
    return <Skeleton />
  }
  const {type, value} = data?.items[0]

  // return <div>{result.data?.items[0].value}</div>;
  switch (type) {
    case ItemTypes.Text:
      return <Text whiteSpace="pre-line">{value}</Text>
    case ItemTypes.Image:
      return (
        <AspectRatio ratio={16 / 9} w={['80%', '80%', '60%']}>
          <Image src={value} />
        </AspectRatio>
      )
    case ItemTypes.Markdown:
      return <Interweave content={value} />

    default:
      return <Text>Oops</Text>
  }
}

export default PostContent
