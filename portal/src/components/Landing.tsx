import RouterLink from "next/link";
import React, { Suspense } from "react";
import {
  Fade,
  Flex,
  Heading,
  Box,
  chakra,
  Stack,
  Link,
  Center,
  Grid,
  Text,
  GridItem,
  Image as ChakraImage,
  VStack,
  Accordion,
  Icon,
  Button,
} from "@chakra-ui/react";
import { HiOutlineChatAlt2 } from "react-icons/hi";

import FAQCard from "./FAQCard";
import { AWS_STATIC_ASSETS_PATH, DISCORD_LINK } from "../constants";
import FeatureCard from "./FeatureCard";
import MoonstreamMetrics from "./landing/MoonstreamMetrics";
import TrustedBy from "./landing/TrustedBy";
import UpcomingIntegrations from "./landing/UpcomingIntegrations";

const HEADING_PROPS = {
  fontWeight: "700",
  fontSize: ["4xl", "5xl", "5xl", "5xl", "6xl", "7xl"],
};

const assets = {
  openSource: `${AWS_STATIC_ASSETS_PATH}/icons/open-source-icon.png`,
};

export const MoonstreamFeatures = [
  {
    name: "Analytics",
    description: "Monitor on- and off-chain player activity",
    image: `${AWS_STATIC_ASSETS_PATH}/analytics-card.png`,
    href: "/features/#analytics",
  },
  {
    name: "Leaderboards",
    description: "Assign scores to player activity",
    image: `${AWS_STATIC_ASSETS_PATH}/Terminus.png`,
    href: "/features/#leaderboards",
  },
  {
    name: "Drops",
    description: "Automate on-chain rewards for leaderboard positions",
    image: `${AWS_STATIC_ASSETS_PATH}/airdrop.png`,
    href: "features/#drops",
  },
];

const featuredBy = [
  {
    name: "TechCrunch",
    img: `${AWS_STATIC_ASSETS_PATH}/logos/tech-crunch-logo.png`,
    w: 103,
    h: 14.65,
  },
  {
    name: "Cointelegraph",
    img: `${AWS_STATIC_ASSETS_PATH}/logos/cointelegraph-logo.png`,
    w: 103,
    h: 20.81,
  },
  // { name: "in", img: `${AWS_STATIC_ASSETS_PATH}/logos/be-in-crypto.png`, w: 18, h: 19 }, //should be 72
  { name: "gam3r", img: `${AWS_STATIC_ASSETS_PATH}/logos/gam3r-logo.png`, w: 73, h: 19 },
  {
    name: "cryptoslate",
    img: `${AWS_STATIC_ASSETS_PATH}/logos/cryptoslate-logo.png`,
    w: 98,
    h: 16,
  },
  {
    name: "crypto reporter",
    img: `${AWS_STATIC_ASSETS_PATH}/logos/crypto-reporter-logo.png`,
    w: 97,
    h: 23,
  },
  {
    name: "101 blockchain",
    img: `${AWS_STATIC_ASSETS_PATH}/logos/101-blockchain-logo.png`,
    w: 41,
    h: 23,
  },
  { name: "educative", img: `${AWS_STATIC_ASSETS_PATH}/logos/educative-logo.png`, w: 85, h: 18 },
  { name: "CGC X", img: `${AWS_STATIC_ASSETS_PATH}/logos/cgc-X-logo.png`, w: 41, h: 25.5 },
  {
    name: "crypto insiders",
    img: `${AWS_STATIC_ASSETS_PATH}/logos/crypto-insiders-logo.png`,
    w: 94,
    h: 16,
  },
];

