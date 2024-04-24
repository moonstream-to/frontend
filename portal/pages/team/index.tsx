import React from "react";
import {
  Heading,
  Text,
  Flex,
  Link,
  Image as ChakraImage,
  Stack,
  chakra,
  UnorderedList,
  ListItem,
  Box,
  SimpleGrid,
  Center,
} from "@chakra-ui/react";
import TeamCard from "../../src/components/TeamCard";
import { AWS_STATIC_ASSETS_PATH } from "../../src/constants";
import LayoutLanding from "../../src/components/layoutLanding";
import styles from "./Team.module.css";

const TEAM_PATH = `${AWS_STATIC_ASSETS_PATH}/team`;

const assets = {
  rocket: `${TEAM_PATH}/rocket-w-background.png`,
  ant: `${TEAM_PATH}/ant.png`,
  bee: `${TEAM_PATH}/bee.png`,
  centipede: `${TEAM_PATH}/centipede.png`,
  firefly: `${TEAM_PATH}/firefly.png`,
  ladybug: `${TEAM_PATH}/ladybug.png`,
  locust: `${TEAM_PATH}/locust.png`,
  mantis: `${TEAM_PATH}/mantis.png`,
  scarab: `${TEAM_PATH}/scarab.png`,
  spider: `${TEAM_PATH}/carpenter-spider.png`,
  weta: `${TEAM_PATH}/weta.png`,
  dragonfly: `${TEAM_PATH}/dragonfly.png`,
  moth: `${TEAM_PATH}/moth.png`,
  rhino: `${TEAM_PATH}/rhino.png`,
};

