import React, {useState, useEffect, lazy, Suspense} from 'react'
import {useAuth0} from '@auth0/auth0-react'
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from 'react-query'
import {ReactQueryDevtools} from 'react-query/devtools'
import {request, gql, GraphQLClient} from 'graphql-request'
import {ChakraProvider} from '@chakra-ui/react'
import theme from './theme/theme'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import Body from './components/layout/Body'

const NewPost = lazy(() => import('./components/NewPost'))
const Post = lazy(() => import('./components/Post'))
const Page = lazy(() => import('./components/Page'))
const Nav = lazy(() => import('./components/Nav'))

const endpoint = 'https://the-hackboard.herokuapp.com/v1/graphql'
export const client = new GraphQLClient(endpoint)

const defaultQueryFn = async ({queryKey}: {queryKey: any}) => {
  console.log('query', queryKey)
  let data = null
  try {
    data = await client.request(
      gql`
        ${queryKey[0]}
      `,
      queryKey[1],
    )
  } catch (err) {
    console.log(err)
  }

  return data
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
    },
  },
})

const App = () => {
  const [accessToken, setAccessToken] = useState<string>('')

  const {isAuthenticated, getAccessTokenSilently} = useAuth0()

  useEffect(() => {
    if (isAuthenticated) {
      const getToken = async () => {
        const token = await getAccessTokenSilently()
        setAccessToken(token)
      }

      getToken()
    }
  }, [isAuthenticated, getAccessTokenSilently])

  useEffect(() => {
    if (accessToken) {
      client.setHeader('authorization', `Bearer ${accessToken}`)
    }
  }, [accessToken])

  // const client = createClient({
  //   url: "https://the-hackboard.herokuapp.com/v1/graphql",
  //   fetchOptions: () => {
  //     if (accessToken) {
  //       return {
  //         headers: { authorization: `Bearer ${accessToken}` },
  //       };
  //     }
  //     return {};
  //   },
  // });

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <Suspense fallback={<div>Loading...</div>}>
          <Router>
            <Nav zIndex="sticky" />
            <Switch>
              <Route path="/new">
                <Body>
                  <NewPost />
                </Body>
              </Route>
              <Route path="/posts/:id">
                <Body>
                  <Post />
                </Body>
              </Route>
              <Route path="/">
                <Page />
              </Route>
            </Switch>
          </Router>
        </Suspense>
      </ChakraProvider>
    </QueryClientProvider>
  )
}

export default App
