import RouterLink from "next/link";
import React, { Suspense } from "react";
import NextLink from "next/link";
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
  Spacer,
  SimpleGrid,
  Button,
} from "@chakra-ui/react";
import { HiOutlineChatAlt2 } from "react-icons/hi";

import TrustedBadge from "./TrustedBadge";
import FAQCard from "./FAQCard";
import { AWS_STATIC_ASSETS_PATH } from "../constants";

const HEADING_PROPS = {
  fontWeight: "700",
  fontSize: ["4xl", "5xl", "5xl", "5xl", "6xl", "7xl"],
};

const assets = {
  airdrop: `${AWS_STATIC_ASSETS_PATH}/airdrop.png`,
  arbitrum: `${AWS_STATIC_ASSETS_PATH}/arbitrum_logo.png`,
  background720: `${AWS_STATIC_ASSETS_PATH}/background720.png`,
  background1920: `${AWS_STATIC_ASSETS_PATH}/background720.png`,
  background2880: `${AWS_STATIC_ASSETS_PATH}/background720.png`,
  background3840: `${AWS_STATIC_ASSETS_PATH}/background720.png`,
  bc101: `${AWS_STATIC_ASSETS_PATH}/featured_by/blockchain-101-white.png`,
  bulliverse: `${AWS_STATIC_ASSETS_PATH}/bullieverse_logo.png`,
  cgcConference: `${AWS_STATIC_ASSETS_PATH}/featured_by/cgc_conference_2022_logo.jpg`,
  championsAscension: `${AWS_STATIC_ASSETS_PATH}/featured_by/champions.png`,
  cointelegraph: `${AWS_STATIC_ASSETS_PATH}/featured_by/cointelegraph-white.png`,
  craftingRecipe: `${AWS_STATIC_ASSETS_PATH}/crafting-recipe.png`,
  cryptoGuilds: `${AWS_STATIC_ASSETS_PATH}/crypto_guilds_logo.png`,
  cryptoinsiders: `${AWS_STATIC_ASSETS_PATH}/featured_by/crypto-insiders-white.png`,
  cryptoslate: `${AWS_STATIC_ASSETS_PATH}/featured_by/cryptoslate-white.png`,
  cryptoUnicorns: `${AWS_STATIC_ASSETS_PATH}/crypto_unicorns_logo.png`,
  educativesessions: `${AWS_STATIC_ASSETS_PATH}/featured_by/educative-white.png`,
  ethereum_blockchain: `${AWS_STATIC_ASSETS_PATH}/ethereum_blockchain_logo.png`,
  evmos: `${AWS_STATIC_ASSETS_PATH}/evmos_logo.png`,
  forte: `${AWS_STATIC_ASSETS_PATH}/forte_logo.png`,
  game7io: `${AWS_STATIC_ASSETS_PATH}/featured_by/game7io_logo.png`,
  gnosis: `${AWS_STATIC_ASSETS_PATH}/gnosis_chain_logo.png`,
  laguna: `${AWS_STATIC_ASSETS_PATH}/featured_by/laguna_logo.svg`,
  meetup: `${AWS_STATIC_ASSETS_PATH}/featured_by/meetup-white.png`,
  minigame: `${AWS_STATIC_ASSETS_PATH}/minigame.png`,
  openLootbox: `${AWS_STATIC_ASSETS_PATH}/open-lootbox.png`,
  optimism: `${AWS_STATIC_ASSETS_PATH}/optimism_logo.png`,
  orangedao: `${AWS_STATIC_ASSETS_PATH}/featured_by/orangedao_logo.png`,
  polygon: `${AWS_STATIC_ASSETS_PATH}/polygon_blockchain_logo.png`,
  tech_crunch_winner: `${AWS_STATIC_ASSETS_PATH}/tc_crypto_sessions_transparent.png`,
};