const Team = () => {
  return (
    <LayoutLanding home={false} title="Moonstream: Team page">
      <Flex
        bgColor="transparent"
        minH="100vh"
        direction="column"
        alignItems="center"
        w="100%"
        maxW="1238"
        px={{ base: "3%", sm: "7%", md: "7%", l: "0" }}
        py="40px"
        mx="auto"
      >
        <Stack w="100%">
          <SimpleGrid
            alignItems="start"
            columns={{ base: 1, md: 2 }}
            mb={24}
            spacingY={{ base: 10, md: 32 }}
            spacingX={{ base: 10, md: 24 }}
          >
            <Box>
              <Heading as="h2" size="md" w="100%" py={6} borderTopRadius="xl">
                Meet The Moonstream Team
              </Heading>
              <chakra.span pl={2} py={2}>
                <Text mb={2}>
                  We are a distributed team of nerds with very strong expertise in math, software
                  engineering, machine learning, and cryptography. Members of our team worked at
                  Google, at OpenAI and other great companies.
                </Text>
                <Text mb={2}>
                  We believe that the crypto world opens opportunities for financial inclusion.
                  Meaning that people from all walks of life and financial situations can have a new
                  source of income. We are passionate about developing technology that helps people
                  become active participants in this field and take advantage of this opportunity.
                  We’re striving to debunk harmful stereotypes and make the crypto field more
                  inclusive.
                </Text>
              </chakra.span>
            </Box>
            <Center w="100%" h="100%" py={6}>
              <ChakraImage w="40%" src={assets["rocket"]} alt="rocket" />
            </Center>
          </SimpleGrid>
        </Stack>
        <Stack mb={6} mt={0} w="100%">
          <Heading as="h2" size="md" w="100%" pb={2} pt={0} borderTopRadius="xl">
            Values that we share within our team:
          </Heading>
          <chakra.span pl={2} py={2}>
            <UnorderedList w="75%" pl={4}>
              <ListItem>
                <b>Be bold</b>
              </ListItem>
              <ListItem>
                <b>Be curious</b>
              </ListItem>
              <ListItem>
                <b>Don’t be an ass</b>
              </ListItem>
              <ListItem>
                <b>And always be kind to each other</b>
              </ListItem>
            </UnorderedList>
            <Text my={2}>
              We are always looking to hire new talents, regardless of their backgrounds. If you are
              interested in working with us, send us a message at{" "}
              <Link textColor="orange.900" href="mailto: careers@moonstream.to">
                careers@moonstream.to
              </Link>
            </Text>
          </chakra.span>
        </Stack>
        <Stack mb={12} w="100%">
          <Heading as="h2" size="md" w="100%" py={2} borderTopRadius="xl">
            Our engineering team
          </Heading>
          <div className={styles.cardsContainer}>
            <TeamCard
              avatarURL={assets["ant"]}
              name={"Neeraj Kashyap"}
              atName={"@zomglings"}
              content={` Founder. Number theorist. Loves playing chess while programming. Fan of GO, backgammon, and video games.`}
            />
            <TeamCard
              avatarURL={assets["spider"]}
              name={"Sergei Sumarokov"}
              atName={"@kompotkot"}
              content={`Keeper of Secrets. Likes information
            security since childhood, loves mountains and goes hiking from
            time to time. Had a close call with a wild bear in a forest once.`}
            />
            <TeamCard
              avatarURL={assets["locust"]}
              name={"Andrey Dolgolev"}
              atName={"@Andrei-Dolgolev"}
              content={`Wizard. Loves mountains, bicycling, and
            hiking. A practicing Python wizard. Also likes to cook and play
            the guitar in between data witchcraft.`}
            />
            <TeamCard
              avatarURL={assets["scarab"]}
              name={"Kellan Wampler"}
              atName={"@wampleek"}
              content={`News junkie. Reformed mathematician. Fantasy Football enthusiast.
            Enjoys sudoku and its variants. Follows artificial intelligence scene for 
            Chess and Go. Experiments with grilling recipes.`}
            />
            <TeamCard
              avatarURL={assets["firefly"]}
              name={"Ishkhan Balgudanian"}
              atName={"@ishihssihshihishsi"}
              content={`Lighter. Designer to the bone. Constantly
            working on self-development. Sometimes plays guitar
            and ukulele. Loves meat, went from well done to blue
            rare in a few months.`}
            />
            <TeamCard
              avatarURL={assets["dragonfly"]}
              name={"Anton Mushnin"}
              atName={"@mumintrl"}
              content={`Interface enthusiast. Loves water to swim in, dive deep into, 
            yacht on, and drink (especially in wine). Chef - you 
            could see him baking crepes at the Parisian market. Passionate 
            about rugby and chess.`}
            />
          </div>
        </Stack>
        <Stack mb={12} w="100%">
          <Heading as="h2" size="md" w="100%" py={2} borderTopRadius="xl">
            Our marketing and growth team
          </Heading>
          <div className={styles.cardsContainer}>
            <TeamCard
              avatarURL={assets["ladybug"]}
              name={"Sophia Aryan"}
              atName={"@pahita"}
              content={`Dreamer. An alien who pretends to be a human.
            So far so good. Loves ecstatic dance, being alone in nature and
            dreaming.`}
            />
            <TeamCard
              avatarURL={assets["mantis"]}
              name={"Daria Navoloshnikova"}
              atName={"@in_technicolor"}
              content={`Mediator. Loves stand-up comedy and
            crying at nights. Volunteered at a horse farm once. Portrait
            artist, puts the pain in painting.`}
            />
            <TeamCard
              avatarURL={assets["bee"]}
              name={"Dasha Bochkareva"}
              atName={"@dashab"}
              content={`Born explorer. Always in search of something
            new to master. Enjoys being close to the sea. Loves yoga, 
            dogs and dancing. Can walk 30km when under stress.`}
            />
            <TeamCard
              avatarURL={assets["moth"]}
              name={"Ceilidh Orr"}
              atName={"@ceilidh(0727)"}
              content={`Storyteller. Deposed scholar turned labyrinth keeper. Enjoys long, impenetrable novels and deep-dives into the arcana of sci-fi and fantasy worlds. Growing a love of in-game herbs and potions into a real-life garden.`}
            />
            <TeamCard
              avatarURL={assets["rhino"]}
              name={"Manuel Olumorin"}
              atName={"@manuelo"}
              content={`Sage. Loves listening to music, admiring imposing structures, both natural and man-made, and searching for the new. Can get lost in hypothetical conversations.
`}
            />
          </div>
        </Stack>
      </Flex>
    </LayoutLanding>
  );
};

export default Team;
