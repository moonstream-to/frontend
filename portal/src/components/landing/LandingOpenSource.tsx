import { Flex, Link, Text, Image as ChakraImage, Button } from "@chakra-ui/react";
import { AWS_STATIC_ASSETS_PATH } from "../../constants";

const assets = {
  openSource: `${AWS_STATIC_ASSETS_PATH}/icons/open-source-icon.png`,
};

const LandingOpenSource = () => {
  return (
    <Flex
      direction="column"
      borderRadius="40px"
      border="1px solid white"
      py={{ base: "30px", sm: "40px 60px" }}
      my={{ base: "40px", sm: "80px" }}
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
          We build our technology in the open. Consider giving us a star on&nbsp;GitHub to support
          innovation in the web3 gaming space ⭐
        </Text>
      </Flex>
      <Flex direction={{ base: "column", sm: "row" }} gap="20px">
        <Link href="https://github.com/moonstream-to" isExternal>
          <Button variant="whiteOutline">Visit GitHub</Button>
        </Link>
      </Flex>
    </Flex>
  );
};

export default LandingOpenSource;
