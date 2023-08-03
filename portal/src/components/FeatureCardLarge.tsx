import {
  chakra,
  Heading,
  Flex,
  VStack,
  Image as ChakraImage,
  Grid,
  GridItem,
  Center,
  Link,
  FlexProps,
} from "@chakra-ui/react";

const HEADING_PROPS = {
  fontWeight: "700",
  fontSize: ["4xl", "5xl", "5xl", "5xl", "6xl", "7xl"],
};
interface FeatureCardLargeProps extends FlexProps {
  headingText: string;
  cardOrder: number;
  isMobile: boolean;
  image: string;
  heading?: string;
}

const FeatureCardLarge: React.FC<FeatureCardLargeProps> = ({
  headingText,
  cardOrder,
  isMobile,
  image,
  ...props
}) => {
  return (
    <Flex pt={12} {...props}>
      <Grid
        templateColumns={{
          base: "repeat(1, 1fr)",
          sm: "repeat(1, 1fr)",
          md: "repeat(2, 1fr)",
        }}
        gap={4}
      >
        <GridItem order={1}>
          <VStack display="inline-grid">
            <Heading as={"h2"} {...HEADING_PROPS} pb={[3, 12, null]} pt={0}>
              {headingText}
            </Heading>
            <chakra.span
              fontSize={["md", "md", "lg", "lg", "lg", "xl"]}
              display="inline-block"
              textAlign="left"
            >
              {props.children}
            </chakra.span>
          </VStack>
        </GridItem>
        <GridItem
          order={[2, 2, 2, 2 * cardOrder]}
          justifyContent="right"
          alignContent="center"
          h="auto"
        >
          <Center flexDirection="column">
            {isMobile && (
              <Link
                href="https://discord.gg/K56VNUQGvA"
                fontWeight="semibold"
                textDecoration="underline"
                isExternal
              >
                Learn More
              </Link>
            )}
            <ChakraImage
              boxSize={["220px", "md", "md", null, "lg"]}
              objectFit="contain"
              src={image}
            />
          </Center>
        </GridItem>
      </Grid>
    </Flex>
  );
};

export default FeatureCardLarge;
