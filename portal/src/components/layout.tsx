import React from "react";

import { Flex, Spacer } from "@chakra-ui/react";

import SiteHead from "./SiteHead";
import useUser from "../contexts/UserContext";
import Navbar from "./Navbar";
import NeedAuthorizationView from "./NeedAuthorizationView";
import BreadcrumbView from "./BreadcrumbView";
import Footer from "./Footer";

export default function Layout({
  children,
  home,
  title,
  needAuthorization = true,
  showBreadcrumb = true,
}: {
  children: React.ReactNode;
  home?: boolean;
  title?: string;
  needAuthorization?: boolean;
  showBreadcrumb?: boolean;
}) {
  const { user, isLoading } = useUser();
  return (
    <div>
      <SiteHead title={title} />
      <Flex minH="100vh" flexDirection="column" justifyContent="start">
        <Flex direction="column">
          <Navbar home={home} px="7%" />
          {showBreadcrumb && <BreadcrumbView />}
        </Flex>
        {user || !needAuthorization ? children : isLoading ? "" : <NeedAuthorizationView />}
        <Spacer />
        <Footer home={home} />
      </Flex>
    </div>
  );
}
