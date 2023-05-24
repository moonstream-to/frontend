import { useRouter } from "next/router";

import { Flex, Image, Text } from "@chakra-ui/react";

import { chainByChainId } from "../contexts/Web3Context";

const ContractRow = ({
  address,
  name,
  image,
  chainId,
  type,
}: {
  address?: string;
  name?: string;
  image?: string;
  chainId?: number;
  type: string;
}) => {
  const router = useRouter();
  const handleClick = () => {
    router.push({
      pathname: `/${type}`,
      query: {
        contractAddress: address,
      },
    });
  };
  return (
    <Flex
      gap="15px"
      cursor="pointer"
      onClick={handleClick}
      _hover={{ transform: "scale(1.05)", transition: "0.42s" }}
    >
      {image ? (
        <Image alt="address" src={image} w="72px" h="72px" />
      ) : (
        <Flex
          opacity=".7"
          w="72px"
          h="72px"
          alignItems="center"
          textAlign="center"
          justifyContent="center"
        >
          no
          <br /> image
        </Flex>
      )}
      <Flex direction="column">
        {name ? <Text>{name}</Text> : <Text opacity=".7">name N/A</Text>}
        <Text fontFamily="mono">{address}</Text>
        {chainId && <Text>{chainByChainId[chainId]}</Text>}
      </Flex>
    </Flex>
  );
};

export default ContractRow;
