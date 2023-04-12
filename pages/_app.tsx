import type { AppProps } from "next/app"
import Script from "next/script"

import { useState } from "react"
import { QueryClientProvider, QueryClient } from "react-query"
import { ChakraProvider } from "@chakra-ui/react"

import theme from "../src/theme"
import { Web3Context } from "../src/contexts"
import "../src/styles/globals.css"
import { GofpProvider } from "../src/contexts/GoFPContext"
import { UserProvider } from "../src/contexts/UserContext"

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(new QueryClient())

  return (
    <>
      {/* <!-- Google tag (gtag.js) --> */}
      <Script
        strategy="afterInteractive"
        id="ga-script-1"
        src={"https://www.googletagmanager.com/gtag/js?id=G-TRL1FFH9MG"}
      ></Script>
      <Script
        id="ga-script-2"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-TRL1FFH9MG', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <ChakraProvider theme={theme}>
        <UserProvider>
          <QueryClientProvider client={queryClient}>
            <Web3Context>
              <GofpProvider>
                <Component {...pageProps} />
              </GofpProvider>
            </Web3Context>
          </QueryClientProvider>
        </UserProvider>
      </ChakraProvider>
    </>
  )
}
