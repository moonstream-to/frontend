import React, { Suspense } from "react";
import { Fade, Flex, Box, Link, Text, Button, Image, Divider, Icon } from "@chakra-ui/react";

import TrustedBy from "./landing/TrustedBy";
import UpcomingIntegrations from "./landing/UpcomingIntegrations";
import LandingHeader from "./landing/LandingHeader";
import LandingFeatures from "./landing/LandingFeatures";
import LandingOpenSource from "./landing/LandingOpenSource";
import LandingWorkflow from "./landing/LandingWorkflow";
import LandingFAQ from "./landing/LandingFAQ";
import LandingFeaturedBy from "./landing/LandingFeaturedBy";

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
            // justifyContent="center"
            // alignItems="center"
          >
            <Suspense fallback={""}></Suspense>
            <LandingHeader />
            <Flex py="0" gap="20px" direction="column">
              <TrustedBy />
              <UpcomingIntegrations />
            </Flex>
            <LandingFeatures />
            <LandingOpenSource />
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
