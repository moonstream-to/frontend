import RouterLink from "next/link";

import React from "react";
import {
  Text,
  Link,
  Box,
  Stack,
  Image as ChakraImage,
  Flex,
  useMediaQuery,
  Image,
} from "@chakra-ui/react";

import SocialButton from "./SocialButton";
import { AWS_STATIC_ASSETS_PATH, SITEMAP } from "../constants";

const LINKS_SIZES = {
  fontWeight: "300",
  fontSize: "md",
};

const PRIMARY_MOON_LOGO_URL = `${AWS_STATIC_ASSETS_PATH}/moonstream-full-logo-2022.png`;
const BGA_LOGO_URL = `${AWS_STATIC_ASSETS_PATH}/logos/bga-logo-1.png`;

const LegalInfo = ({ ...props }) => {
  return (
    <Flex gap="20px" direction={"column"} {...props}>
      <Flex
        gap={{ base: "20px", sm: "40px", md: "20px" }}
        direction={{ base: "column", sm: "row", md: "column" }}
        alignItems={{ base: "center", md: "start" }}
      >
        <Flex gap={"10px"}>
          <Link
            isExternal
            href="https://github.com/moonstream-to/"
            _hover={{ textDecoration: "none" }}
            justifyItems="center"
          >
            <Flex
              border="1px solid white"
              justifySelf="center"
              borderRadius="10px"
              w="fit-content"
              mx="auto"
              alignItems="center"
              p="9px"
              gap="5px"
            >
              <Image
                src={`${AWS_STATIC_ASSETS_PATH}/icons/open-source-icon.png`}
                h="20px"
                w="20px"
                alt=""
              />
              <Text fontSize="14px">Open&nbsp;Source</Text>
            </Flex>
          </Link>
          <Flex
            borderRadius="10px"
            border="1px solid white"
            p="10px"
            gap="5px"
            justifyContent="center"
            alignItems="center"
            w="fit-content"
          >
            <Text fontSize={"14px"} lineHeight={"normal"}>
              Member&nbsp;of
            </Text>
            <ChakraImage src={BGA_LOGO_URL} h="16px" w="39px" alt="BGA" />
          </Flex>
        </Flex>
        <Flex justifyContent="start">
          <RouterLink href="/policy">
            <Text _hover={{ color: "accent.500" }}>Privacy&nbsp;policy</Text>
          </RouterLink>
          <RouterLink href="/terms">
            <Text ml="20px" _hover={{ color: "accent.500" }}>
              Terms&nbsp;of&nbsp;Service
            </Text>
          </RouterLink>
        </Flex>
      </Flex>
      <Text fontSize={{ base: "14px" }}>
        ©&nbsp;{new Date().getFullYear()}&nbsp;Moonstream.to&nbsp;All&nbsp;rights&nbsp;reserved
      </Text>
    </Flex>
  );
};

const SocialButtons = () => {
  return (
    <Flex direction="column">
      <Text fontWeight="semibold" mb="20px">
        Follow Us
      </Text>
      <Flex gap="20px" justifyContent="start" alignItems={"center"}>
        <SocialButton label={"Discord"} href={"https://discord.gg/K56VNUQGvA"}>
          <ChakraImage maxW="26px" src={`${AWS_STATIC_ASSETS_PATH}/icons/discord-logo.png`} />
        </SocialButton>
        <SocialButton label={"Twitter"} href={"https://twitter.com/moonstreamto"}>
          <ChakraImage maxW="24px" src={`${AWS_STATIC_ASSETS_PATH}/landing/logos/x-twitter.svg`} />
        </SocialButton>
        <SocialButton label={"Github"} href={"https://github.com/moonstream-to/api"}>
          <ChakraImage maxW="24px" src={`${AWS_STATIC_ASSETS_PATH}/icons/github-logo.png`} />
        </SocialButton>
        <SocialButton label={"LinkedIn"} href={"https://www.linkedin.com/company/moonstream/"}>
          <ChakraImage maxW="24px" src={`${AWS_STATIC_ASSETS_PATH}/logos/linkedin.svg`} />
        </SocialButton>
      </Flex>
    </Flex>
  );
};

const Menu = () => {
  return (
    <>
      {Object.values(SITEMAP).map((category, colIndex) => {
        return (
          <Stack align={"flex-start"} key={`footer-list-column-${colIndex}`} gap="10px">
            <>
              <Text fontWeight="700" fontSize="16px" mb="10px">
                {category.title}
              </Text>
              {category.children.map((linkItem, linkItemIndex) => {
                return (
                  <RouterLink
                    passHref
                    href={linkItem.path}
                    key={`footer-list-link-item-${linkItemIndex}-col-${colIndex}`}
                  >
                    <Text {...LINKS_SIZES} _hover={{ color: "accent.500" }}>
                      {linkItem.title}
                    </Text>
                  </RouterLink>
                );
              })}
            </>
          </Stack>
        );
      })}
    </>
  );
};

const Footer = ({ home }: { home?: boolean }) => {
  const [isMobileView, isDesktopView, isLessThan600] = useMediaQuery([
    "(max-width: 767px)",
    "(min-width: 1023px)",
    "(max-width: 600px)",
  ]);
  return (
    <Box
      textColor="white"
      borderTop="1px"
      borderColor="white"
      px={{ base: "22px", sm: "7%" }}
      py="40px"
      minW="100vw"
    >
      <Flex direction="column" gap="40px" maxW="1238px" mx="auto">
        <Text
          textAlign="center"
          bg="#101114"
          p="10px 15px"
          borderRadius="15px"
          fontSize={{ base: "16px", sm: "18px" }}
        >
          If you like Moonstream,{" "}
          <Link
            isExternal
            href="https://github.com/moonstream-to/"
            _hover={{ color: "accent.500" }}
            fontWeight="700"
          >
            {" "}
            give us a star on GitHub!
          </Link>{" "}
          ⭐
        </Text>

        <Flex direction={isDesktopView ? "row" : "column"} w="100%" justifyContent="space-between">
          <Flex direction="column" gap="20px" alignItems="start">
            {!home ? (
              <Link href="/">
                <ChakraImage w="160px" src={PRIMARY_MOON_LOGO_URL} alt="Go to app root" />
              </Link>
            ) : (
              <ChakraImage w="160px" src={PRIMARY_MOON_LOGO_URL} alt="Go to app root" />
            )}
            {isDesktopView && <LegalInfo />}
          </Flex>
          {isDesktopView && !isMobileView && (
            <>
              <SocialButtons />
              <Menu />
            </>
          )}
          {!isDesktopView && !isLessThan600 && (
            <Flex justifyContent="space-between" mt="40px">
              <SocialButtons />
              <Menu />
            </Flex>
          )}
          {isLessThan600 && (
            <Flex justifyContent="space-between" mt="40px" direction="column">
              <SocialButtons />
              <Flex mt="40px" minW="100%" justifyContent="space-between">
                <Menu />
              </Flex>
            </Flex>
          )}
          {!isDesktopView && (
            <LegalInfo
              wrap="wrap"
              justifyContent="center"
              alignItems="center"
              pt="40px"
              mx="auto"
            />
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Footer;
