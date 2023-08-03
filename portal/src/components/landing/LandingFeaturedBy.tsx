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
  useMediaQuery,
} from "@chakra-ui/react";
import { AWS_STATIC_ASSETS_PATH } from "../../constants";

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

const LandingFeaturedBy = () => {
  return (
    <Flex
      py={{ base: "40px", sm: "80px" }}
      px="0"
      gap={{ base: "40px", sm: "60px" }}
      direction="column"
      alignItems="center"
    >
      <Text fontSize={{ base: "30px", sm: "40px" }} fontWeight="700">
        Featured by
      </Text>
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
    </Flex>
  );
};

export default LandingFeaturedBy;
