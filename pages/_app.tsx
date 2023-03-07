import type { AppProps } from 'next/app'

import { useState } from 'react'
import { QueryClientProvider, QueryClient } from 'react-query'
import { ChakraProvider } from '@chakra-ui/react'

import theme from '../src/theme'
import { Web3Context } from '../src/contexts'
import '../src/styles/globals.css'
import dynamic from 'next/dynamic'
// import AppContext from '../src/AppContext'
const AppContext = dynamic(() => import('../src/AppContext'), {
  ssr: false,
})
// import { GofpProvider } from '../src/contexts/GoFPContext'

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(new QueryClient())

  return (
    <AppContext>
      <Component {...pageProps} />
    </AppContext>
  )
}
