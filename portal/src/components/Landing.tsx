import React, { Suspense, useEffect } from "react";
import { Fade, Flex, Box, Link, Text, Button, Center } from "@chakra-ui/react";

import TrustedBy from "./landing/TrustedBy";
import UpcomingIntegrations from "./landing/UpcomingIntegrations";
import LandingHeader from "./landing/LandingHeader";
import LandingFeatures from "./landing/LandingFeatures";
import LandingOpenSource from "./landing/LandingOpenSource";
import LandingWorkflow from "./landing/LandingWorkflow";
import LandingFAQ from "./landing/LandingFAQ";
import LandingFeaturedBy from "./landing/LandingFeaturedBy";
import Web3GamesList from "./landing/Web3GamesList";
import useUser from "../contexts/UserContext";
import router from "next/router";
import Hero from "./landing/Hero";
import TrustedBy2 from "./landing/TrustedByV2";
import ThreeSteps from "./landing/ThreeSteps";
import UseMoonstream from "./landing/UseMoonstream";
import OurClients from "./landing/OurClients";
import TryIt from "./landing/TryIt";

const Landing = () => {
  const lightOrangeColor = "#F56646";
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      router.push("/portal");
    }
  }, [user]);
  //TODO add fetching user to Suspense condition
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
          // px="7%"
        >
          <Flex
            direction="column"
            h="auto"
            position="relative"
            // maxW="1440px"
            // overflow="initial"
            mx="auto"
            pt={0}
            alignItems={"center"}
          >
            <Suspense fallback={""}></Suspense>
            <Hero />
            <TrustedBy2 />
            <LandingFeatures />
            <ThreeSteps />
            <UseMoonstream />
            <OurClients />
            <TryIt />
            <UpcomingIntegrations />
            <LandingHeader />
            <Flex py="0" gap="20px" direction="column">
              <TrustedBy />
            </Flex>
            <LandingOpenSource />
            <Web3GamesList />
            <LandingWorkflow />
            <LandingFAQ />
            <LandingFeaturedBy />
            <Flex
              py={{ base: "40px", sm: "80px" }}
              px="0"
              gap={{ base: "40px", sm: "60px" }}
              direction="column"
              alignItems="center"
            >
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
                p="40px"
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
            </Flex>
          </Flex>
        </Box>
      </Fade>
    </Suspense>
  );
};

export default Landing;
