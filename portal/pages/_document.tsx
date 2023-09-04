import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          name="robots"
          content={process.env.NEXT_PUBLIC_BUILD_TARGET == "alpha" ? "noindex" : "all"}
        />
        <link href="https://fonts.googleapis.com/css?family=Space Grotesk" rel="stylesheet" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Roboto+Mono:wght@700&display=swap"
          rel="stylesheet"
        />
        <link href="https://fonts.googleapis.com/css?family=Lora" rel="stylesheet" />
        <link href="https://fonts.cdnfonts.com/css/cascadia-code" rel="stylesheet" />
      </Head>
      <body>
        {/*  <!-- Google Tag Manager (noscript) --> */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TG5Z6CG"
                    height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
          }}
        ></noscript>
        {/*<!-- End Google Tag Manager (noscript) -->*/}
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
