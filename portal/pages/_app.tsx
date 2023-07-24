import type { AppProps } from "next/app";
import Script from "next/script";

import { useState } from "react";
import { QueryClientProvider, QueryClient } from "react-query";
import { ChakraProvider } from "@chakra-ui/react";

import theme from "../src/theme";
import { Web3Context } from "../src/contexts";
import "../src/styles/globals.css";
import { GofpProvider } from "../src/contexts/GoFPContext";
import { UserProvider } from "../src/contexts/UserContext";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(new QueryClient());

  return (
    <>
      {/* <!-- Google tag (gtag.js) --> */}
      <Script
        strategy="afterInteractive"
        id="ga-script-1"
        src={"https://www.googletagmanager.com/gtag/js?id=G-MNVHX36LZ1"}
      ></Script>
      <Script
        id="ga-script-2"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-MNVHX36LZ1', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <Script
        id="google-tag-manager"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                  })(window,document,'script','dataLayer','GTM-TG5Z6CG');`,
        }}
      ></Script>
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
  );
}
