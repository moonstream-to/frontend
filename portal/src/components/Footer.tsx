import RouterLink from "next/link";

import React from "react";
import {
  Text,
  Link,
  Box,
  Container,
  Stack,
  Image as ChakraImage,
  Flex,
  Spacer,
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

const BGA = () => {
  <Flex
    borderRadius="10px"
    border="2px solid white"
    p="10px"
    gap="5px"
    justifyContent="center"
    alignItems="center"
    w="fit-content"
  >
    <Text>Member of</Text>
    <ChakraImage src={BGA_LOGO_URL} h="15px" alt="BGA" />
  </Flex>;
};

const Footer = ({ home }: { home?: boolean }) => {
  const [isMobileView] = useMediaQuery("(max-width: 767px)");
  return (
    <Box textColor="white" borderTop="1px" borderColor="white" px="7%" mx="auto" minW="100vw">
      <Container as={Stack} py={10} px="0px" maxW="1238px">
        <Text
          textAlign="center"
          bg="#101114"
          p="10px 15px"
          borderRadius="10px"
          mb="40px"
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

        <Flex direction={["column", "column", "row"]}>
          <Stack spacing={6}>
            <Box pb={isMobileView ? "40px" : "0px"}>
              {!home ? (
                <Link href="/" alignSelf="center">
                  <ChakraImage
                    alignSelf="center"
                    w="160px"
                    src={PRIMARY_MOON_LOGO_URL}
                    alt="Go to app root"
                  />
                </Link>
              ) : (
                <ChakraImage
                  alignSelf="center"
                  w="160px"
                  src={PRIMARY_MOON_LOGO_URL}
                  alt="Go to app root"
                />
              )}
            </Box>
            {!isMobileView && (
              <>
                <Flex justifyContent="start">
                  <RouterLink href="/policy">
                    <Text>Privacy policy</Text>
                  </RouterLink>
                  <RouterLink href="/terms">
                    <Text ml="20px">Terms of Service</Text>
                  </RouterLink>
                </Flex>
                <Text fontSize={"sm"}>
                  © {new Date().getFullYear()} Moonstream.to All&nbsp;rights&nbsp;reserved
                </Text>
              </>
            )}
          </Stack>
          <Spacer />
          <Flex
            direction="column"
            pb={isMobileView ? "40px" : "0px"}
            ml={["0px", "0px", "5vw", "100px"]}
          >
            <Text fontWeight="semibold" mb="20px">
              Follow Us
            </Text>
            <Flex width="158px" justifyContent="space-between">
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
              <SocialButton
                label={"LinkedIn"}
                href={"https://www.linkedin.com/company/moonstream/"}
              >
                <ChakraImage maxW="24px" src={`${AWS_STATIC_ASSETS_PATH}/logos/linkedin.svg`} />
              </SocialButton>
            </Flex>
          </Flex>
          <Flex justifyContent="space-between" pb={isMobileView ? "40px" : "0px"}>
            {Object.values(SITEMAP).map((category, colIndex) => {
              return (
                <Stack
                  ml={["0px", "0px", "5vw", "100px"]}
                  align={"flex-start"}
                  key={`footer-list-column-${colIndex}`}
                >
                  <>
                    <Text fontWeight="700">{category.title}</Text>
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
          </Flex>
          {isMobileView && (
            <Text fontSize={"sm"}>
              © {new Date().getFullYear()} Moonstream.to All&nbsp;rights&nbsp;reserved
            </Text>
          )}
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;
