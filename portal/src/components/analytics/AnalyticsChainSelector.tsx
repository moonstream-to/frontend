import { Image } from "@chakra-ui/image";
import { Flex, Text } from "@chakra-ui/layout";
import { useEffect } from "react";
import { ChainName, getChainImage } from "../../constants";
import useAnalytics from "../../contexts/AnalyticsContext";
// const chainNames: ChainName[] = ["ethereum", "polygon", "mumbai", "gnosis", "wyrm"];

const AnalyticsChainSelector = ({
  selectedChain,
  setSelectedChain,
}: {
  selectedChain: string;
  setSelectedChain: (arg0: string) => void;
}) => {
  const { blockchains } = useAnalytics();
  useEffect(() => {
    if (selectedChain === "" && blockchains.data) {
      setSelectedChain(blockchains.data[0].name);
    }
  }, []);
  if (!blockchains.data) {
    return <></>;
  }
  return (
    <Flex wrap="wrap" gap="10px" borderBottom="1px solid #4c4c4c" w="fit-content" p="0">
      {blockchains.data.map(
        (chain: { name: string; displayName: string; image: string }, idx: number) => (
          <Flex
            key={idx}
            borderBottom="1px solid"
            borderColor={selectedChain === chain.name ? "white" : "transparent"}
            display="inline-flex"
            alignItems="center"
            gap="3px"
            p="8px 15px"
            cursor="pointer"
            onClick={() => setSelectedChain(chain.name)}
          >
            {getChainImage(chain.name) && (
              <Image alt="" src={getChainImage(chain.name)} h="20px" filter="invert(100%)" />
            )}
            <Text fontSize="14px" lineHeight="18px">
              {chain.displayName}
            </Text>
          </Flex>
        ),
      )}
    </Flex>
  );
};

export default AnalyticsChainSelector;
