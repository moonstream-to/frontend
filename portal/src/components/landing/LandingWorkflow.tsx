import { Flex, chakra, Link, Center, Text, Icon } from "@chakra-ui/react";
import { HiOutlineChatAlt2 } from "react-icons/hi";
import { DISCORD_LINK } from "../../constants";

const step = (i: number) => {
  const gradient =
    "linear-gradient(92.04deg, #FFD337 36.28%, rgba(48, 222, 76, 0.871875) 43.18%, rgba(114, 162, 255, 0.91) 50.43%, rgba(255, 160, 245, 0.86) 55.02%, rgba(255, 101, 157, 0.71) 60.64%, rgba(255, 97, 154, 0.59) 64.7%), #1A1D22;";
  const content = [
    "So you decided to build a healthy economy on the blockchain. You are on the rightpath, traveler!",
    "",
    "Onboard and create utility for your web3 game integration. Moonstream has the best tools for game design to get you started.",
    "You're at the end of your blockchain development journey now, traveler. Time to watch your game economy grow!",
  ];
  const step2 = (
    <Flex>
      <chakra.span fontSize="18px" display="inline-block">
        Reach out to us on{" "}
        <Link
          isExternal
          href={DISCORD_LINK}
          textDecoration="underline"
          _hover={{ color: "accent.500" }}
        >
          Discord
        </Link>
        . We&apos;ll get back to you within 3 days to schedule a call or make a partnership
        proposal.
      </chakra.span>
    </Flex>
  );
  return (
    <Flex direction="column" gap="40px" key={i} textAlign="center">
      <Text fontSize="24px" fontWeight="700">
        {i < 3 ? (
          `Step ${i + 1}`
        ) : (
          <Center
            w="100%"
            bg="linear-gradient(92.04deg, #FFD337 36.28%, rgba(48, 222, 76, 0.871875) 43.18%, rgba(114, 162, 255, 0.91) 50.43%, rgba(255, 160, 245, 0.86) 55.02%, rgba(255, 101, 157, 0.71) 60.64%, rgba(255, 97, 154, 0.59) 64.7%), #1A1D22;"
            backgroundClip="text"
          >
            Enjoy
          </Center>
        )}
      </Text>
      {i === 1 ? step2 : <Text fontSize="18px">{content[i]}</Text>}
    </Flex>
  );
};

const LandingWorkflow = () => {
  return (
    <Flex
      py={{ base: "40px", sm: "80px" }}
      px="0"
      gap={{ base: "40px", sm: "60px" }}
      direction="column"
      alignItems="center"
    >
      <Text fontSize={{ base: "30px", sm: "40px" }} fontWeight="700">
        Our Workflow
      </Text>
      <Flex gap="40px" direction={{ base: "column", sm: "row" }}>
        {[0, 1, 2, 3].map((i) => step(i))}
      </Flex>
      <Center>
        <Icon as={HiOutlineChatAlt2} w={6} h={6} mr={2}></Icon>
        <Text fontSize="18px">
          Have something to discuss before signing up?{" "}
          <Link href="https://discord.gg/K56VNUQGvA" isExternal>
            <u>Join our Discord</u>{" "}
          </Link>
          to get in touch with the team (@zomglings).
        </Text>
      </Center>
    </Flex>
  );
};

export default LandingWorkflow;
