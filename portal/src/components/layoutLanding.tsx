import React from "react";

import { Flex, Spacer, useMediaQuery } from "@chakra-ui/react";

import SiteHead from "./SiteHead";
import NavbarLanding from "./NavbarLanding";
import Footer from "./Footer";

export default function LayoutLanding({
  children,
  home,
  title,
}: {
  children: React.ReactNode;
  home?: boolean;
  title?: string;
}) {
  const [isSmallPadding] = useMediaQuery(["(min-width: 1024px) and (max-width: 1100px)"]);
  return (
    <div>
      <SiteHead title={title} />
      <Flex minH="100vh" flexDirection="column" justifyContent="start">
        <Flex direction="column">
          <NavbarLanding home={home} px={isSmallPadding ? "4%" : "7%"} />
        </Flex>
        {children}
        <Spacer />
        <Footer home={home} />
      </Flex>
    </div>
  );
}
