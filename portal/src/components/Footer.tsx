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
} from "@chakra-ui/react";

import SocialButton from "./SocialButton";
import { AWS_STATIC_ASSETS_PATH, SITEMAP } from "../constants";

const LINKS_SIZES = {
  fontWeight: "300",
  fontSize: "md",
};

const PRIMARY_MOON_LOGO_URL = `${AWS_STATIC_ASSETS_PATH}/moonstream-full-logo-2022.png`;
const BGA_LOGO_URL = `${AWS_STATIC_ASSETS_PATH}/logos/bga-logo.png`;

const LegalInfo = ({ ...props }) => {
  return (
    <Flex gap="20px" {...props}>
      <Flex
        borderRadius="10px"
        border="2px solid white"
        p="10px"
        gap="5px"
        justifyContent="center"
        alignItems="center"
        w="fit-content"
      >
        <Text>Member&nbsp;of</Text>
        <ChakraImage src={BGA_LOGO_URL} h="15px" alt="BGA" />
      </Flex>
      <Flex justifyContent="start">
        <RouterLink href="/policy">
          <Text>Privacy policy</Text>
        </RouterLink>
        <RouterLink href="/terms">
          <Text ml="20px">Terms of Service</Text>
        </RouterLink>
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
      <Flex gap="20px" justifyContent="start">
        <SocialButton label={"Discord"} href={"https://discord.gg/K56VNUQGvA"}>
          <ChakraImage
            maxW="26px"
            src={`${AWS_STATIC_ASSETS_PATH}/icons/discord-logo.png`}
            _hover={{ scale: "0.1" }}
          />
        </SocialButton>
        <SocialButton label={"Twitter"} href={"https://twitter.com/moonstreamto"}>
          <ChakraImage maxW="24px" src={`${AWS_STATIC_ASSETS_PATH}/icons/twitter-logo.png`} />
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
                    <Text {...LINKS_SIZES}>{linkItem.title}</Text>
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
          borderRadius="10px"
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
            {isDesktopView && <LegalInfo direction="column" />}
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
              maxW="500px"
              mx="auto"
            />
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Footer;
