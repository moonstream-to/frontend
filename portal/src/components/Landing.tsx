import React, { Suspense, useEffect } from "react";
import { Fade, Flex, Box, Link, Button, Center, Text } from "@chakra-ui/react";
import LandingFeatures from "./landing/LandingFeatures";
import LandingFAQ from "./landing/LandingFAQ";
import useUser from "../contexts/UserContext";
import router from "next/router";
import Hero from "./landing/Hero";
import TrustedBy2 from "./landing/TrustedByV2";
import ThreeSteps from "./landing/ThreeSteps";
import UseMoonstream from "./landing/UseMoonstream";
import OurClients from "./landing/OurClients";
import TryIt from "./landing/TryIt";
import BlackBlocks from "./landing/BlackBlocks";
import LandingFeaturedBy2 from "./landing/LandingFeaturedBy2";
import SupportedChains from "./landing/SupportedChains";
import styles from "./common.module.css";

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
        {/*<Box*/}
        {/*  width="100%"*/}
        {/*  flexDirection="column"*/}
        {/*  sx={{ scrollBehavior: "smooth" }}*/}
        {/*  bgSize="cover"*/}
        {/*  id="page:landing"*/}
        {/*  textColor="white"*/}
        {/*  // px="7%"*/}
        {/*>*/}
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
          <Flex
            py={"20px"}
            px={{ base: "7%", xl: "101px" }}
            gap={{ base: "40px", sm: "60px" }}
            direction="column"
            alignItems="center"
            bgColor="#F56646"
            w={"100%"}
            borderTop={"2px solid white"}
            borderBottom={"1px solid white"}
          >
            <Flex
              w="100%"
              alignItems="center"
              justifyContent="space-between"
              direction={["column", "column", "row"]}
              borderWidth="2px"
              borderColor={lightOrangeColor}
              textColor="white"
              maxW={"1238px"}
              // p="40px"
              gap={"20px"}
            >
              <Text
                display="block"
                fontSize={{ base: "16px", sm: "18px" }}
                textAlign={["center", "center", "left"]}
                letterSpacing="tight"
                maxW={"630px"}
                fontWeight={"500"}
                fontFamily={"Inter"}
              >
                {`Get technical support, showcase your web3 game, discuss web3 projects and gaming, meme and chat.`}
              </Text>

              <Link isExternal href="https://discord.gg/K56VNUQGvA">
                <button className={styles.secondaryButton}>Join our Discord</button>
              </Link>
            </Flex>
          </Flex>
        </Flex>
        {/*</Box>*/}
      </Fade>
    </Suspense>
  );
};

export default Landing;
