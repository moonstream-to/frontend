import { Image } from "@chakra-ui/image";
import { Flex, Text } from "@chakra-ui/layout";
import { useEffect } from "react";
import { ChainName, getChainImage } from "../../constants";
const chainNames: ChainName[] = ["ethereum", "polygon", "mumbai", "xdai", "wyrm"];

const AnalyticsChainSelector = ({
  selectedChain,
  setSelectedChain,
}: {
  selectedChain: string;
  setSelectedChain: (arg0: string) => void;
}) => {
  useEffect(() => {
    if (selectedChain === "") {
      setSelectedChain(chainNames[0]);
    }
  }, []);
  return (
    <Flex wrap="wrap" gap="10px" borderBottom="1px solid #4c4c4c" w="fit-content" p="0">
      {chainNames.map((n, idx: number) => (
        <Flex
          key={idx}
          borderBottom="1px solid"
          borderColor={selectedChain === n ? "white" : "transparent"}
          display="inline-flex"
          alignItems="center"
          gap="3px"
          p="8px 15px"
          cursor="pointer"
          onClick={() => setSelectedChain(n)}
        >
          <Image alt="" src={getChainImage(n)} h="20px" filter="invert(100%)" />
          <Text fontSize="14px" lineHeight="18px" textTransform="uppercase">
            {n}
          </Text>
        </Flex>
      ))}
    </Flex>
  );
};

export default AnalyticsChainSelector;
