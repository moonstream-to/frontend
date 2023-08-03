import { Flex, Text } from "@chakra-ui/react";

const MoonstreamMetrics = ({ ...props }) => {
  const content = [
    {
      n: ">2m",
      d1: "mainnet transactions",
      d2: "supported",
    },
    {
      n: ">$10m",
      d1: "transaction volume through our",
      d2: "smart contracts",
    },
    {
      n: ">50k",
      d1: "players received",
      d2: "token drops",
    },
  ];
  const Metric = ({ number, line1, line2 }: { number: string; line1: string; line2: string }) => {
    return (
      <Flex
        direction={{ base: "column", md: "row" }}
        gap={{ base: "10px", sm: "20px" }}
        justifyContent="center"
        alignItems="center"
      >
        <Text fontSize={{ base: "24px", sm: "40px" }} fontWeight="500">
          {number}
        </Text>
        <Text fontSize={{ base: "14px", sm: "18px" }} textAlign={{ base: "center", md: "left" }}>
          {line1}
          <br />
          {line2}
        </Text>
      </Flex>
    );
  };
  return (
    <Flex
      wrap="wrap"
      rowGap="20px"
      columnGap={{ base: "20px", sm: "40px" }}
      justifyContent="center"
      alignItems="center"
    >
      {content.map((metric, idx) => (
        <Metric key={idx} number={metric.n} line1={metric.d1} line2={metric.d2} />
      ))}
    </Flex>
  );
};

export default MoonstreamMetrics;
