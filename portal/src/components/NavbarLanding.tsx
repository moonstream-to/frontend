import RouterLink from "next/link";
import { useRouter } from "next/router";

import React from "react";
import {
  Button,
  Image,
  Link,
  Flex,
  ButtonGroup,
  Menu,
  MenuButton,
  Portal,
  MenuList,
  MenuItem,
  useMediaQuery,
  Divider,
} from "@chakra-ui/react";

import { AWS_STATIC_ASSETS_PATH, PAGETYPE, SITEMAP } from "../constants";
import { ChevronDownIcon } from "@chakra-ui/icons";
import Account from "./Account";
const PRIMARY_MOON_LOGO_URL = `${AWS_STATIC_ASSETS_PATH}/moonstream-full-logo-2022.png`;

const NavbarLanding = ({ home, ...props }: { home?: boolean; [x: string]: any }) => {
  const NavbarMenu = () => {
    return (
      <ButtonGroup
        h="100%"
        variant="link"
        spacing={isSmallView ? (isVerySmallView ? "8px" : "40px") : "16px"}
        justifyContent="center"
      >
        {SITEMAP.map((item, idx) => {
          return (
            <React.Fragment key={`Fragment-${idx}`}>
              {item.type !== PAGETYPE.FOOTER_CATEGORY && item.children && (
                <Menu autoSelect={false}>
                  <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    color="white"
                    fontWeight="500"
                    fontSize="16px"
                    _expanded={{ color: "white", fontWeight: "700" }}
                    _focus={{ textDecoration: "none" }}
                    _hover={{ textDecoration: "none", fontWeight: "700" }}
                  >
                    {item.title}
                  </MenuButton>
                  <Portal>
                    <MenuList
                      zIndex={100}
                      bg="black.300"
                      w="auto"
                      minW="auto"
                      borderRadius="10px"
                      p="20px 20px 10px 20px"
                      border="1px solid white"
                    >
                      {item.children.map((child, idx) => (
                        <MenuItem
                          key={`menu-${idx}`}
                          as={"div"}
                          cursor="pointer"
                          onClick={() => {
                            if (child.type === PAGETYPE.EXTERNAL) {
                              window.open(child.path, "_blank");
                            } else {
                              router.push(child.path);
                            }
                          }}
                          m={0}
                          color="white"
                          fontWeight="400"
                          fontSize="16px"
                          px="0px"
                          mb="10px"
                          h="22px"
                          _hover={{
                            backgroundColor: "black.300",
                            color: "orange.1000",
                            fontWeight: "700",
                          }}
                          _focus={{ backgroundColor: "black.300" }}
                        >
                          {child.title}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Portal>
                </Menu>
              )}
            </React.Fragment>
          );
        })}
      </ButtonGroup>
    );
  };

  const router = useRouter();
  const [isSmallView, isVerySmallView, isDesktop] = useMediaQuery([
    "(max-width: 1024px)",
    "(max-width: 400px)",
    "(min-width: 1440px)",
  ]);

  return (
    <Flex
      direction="column"
      gap="10px"
      w="100%"
      py="14px"
      borderBottom="1px solid white"
      {...props}
    >
      <Flex
        alignItems="center"
        id="NavbarLanding"
        bgColor="#1A1D22"
        w="100%"
        overflow="hidden"
        justifyContent="space-between"
      >
        <RouterLink href="/" passHref>
          {/* {home ? ()} */}
          <Link
            as={Image}
            w={{ base: "137px", sm: "160px" }}
            h="auto"
            justifyContent="left"
            src={PRIMARY_MOON_LOGO_URL}
            alt="Logo"
          />
        </RouterLink>
        {!isSmallView && <NavbarMenu />}
        {/*<Flex justifyContent="end" w="160px" gap={{ base: "5px", sm: "15px" }} alignItems="center">*/}
        {/*  {!router.asPath.includes("portal") && (*/}
        {/*    <>*/}
        {/*      <RouterLink href="/portal">*/}
        {/*        <Button*/}
        {/*          variant="whiteOutline"*/}
        {/*          fontWeight="400"*/}
        {/*          lineHeight={"1"}*/}
        {/*          p={"4px 10px"}*/}
        {/*          h="100%"*/}
        {/*          borderRadius="30px"*/}
        {/*          borderWidth="1px"*/}
        {/*          fontSize={isVerySmallView ? "12px" : "16px"}*/}
        {/*          _hover={{*/}
        {/*            backgroundColor: "transparent",*/}
        {/*          }}*/}
        {/*          // borderStyle={isVerySmallView ? "none" : "solid"}*/}
        {/*        >*/}
        {/*          Portal*/}
        {/*        </Button>*/}
        {/*      </RouterLink>*/}
        {/*      {!isSmallView && (*/}
        {/*        <Divider backgroundColor={"#8F8F8F"} orientation={"vertical"} h={"3px"} w={"3px"} />*/}
        {/*      )}*/}
        {/*    </>*/}
        {/*  )}*/}
        <Account
        // fontSize={isVerySmallView ? "12px" : "16px"}
        // background={isVerySmallView ? "transparent" : "#353535"}
        // mr={isVerySmallView ? "-15px" : "0"}
        />
        {/*</Flex>*/}
      </Flex>
      {isSmallView && <NavbarMenu />}
    </Flex>
  );
};

export default NavbarLanding;
