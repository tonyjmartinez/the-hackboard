import {useMutation} from 'react-query'
import {request, gql, GraphQLClient} from 'graphql-request'
import {client} from 'App'

const useGqlMutation = (gqlMutation: any) => {
  const mutation = useMutation(vars => {
    return client.request(
      gql`
        ${gqlMutation}
      `,
      vars,
    )
  })
  const {mutate, isLoading, isSuccess, isError, error, data} = mutation
  console.log('mutation', mutation)
  return {
    mutate: (vars: any) => mutate(vars),
    isLoading,
    isSuccess,
    isError,
    error,
    data,
  }
}

export default useGqlMutation
