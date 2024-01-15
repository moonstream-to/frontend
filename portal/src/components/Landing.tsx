import router from "next/router";
import React, { Suspense, useEffect } from "react";
import { Fade, Flex, Text } from "@chakra-ui/react";

import LandingFeatures from "./landing/LandingFeatures";
import LandingFAQ from "./landing/LandingFAQ";
import useUser from "../contexts/UserContext";
import Hero from "./landing/Hero";
import TrustedBy2 from "./landing/TrustedByV2";
import ThreeSteps from "./landing/ThreeSteps";
import UseMoonstream from "./landing/UseMoonstream";
import OurClients from "./landing/OurClients";
import TryIt from "./landing/TryIt";
import BlackBlocks from "./landing/BlackBlocks";
import LandingFeaturedBy2 from "./landing/LandingFeaturedBy2";
import SupportedChains from "./landing/SupportedChains";
import OrangeSection from "./landing/OrangeSection";

const Landing = () => {
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
        <Flex
          direction="column"
          h="auto"
          position="relative"
          mx="auto"
          pt={0}
          alignItems={"center"}
        >
          <Suspense fallback={""}></Suspense>
          <Hero />
          <Text fontSize={{ base: "14px", sm: "16px" }} fontFamily={"Inter"} mb={"10px"}>
            Trusted by
          </Text>
          <TrustedBy2 />
          <LandingFeatures />
          <ThreeSteps />
          <UseMoonstream />
          <OurClients />
          <TryIt />
          <SupportedChains />
          <BlackBlocks />
          <LandingFAQ />
          <LandingFeaturedBy2 />
          <OrangeSection />
        </Flex>
      </Fade>
    </Suspense>
  );
};

export default Landing;
