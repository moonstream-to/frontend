import { Image } from "@chakra-ui/image";
import { Flex, Text } from "@chakra-ui/layout";
import { useEffect } from "react";
import { getChainImage } from "../../constants";
import useAnalytics from "../../contexts/AnalyticsContext";

const AnalyticsChainSelector = ({
  selectedChain,
  setSelectedChain,
}: {
  selectedChain: string;
  setSelectedChain: (arg0: string) => void;
}) => {
  const { blockchains } = useAnalytics();

  useEffect(() => {
    if (selectedChain === "" && blockchains.data?.length) {
      setSelectedChain(blockchains.data[0].name);
    }
  }, [blockchains.data]);

  if (!blockchains.data) {
    return <></>;
  }

  return (
    <Flex wrap="wrap" gap="10px" w="fit-content" p="0">
      {blockchains.data.map(
        (chain: { name: string; displayName: string; image: string }, idx: number) => (
          <Flex
            key={idx}
            display="inline-flex"
            alignItems="center"
            gap="3px"
            p="8px 15px"
            cursor="pointer"
            onClick={() => setSelectedChain(chain.name)}
            borderRadius={"30px"}
            bg={selectedChain === chain.name ? "#FFF" : "#232323"}
            color={selectedChain === chain.name ? "#1A1D22" : "#FFF"}
          >
            {(getChainImage(chain.name) || chain.name) && (
              <Image
                alt=""
                src={getChainImage(chain.name) ?? chain.image}
                h="20px"
                filter={selectedChain === chain.name ? "invert(100%)" : ""}
              />
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