const Landing = () => {
  const lightOrangeColor = "#F56646";

  return (
    <Suspense fallback="">
      <Fade in>
        <Box
          width="100%"
          flexDirection="column"
          sx={{ scrollBehavior: "smooth" }}
          bgSize="cover"
          id="page:landing"
          textColor="white"
          px="7%"
          py="30px"
        >
          <Flex
            direction="column"
            h="auto"
            position="relative"
            maxW="1238px"
            overflow="initial"
            mx="auto"
            pt={0}
          >
            <Suspense fallback={""}></Suspense>

            <Grid templateColumns="repeat(12,1fr)" mt={0} border="none" boxSizing="content-box">
              <GridItem colSpan={12} id="Header grid item">
                <chakra.header boxSize="full" mb={0}>
                  <Box bgPos="bottom" bgSize="cover" boxSize="full">
                    <Flex align="center" justify="center" boxSize="full" pb={10} flexDir="column">
                      <Stack textAlign="center" alignItems="center" w="100%">
                        <Box fontSize={["30px", "30px", "50px"]} fontWeight="700" mt="0px">
                          Open source infrastructure
                          <br />
                          for healthy game economies
                        </Box>
                        <chakra.span
                          pb={[2, 6]}
                          fontSize={["md", "md", "md", "md", null]}
                          display="inline-block"
                          color="white"
                          maxW={[null, "85%", "75%", "55%"]}
                        >
                          Create economic loops that reward your players with Moonstream’s
                          analytics, leaderboards, and drops. Watch your game economy flourish.
                        </chakra.span>
                        <Stack
                          direction={["column", "row", "row", "row", "row", "row"]}
                          pb={10}
                          fontSize={["16px", "16px", "20px"]}
                        >
                          <Center>
                            <Link isExternal href={DISCORD_LINK}>
                              <Button variant="whiteOutline" px={["20px", "20px", "30px"]}>
                                Join our Discord
                              </Button>
                            </Link>
                          </Center>
                        </Stack>
                      </Stack>

                      <MoonstreamMetrics />
                    </Flex>
                  </Box>
                </chakra.header>
              </GridItem>
              {/* trusted by */}
              <GridItem py={[4, 8]} colSpan={12}>
                <TrustedBy />
              </GridItem>
              {/*upcoming integrations */}
              <GridItem colSpan={12}>
                <UpcomingIntegrations />
              </GridItem>
              {/* features */}
              <GridItem colSpan={12} pt={12} textColor="white">
                <Heading {...HEADING_PROPS} textAlign="center" pb={6} as="h2">
                  Features
                </Heading>
                <Center fontSize={["md", "md", null]} py={4}>
                  <VStack>
                    <Text textAlign="center" display="inline-block" w={["100%", "100%", "70%"]}>
                      Slowed down by building your own tools for web3 game economy design? Don’t be,
                      Moonstream already has game design tools that you can use.
                    </Text>
                  </VStack>
                </Center>
                <Flex
                  direction={{ base: "column", sm: "row" }}
                  gap={{ base: "20px", sm: "40px" }}
                  justifyContent="center"
                  alignItems="center"
                  my={{ base: "40px", sm: "60px" }}
                >
                  {MoonstreamFeatures.map((f, idx) => (
                    <FeatureCard key={idx} feature={f} />
                  ))}
                </Flex>
                <Center py={8}>
                  <Stack direction={["column", "column", "row", "row", "row", "row"]} pb={4}>
                    <Center>
                      <RouterLink href="/features">
                        <Button variant="plainOrange">Learn more about our features</Button>
                      </RouterLink>
                    </Center>
                    <Center>
                      <Link href="https://docs.google.com/document/d/1mjfF8SgRrAZvtCVVxB2qNSUcbbmrH6dTEYSMfHKdEgc/view">
                        <Button variant="whiteOutline">Explore the use cases</Button>
                      </Link>
                    </Center>
                  </Stack>
                </Center>
              </GridItem>
              {/* open source */}
              <GridItem colSpan={12}>
                <Flex
                  direction="column"
                  borderRadius="40px"
                  border="1px solid white"
                  p={{ base: "30px", sm: "40px 60px" }}
                  gap="30px"
                  justifyContent="center"
                  textAlign="center"
                  alignItems="center"
                >
                  <Text fontSize="30px" fontWeight="700">
                    Transparent and Open Source
                  </Text>
                  <Flex
                    direction={{ base: "column", sm: "row" }}
                    gap={{ base: "20px", sm: "20px", md: "30px" }}
                    maxW="650px"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <ChakraImage src={assets.openSource} h="50px" alt="" />
                    <Text fontSize={{ base: "16px", sm: "18px" }}>
                      We build our technology in the open. Consider giving us a star on&nbsp;GitHub
                      to support innovation in the web3 gaming space ⭐
                    </Text>
                  </Flex>
                  <Flex direction={{ base: "column", sm: "row" }} gap="20px">
                    <Link href="https://github.com/moonstream-to" isExternal>
                      <Button variant="whiteOutline">Visit GitHub</Button>
                    </Link>
                  </Flex>
                </Flex>
              </GridItem>
              {/* workflow */}
              <GridItem py={[4, 10]} colSpan={12}>
                <Heading {...HEADING_PROPS} textAlign="center" pb={[4, 14]} as="h2">
                  Our Workflow
                </Heading>
                <Stack textAlign="center" direction={["column", "column", "row"]}>
                  <VStack alignItems="center" pr={4} py={4}>
                    <Flex mb={5}>
                      <Heading
                        as="h3"
                        fontSize={["lg", "lg", null]}
                        display="inline-block"
                        fontWeight="semibold"
                      >
                        Step 1
                      </Heading>
                    </Flex>
                    <Flex>
                      <chakra.span fontSize={["md", "md", null]} display="inline-block">
                        So you decided to build a healthy economy on the blockchain. You are on the
                        right path, traveler!
                      </chakra.span>
                    </Flex>
                  </VStack>
                  <VStack alignItems="center" px={4} py={4}>
                    <Flex mb={5}>
                      <Heading
                        as="h3"
                        fontSize={["lg", "lg", null]}
                        display="inline-block"
                        fontWeight="semibold"
                      >
                        Step 2
                      </Heading>
                    </Flex>
                    <Flex>
                      <chakra.span fontSize={["md", "md", null]} display="inline-block">
                        Reach out to us on{" "}
                        <Link
                          isExternal
                          href={DISCORD_LINK}
                          textDecoration="underline"
                          _hover={{ color: "accent.500" }}
                        >
                          Discord
                        </Link>
                        . We&apos;ll get back to you within 3 days to schedule a call or make a
                        partnership proposal.
                      </chakra.span>
                    </Flex>
                  </VStack>
                  <VStack alignItems="center" px={4} py={4}>
                    <Flex mb={5}>
                      <Heading
                        as="h3"
                        fontSize={["lg", "lg", null]}
                        display="inline-block"
                        fontWeight="semibold"
                      >
                        Step 3
                      </Heading>
                    </Flex>
                    <Flex mb={5}>
                      <chakra.span fontSize={["md", "md", null]} display="inline-block">
                        Onboard and create utility for your web3 game integration. Moonstream has
                        the best tools for game design to get you started.
                      </chakra.span>
                    </Flex>
                  </VStack>
                  <VStack alignItems="center" pl={4} py={4}>
                    <Center
                      mb={5}
                      w="100%"
                      bg="linear-gradient(92.04deg, #FFD337 36.28%, rgba(48, 222, 76, 0.871875) 43.18%, rgba(114, 162, 255, 0.91) 50.43%, rgba(255, 160, 245, 0.86) 55.02%, rgba(255, 101, 157, 0.71) 60.64%, rgba(255, 97, 154, 0.59) 64.7%), #1A1D22;"
                      backgroundClip="text"
                    >
                      <Heading
                        as="h3"
                        fontSize={["lg", "lg", null]}
                        display="inline-block"
                        fontWeight="semibold"
                      >
                        Enjoy
                      </Heading>
                    </Center>
                    <Flex>
                      <chakra.span fontSize={["md", "md", null]} display="inline-block">
                        You&apos;re at the end of your blockchain development journey now, traveler.
                        Time to watch your game economy grow!
                      </chakra.span>
                    </Flex>
                  </VStack>
                </Stack>
                <Center pt={14}>
                  <Icon as={HiOutlineChatAlt2} w={6} h={6} mr={2}></Icon>
                  <Text fontSize={["xs", "sm", "md", "md", null]}>
                    Have something to discuss before signing up?{" "}
                    <Link href="https://discord.gg/K56VNUQGvA" isExternal>
                      <u>Join our Discord</u>{" "}
                    </Link>
                    to get in touch with the team (@zomglings).
                  </Text>
                </Center>
              </GridItem>
              {/* faq */}
              <GridItem py={[4, 10]} colSpan={12}>
                <Heading {...HEADING_PROPS} textAlign="center" as="h2" pb={10}>
                  FAQ
                </Heading>
                <Accordion defaultIndex={[-1]} allowMultiple>
                  <FAQCard
                    heading="Can I set it up by myself?"
                    headingProps={HEADING_PROPS}
                    panelContent={
                      <>
                        Yes and no. We are actively working to make all of our products self-serve
                        in the near future. For now, you&apos;ll need to get in{" "}
                        <Link
                          isExternal
                          href={DISCORD_LINK}
                          textDecoration="underline"
                          _hover={{ color: "accent.500" }}
                        >
                          contact
                        </Link>{" "}
                        with us to start using Moonstream.
                        <br />
                        <br />
                        However, you can already use our{" "}
                        <RouterLink
                          style={{ textDecoration: "underline" }}
                          href="/portal/analytics"
                        >
                          web3 Analytics
                        </RouterLink>{" "}
                        after registering an account.
                      </>
                    }
                  />
                  <FAQCard
                    heading="Can I use just one or two of Moonstream’s features?"
                    headingProps={HEADING_PROPS}
                    panelContent={<>Yes, you can.</>}
                  />
                  <FAQCard
                    heading="Can I create on-chain loyalty programs with Moonstream tools? "
                    headingProps={HEADING_PROPS}
                    panelContent={
                      <>
                        Yes, you definitely can. <br />
                        <br />
                        Get player activity data with Analytics, assign scores to that activity.
                        Display those scores with Leaderboards. Minimize manual work by dropping
                        rewards automatically with Drops.
                      </>
                    }
                  />
                  <FAQCard
                    heading="I’m a data scientist. Can I use Moonstream for research?"
                    headingProps={HEADING_PROPS}
                    panelContent={
                      <>
                        You can use{" "}
                        <Link href="https://github.com/bugout-dev/moonworm" isExternal>
                          <u>Moonworm</u>
                        </Link>
                        , our free open source tool, to build datasets of on-chain data related to
                        market activity.
                        <br />
                        <br />
                        We also have a dataset with on-chain activity from the Ethereum NFT market
                        (April 1 to September 25, 2021){" "}
                        <Link
                          href="https://www.kaggle.com/datasets/simiotic/ethereum-nfts"
                          isExternal
                        >
                          <u>here</u>
                        </Link>
                        . And{" "}
                        <Link
                          href="https://github.com/bugout-dev/moonstream/blob/main/datasets/nfts/papers/ethereum-nfts.pdf"
                          isExternal
                        >
                          <u>here</u>
                        </Link>{" "}
                        is our full report on it.
                      </>
                    }
                  />
                  <FAQCard
                    heading="I don’t see the blockchain I need in the supported blockchains, can you add it?"
                    headingProps={HEADING_PROPS}
                    panelContent={
                      <>
                        If it’s an EVM compatible blockchain we can add it in a couple of days.{" "}
                        <Link
                          isExternal
                          href={DISCORD_LINK}
                          textDecoration="underline"
                          _hover={{ color: "accent.500" }}
                        >
                          Contact us
                        </Link>{" "}
                        to make it happen!
                      </>
                    }
                  />
                  <FAQCard
                    heading="Is it free? Where can I see the pricing?"
                    headingProps={HEADING_PROPS}
                    panelContent={
                      <>
                        The tools are{" "}
                        <Link
                          isExternal
                          href="https://github.com/moonstream-to"
                          _hover={{ color: "accent.500" }}
                        >
                          {" "}
                          open source
                        </Link>
                        . If you prefer to onboard and get support, please{" "}
                        <Link
                          isExternal
                          href={DISCORD_LINK}
                          textDecoration="underline"
                          _hover={{ color: "accent.500" }}
                        >
                          contact us
                        </Link>{" "}
                        to get the pricing information.
                      </>
                    }
                  />
                </Accordion>
              </GridItem>
              {/* featured by */}
              <GridItem py={10} colSpan={12} textColor="white">
                <Heading
                  as="h2"
                  {...HEADING_PROPS}
                  textAlign="center"
                  pb={10}
                  fontWeight="semibold"
                >
                  Featured by
                </Heading>
                <Center>
                  <Flex
                    wrap="wrap"
                    direction="row"
                    justifyContent="center"
                    gap="20px"
                    columnGap={{ base: "20px", sm: "50px" }}
                    rowGap={{ base: "20px", sm: "40px" }}
                    px={{ base: "22px", sm: "54px", md: "72px", l: "101px" }}
                  >
                    {featuredBy.map((f) => (
                      <ChakraImage
                        key={f.name}
                        src={f.img}
                        alt={f.name}
                        alignSelf="center"
                        justifySelf="center"
                        w={{ base: f.w, sm: f.w * 1.8, md: f.w * 2 }}
                      />
                    ))}
                  </Flex>
                </Center>
              </GridItem>
              <GridItem pt={10} pb={20} colSpan={12}>
                <Flex
                  w="100%"
                  alignItems="center"
                  justifyContent="center"
                  direction={["column", "column", "row"]}
                  borderWidth="2px"
                  borderColor={lightOrangeColor}
                  borderRadius="30px"
                  bgColor="white"
                  textColor="black"
                  px={10}
                  py={6}
                >
                  <Text
                    display="block"
                    fontSize={["sm", "sm", "md", "md", null]}
                    textAlign={["center", "center", "left"]}
                    mr={[0, 0, 14]}
                    pb={[4, 4, 0]}
                    letterSpacing="tight"
                  >
                    {`Learn more about crypto, NFT and DAOs, find links to educational resources, discuss gaming projects, and laugh at memes.`}
                  </Text>

                  <Link isExternal href="https://discord.gg/K56VNUQGvA">
                    <Button variant="whiteOutline" color="orange.1000" borderColor="orange.1000">
                      Join our Discord
                    </Button>
                  </Link>
                </Flex>
              </GridItem>
            </Grid>
          </Flex>
        </Box>
      </Fade>
    </Suspense>
  );
};

export default Landing;