const Landing = () => {
  const lightOrangeColor = "#F56646";
  const cardBackgroundColor = "#353535";

  const Feature = ({
    title,
    altText,
    image,
    href,
  }: {
    title: string;
    altText: string;
    image: string;
    href: string;
  }) => {
    return (
      <Box>
        <RouterLink href={href}>
          <Stack
            h="100%"
            transition={"1s"}
            p={4}
            alignItems="center"
            borderRadius="12px"
            borderColor="white"
            bgColor={cardBackgroundColor}
            borderWidth={"1px"}
            _hover={{ transform: "scale(1.05)", transition: "0.42s" }}
            cursor="pointer"
          >
            <ChakraImage objectFit="contain" src={image} alt={altText} />
            <Heading
              textAlign="center"
              fontSize={["md", "md", "lg", "lg", null]}
              fontWeight="normal"
            >
              {title}
            </Heading>
          </Stack>
        </RouterLink>
      </Box>
    );
  };

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
                        <Link
                          mb={["40px", "40px", "60px"]}
                          isExternal
                          href="https://www.crypto-reporter.com/press-releases/moonstream-to-wins-techcrunch-pitch-off-earning-a-spot-at-disrupt-2023-39287/
                      "
                        >
                          <ChakraImage
                            src={assets.tech_crunch_winner}
                            w={["213px", "213px", "272px"]}
                            h={["49px", "49px", "59px"]}
                            cursor="pointer"
                            bg="#46C370"
                            borderRadius="10px"
                            _hover={{
                              bg: "#3BB563",
                            }}
                          />
                        </Link>
                        <Box
                          fontSize={["30px", "30px", "50px"]}
                          fontWeight="700"
                          maxW="613px"
                          mt="0px"
                        >
                          Build, Scale, and Monitor Your Game&apos;s Economy
                        </Box>
                        <chakra.span
                          pb={[2, 6]}
                          fontSize={["md", "md", "md", "md", null]}
                          display="inline-block"
                          color="white"
                          maxW={[null, "85%", "75%", "55%"]}
                        >
                          Moonstream provides economic infrastructure for web3 games. Gather
                          actionable data with our web3 data analytics. Act on it with our on-chain
                          mechanics. Watch your economy flourish.
                        </chakra.span>
                        <Stack
                          direction={["column", "row", "row", "row", "row", "row"]}
                          pb={10}
                          fontSize={["16px", "16px", "20px"]}
                        >
                          <Center>
                            {/* <RouterLink href="/contact">
                              <Button variant="orangeGradient" px={["20px", "20px", "30px"]}>
                                Get Started
                              </Button>
                            </RouterLink> */}
                          </Center>
                          <Center>
                            <Link isExternal href="https://discord.gg/K56VNUQGvA">
                              <Button variant="whiteOutline" px={["20px", "20px", "30px"]}>
                                Join our Discord
                              </Button>
                            </Link>
                          </Center>
                        </Stack>
                      </Stack>
                      <Grid
                        maxW="737px"
                        textAlign={["center", "center", "left"]}
                        gridTemplateColumns={["1fr 1fr", "1fr 1fr", "auto auto"]}
                        gridGap={["20px", "20px", "40px"]}
                      >
                        <Flex direction={["column", "column", "row"]} minW={["50%", "50%", "0px"]}>
                          <Text
                            fontSize={["24", "24", "40"]}
                            fontWeight="500"
                            pr={["0px", "0px", "20px"]}
                          >
                            &gt;$4b
                          </Text>
                          <Center>
                            <Text
                              fontSize={["14px", "14px", "18px"]}
                              lineHeight={["18px", "18px", "23px"]}
                            >
                              transaction volume
                              <br />
                              and growing
                            </Text>
                          </Center>
                        </Flex>
                        <Flex direction={["column", "column", "row"]}>
                          <Text
                            fontSize={["24", "24", "40"]}
                            fontWeight="500"
                            pr={["0px", "0px", "20px"]}
                          >
                            &gt;44k
                          </Text>
                          <Center>
                            <Text
                              fontSize={["14px", "14px", "18px"]}
                              lineHeight={["18px", "18px", "23px"]}
                            >
                              active users in game economies
                              <br />
                              built with our engine
                            </Text>
                          </Center>
                        </Flex>
                      </Grid>
                    </Flex>
                  </Box>
                </chakra.header>
              </GridItem>

              <GridItem py={[4, 8]} colSpan={12}>
                <VStack bgColor="white" rounded="3xl" textColor="#1A1D22" py={10}>
                  <Heading
                    as="h3"
                    {...HEADING_PROPS}
                    fontSize={["2xl", null]}
                    fontWeight="semibold"
                    textAlign="center"
                    px="20px"
                  >
                    <Text>Trusted by visionaries</Text>
                    <Text>in the industry</Text>
                  </Heading>
                  <Flex wrap="wrap" direction="row" justifyContent="center" pb={[4, 10]}>
                    <Suspense fallback={""}>
                      <TrustedBadge
                        scaling={0.8}
                        name="Champions Ascension"
                        ImgURL={assets["championsAscension"]}
                        boxURL="https://www.champions.io/"
                      />
                      <TrustedBadge
                        scaling={0.8}
                        name="Crypto Guilds"
                        ImgURL={assets["cryptoGuilds"]}
                        boxURL="https://crypto-guilds.com/"
                      />
                      <TrustedBadge
                        scaling={0.8}
                        name="Crypto Unicorns"
                        ImgURL={assets["cryptoUnicorns"]}
                        boxURL="https://www.cryptounicorns.fun/"
                      />
                      <TrustedBadge
                        scaling={0.8}
                        name="game7io"
                        ImgURL={assets["game7io"]}
                        boxURL="https://game7.io/"
                      />
                      <TrustedBadge
                        scaling={0.8}
                        name="orangedao"
                        ImgURL={assets["orangedao"]}
                        boxURL="https://lfg.orangedao.xyz/"
                      />
                    </Suspense>
                  </Flex>
                  <Heading
                    as="h3"
                    {...HEADING_PROPS}
                    fontSize={["2xl", null]}
                    fontWeight="semibold"
                    textAlign="center"
                    px="20px"
                  >
                    Supported blockchains
                  </Heading>
                  <Flex wrap="wrap" direction="row" justifyContent="center" pb={[4, 10]}>
                    <Suspense fallback={""}>
                      <TrustedBadge
                        scaling={0.5}
                        pt="10px"
                        name="polygon"
                        ImgURL={assets["polygon"]}
                        boxURL="https://polygon.technology/"
                      />
                      <TrustedBadge
                        scaling={0.8}
                        name="ethereum"
                        ImgURL={assets["ethereum_blockchain"]}
                        boxURL="https://ethereum.org/"
                      />
                      <TrustedBadge
                        scaling={0.6}
                        pt="8px"
                        name="gnosis"
                        ImgURL={assets["gnosis"]}
                        boxURL="https://gnosis.io/"
                      />
                    </Suspense>
                  </Flex>
                  <Heading
                    as="h3"
                    {...HEADING_PROPS}
                    fontSize={["2xl", null]}
                    fontWeight="semibold"
                    textAlign="center"
                    px="20px"
                  >
                    Upcoming Integrations
                  </Heading>
                  <Flex wrap="wrap" direction="row" justifyContent="center">
                    <Suspense fallback={""}>
                      <TrustedBadge
                        scaling={0.8}
                        name="forte"
                        ImgURL={assets["forte"]}
                        boxURL="https://www.forte.io/"
                      />
                      <TrustedBadge
                        scaling={0.6}
                        name="optimism"
                        ImgURL={assets["optimism"]}
                        boxURL="https://www.optimism.io/"
                      />
                      <TrustedBadge
                        scaling={0.6}
                        name="evmos"
                        ImgURL={assets["evmos"]}
                        boxURL="https://evmos.org/"
                      />
                      <TrustedBadge
                        scaling={0.6}
                        name="arbitrum"
                        ImgURL={assets["arbitrum"]}
                        boxURL="https://bridge.arbitrum.io/"
                      />
                    </Suspense>
                  </Flex>
                </VStack>
              </GridItem>
              <GridItem colSpan={12} pt={12} textColor="white">
                <Heading {...HEADING_PROPS} textAlign="center" pb={6} as="h2">
                  Features
                </Heading>
                <Center fontSize={["md", "md", null]} py={4}>
                  <VStack>
                    <Text textAlign="center" display="inline-block" w={["100%", "100%", "70%"]}>
                      Lootboxes, crafting recipes, deck building, you name it! With Moonstream
                      Engine you can deploy on-chain mechanics with one click. Read our Use Cases or
                      explore the features to know more.
                    </Text>
                  </VStack>
                </Center>
                <SimpleGrid
                  columns={[2, 2, 4, null]}
                  justifyContent={["flex-end", "flex-end", "center"]}
                  w="100%"
                  spacing={["20px", "20px", "40px"]}
                  paddingTop="20px"
                >
                  <Feature
                    title="Assemble Lootboxes"
                    altText="Lootboxes"
                    image={assets["openLootbox"]}
                    href="/features/#lootboxes"
                  />
                  <Feature
                    title="Create Crafting Recipes"
                    altText="Crafting Recipes"
                    image={assets["craftingRecipe"]}
                    href="/features/#crafting"
                  />
                  <Feature
                    title="Deploy Minigames"
                    altText="Minigames"
                    image={assets["minigame"]}
                    href="/features/#minigames"
                  />
                  <Feature
                    title="Manage Airdrops"
                    altText="Airdrops"
                    image={assets["airdrop"]}
                    href="/features/#airdrops"
                  />
                </SimpleGrid>
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
                        Sign up to get whitelisted. We&apos;ll reach out to you within 3 days to
                        schedule a call or make a partnership proposal.
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
                        During onboarding pick game mechanics that you&apos;d like to deploy.
                        Moonstream Engine provides you with back-end tools to put them on the
                        blockchain.
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
              <GridItem py={[4, 10]} colSpan={12}>
                <Heading {...HEADING_PROPS} textAlign="center" as="h2" pb={10}>
                  FAQ
                </Heading>
                <Accordion defaultIndex={[-1]} allowMultiple allowToggle>
                  <FAQCard
                    heading="I’m a game designer. What can Moonstream engine do for me?"
                    headingProps={HEADING_PROPS}
                    panelContent={
                      <>
                        {" "}
                        Moonstream is a hassle-free way to ultimate game design and superb user
                        experience. You’ll be able to add on-chain mechanics from our web app into
                        your project within a click.
                        <br />
                        <br />
                        Imagine you had a menu of ready-to-use game functionalities... That’s what
                        Moonstream Engine is about.
                      </>
                    }
                  />
                  <FAQCard
                    heading="What on-chain mechanics are we talking about?"
                    headingProps={HEADING_PROPS}
                    panelContent={
                      <>
                        {" "}
                        Use Moonstream to add minigames, in-game items, airdrops, lootboxes, loyalty
                        programs, leaderboards, crafting, and some other mechanics into your game.
                        If you want to add something that’s not on the list - feel free to discuss
                        it with the team.
                        <br />
                        <br />
                        Once you contact us to discuss your project, we’ll provide you with options.
                      </>
                    }
                  />
                  <FAQCard
                    heading="I’m a game developer. How will I benefit?"
                    headingProps={HEADING_PROPS}
                    panelContent={
                      <>
                        {" "}
                        Moonstream removes the complexity of smart contact development. It will save
                        you weeks of time. Moonstream Engine is your backend.
                        <br />
                        <br />
                        You can find code examples below on this page. Integration is easy even if
                        you have no experience with web3.
                      </>
                    }
                  />
                  <FAQCard
                    heading="Is it free?"
                    headingProps={HEADING_PROPS}
                    panelContent={
                      <>
                        {" "}
                        Everything we build is open source and free to self-host or modify.
                        <Link
                          href="https://github.com/bugout-dev/moonstream"
                          textColor="white"
                          isExternal
                        >
                          {" "}
                          <u>Here&apos;s</u>{" "}
                        </Link>
                        our GitHub. We’ll be happy to help you get set up.
                        <br />
                        <br />
                        We also have a managed option, where we manage the smart contracts and the
                        APIs. This is free for indie projects. For larger projects, please reach out
                        to @zomglings on Discord for a quote.
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
                        <br />
                        <br />
                        We’re working on V2 of the dataset above. You can collaborate with us and
                        become a co-author, just @moonstream on Discord to connect with the team.{" "}
                        <Link
                          href="https://scratched-molybdenum-f03.notion.site/NFT-dataset-v2-33a2900cce3840c0bc048bbc4a0425f8"
                          isExternal
                        >
                          <u>Here</u>
                        </Link>{" "}
                        you can find sample V2 datasets.
                      </>
                    }
                  />
                  <FAQCard
                    heading="What is the Sign Up button for?"
                    headingProps={HEADING_PROPS}
                    panelContent={
                      <>
                        One of the tools we built is the Analytics platform. With it game designers,
                        developers, data scientists and crypto enthusiasts can create dashboards to
                        track on-chain activity and gain insights into web3 economy and its health.
                        <br />
                        <br />
                        <Link
                          href="https://voracious-gerbil-120.notion.site/Creating-dashboard-for-a-smart-contract-288b1bfa64984b109b79895f69129fce"
                          isExternal
                        >
                          <u>Here&apos;s</u>
                        </Link>{" "}
                        a tutorial on how to use the tool.
                        <br />
                        <br />
                        You can get access to our analytics platform by signing up for a Moonstream
                        account on our website. It’s free.
                      </>
                    }
                  />
                  <FAQCard
                    heading="I’m a player. Does Moonstream have anything for me?"
                    headingProps={HEADING_PROPS}
                    panelContent={
                      <>
                        The next big thing coming out soon is for players.{" "}
                        <Link href="https://discord.gg/K56VNUQGvA">
                          <u>Join us on Discord</u>{" "}
                        </Link>
                        for early access.
                      </>
                    }
                  />
                </Accordion>
              </GridItem>
              <GridItem py={10} colSpan={12} textColor="white">
                <Heading
                  as="h2"
                  {...HEADING_PROPS}
                  textAlign="center"
                  pb={10}
                  fontWeight="semibold"
                >
                  Featured by{" "}
                </Heading>
                <Center>
                  <Flex
                    wrap="wrap"
                    direction="row"
                    rounded={["lg", "xl", "2xl", "3xl", "4xl", "4xl"]}
                    justifyContent="center"
                  >
                    <Suspense fallback={""}>
                      <TrustedBadge
                        scaling={0.7}
                        name="cointelegraph"
                        caseURL=""
                        ImgURL={assets["cointelegraph"]}
                        boxURL="https://cointelegraph.com/news/17-of-addresses-snapped-up-80-of-all-ethereum-nfts-since-april"
                      />
                      <TrustedBadge
                        scaling={0.5}
                        name="CryptoInsiders"
                        ImgURL={assets["cryptoinsiders"]}
                        boxURL="https://www.crypto-insiders.nl/nieuws/altcoin/17-van-ethereum-whales-bezitten-meer-dan-80-van-alle-nfts-op-de-blockchain/"
                      />
                      <TrustedBadge
                        scaling={0.5}
                        name="cryptoslate"
                        ImgURL={assets["cryptoslate"]}
                        boxURL="https://cryptoslate.com/should-investors-care-80-of-all-nfts-belong-to-17-of-addresses/"
                      />
                      <TrustedBadge
                        scaling={0.7}
                        name="bc101"
                        ImgURL={assets["meetup"]}
                        boxURL="https://www.meetup.com/SF-Bay-Area-Data-Science-Initiative/events/283215538/"
                      />
                      <TrustedBadge
                        name="educative sessions"
                        scaling={0.5}
                        ImgURL={assets["educativesessions"]}
                        boxURL="https://youtu.be/DN8zRzJuy0M"
                      />
                      <TrustedBadge
                        scaling={0.5}
                        name="bc101"
                        ImgURL={assets["bc101"]}
                        boxURL="https://blockchain101.com/"
                      />
                      <TrustedBadge
                        scaling={0.5}
                        name="cgc2022"
                        ImgURL={assets["cgcConference"]}
                        boxURL="https://www.cgc.one/"
                      />
                    </Suspense>
                  </Flex>
                </Center>
              </GridItem>
              <GridItem pt={10} pb={20} colSpan={12}>
                <Stack
                  direction={["column", "column", "row"]}
                  alignItems="center"
                  bgColor={lightOrangeColor}
                  borderWidth="2px"
                  borderColor="white"
                  borderRadius="30px"
                  textColor="white"
                  px={[0, 10]}
                  py={6}
                  mb={8}
                >
                  <Box>
                    <Heading
                      as="h2"
                      fontSize={["4xl", "4xl", null]}
                      letterSpacing="wide"
                      px={2}
                      pb={1}
                      textAlign={["center", "center", "left"]}
                    >
                      Sign up to grow your economy
                    </Heading>
                    <Text
                      fontSize={["sm", "sm", "md", "md", null]}
                      px={2}
                      py={4}
                      textAlign={["center", "center", "left"]}
                    >
                      {`Answer 5 questions about your project to get whitelisted.`}
                    </Text>
                  </Box>
                  <Spacer />
                  <NextLink href="/contact">
                    <Button variant="solidWhite">Boost my game economy</Button>
                  </NextLink>
                </Stack>
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
