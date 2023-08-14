import {
  Flex,
  Box,
  chakra,
  Stack,
  Link,
  Center,
  Text,
  Icon,
  Button,
  useMediaQuery,
  Image,
  Divider,
} from "@chakra-ui/react";
import { MdStarOutline } from "react-icons/md";
import { AWS_STATIC_ASSETS_PATH, DISCORD_LINK } from "../../constants";
import MoonstreamMetrics from "./MoonstreamMetrics";

const assets = {
  openSource: `${AWS_STATIC_ASSETS_PATH}/icons/open-source-icon.png`,
};

const LandingHeader = () => {
  const [is768View] = useMediaQuery(["(min-width: 768px)"]);

  return (
    <Flex
      align="center"
      justify="center"
      boxSize="full"
      flexDir="column"
      py={{ base: "40px", sm: "80px" }}
      gap={{ base: "40px", sm: "60px" }}
    >
      <Link
        isExternal
        href="https://github.com/moonstream-to/"
        _hover={{ textDecoration: "none" }}
        fontWeight="700"
        justifyItems="center"
      >
        <Flex
          border="1px solid white"
          justifySelf="center"
          borderRadius="10px"
          w="fit-content"
          mx="auto"
          alignItems="center"
          p="12px"
          gap="15px"
          h="55px"
        >
          <Image src={assets.openSource} h="30px" alt="" />
          <Text fontSize="18px">Open Source</Text>
          <Divider orientation="vertical" h="17px" color="#353535" />

          {is768View && <Icon as={MdStarOutline} w="28px" h="28px" />}
        </Flex>
      </Link>
      <Stack textAlign="center" alignItems="center" w="100%" gap={{ base: "20px", sm: "40px" }}>
        <Box fontSize={["30px", "30px", "50px"]} fontWeight="700" mt="0px" lineHeight="1">
          Infrastructure for Web3 {is768View && <br />} Game Economies
        </Box>
        <chakra.span
          fontSize={{ base: "16px", sm: "18px" }}
          display="inline-block"
          color="white"
          maxW={[null, "85%", "75%", "55%"]}
        >
          We build mechanisms that control web3 game economies. Create economic loops that reward
          your players with Moonstream’s analytics, leaderboards, and drops. Watch your game economy
          flourish.
        </chakra.span>
      </Stack>
      <Center>
        <Link isExternal href={DISCORD_LINK}>
          <Button variant="whiteOutline" px={["20px", "20px", "30px"]}>
            Join our Discord
          </Button>
        </Link>
      </Center>

      <MoonstreamMetrics />
    </Flex>
  );
};

export default LandingHeader;
