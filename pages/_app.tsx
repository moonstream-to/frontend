import '../src/styles/globals.css'

import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import theme from '../src/theme'
import { Web3Context } from '../src/contexts'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Web3Context>
        <Component {...pageProps} />
      </Web3Context>
    </ChakraProvider>
  )
}
