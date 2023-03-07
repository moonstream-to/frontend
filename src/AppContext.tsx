import React, { useEffect, useState } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import theme from './theme/theme'

import Web3Provider from './contexts/Web3Context'
import { QueryClient, QueryClientProvider } from 'react-query'

const AppContext = (props: any) => {
  const [queryClient] = useState(new QueryClient())

  return (
    <ChakraProvider theme={theme}>
      <Web3Provider>
        <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
      </Web3Provider>
    </ChakraProvider>
  )
}

export default AppContext
