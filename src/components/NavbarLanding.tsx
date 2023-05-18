import RouterLink from "next/link";

import React, { useEffect } from "react";
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
} from "@chakra-ui/react";

import { AWS_STATIC_ASSETS_PATH, PAGETYPE, SITEMAP } from "../constants";
import { ChevronDownIcon } from "@chakra-ui/icons";
import Account from "./Account";
import { useRouter } from "next/router";
const PRIMARY_MOON_LOGO_URL = `${AWS_STATIC_ASSETS_PATH}/moonstream-full-logo-2022.png`;

const NavbarLanding = ({ home, ...props }: { home?: boolean; [x: string]: any }) => {
  const router = useRouter();

  useEffect(() => {
    console.log(router.asPath);
  }, [router.asPath]);
  return (
    <Flex
      alignItems="center"
      id="NavbarLanding"
      minH="56px"
      maxH="56px"
      bgColor="#1A1D22"
      w="100%"
      overflow="hidden"
      justifyContent="space-between"
      borderBottom="1px solid white"
      {...props}
    >
      <RouterLink href="/" passHref>
        {/* {home ? ()} */}
        <Link
          as={Image}
          w="160px"
          h="auto"
          justifyContent="left"
          src={PRIMARY_MOON_LOGO_URL}
          alt="Logo"
        />
      </RouterLink>
      <ButtonGroup h="100%" variant="link" spacing={4} justifyContent="center">
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
                        <RouterLink
                          shallow={true}
                          key={`${idx}-${item.title}-menu-links`}
                          href={child.path}
                          passHref
                        >
                          <MenuItem
                            key={`menu-${idx}`}
                            as={"a"}
                            target={child.type === PAGETYPE.EXTERNAL ? "_blank" : "_self"}
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
                        </RouterLink>
                      ))}
                    </MenuList>
                  </Portal>
                </Menu>
              )}
            </React.Fragment>
          );
        })}
      </ButtonGroup>
      <Flex justifyContent="end" w="160px" gap="15px" alignItems="center">
        {!router.asPath.includes("portal") && (
          <RouterLink href="/">
            <Button
              variant="whiteOutline"
              fontSize="14px"
              p="5px 10px"
              h="fit-content"
              borderRadius="10px"
              borderWidth="1px"
              _hover={{
                backgroundColor: "transparent",
              }}
            >
              Portal
            </Button>
          </RouterLink>
        )}
        <Account />
      </Flex>
    </Flex>
  );
};

export default NavbarLanding;
