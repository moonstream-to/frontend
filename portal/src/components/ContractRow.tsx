import { useRouter } from "next/router";

import { Flex, Image, Text } from "@chakra-ui/react";

import { chainByChainId } from "../contexts/Web3Context";

const ContractRow = ({
  address,
  name,
  image,
  chainId,
  type,
  chain,
  onClick,
}: {
  address?: string;
  name?: string;
  image?: string;
  chainId?: number;
  type: string;
  chain?: string;
  onClick?: () => void;
}) => {
  const router = useRouter();
  const handleClick = () => {
    if (!onClick) {
      router.push({
        pathname: `/portal/${type}`,
        query: {
          contractAddress: address,
        },
      });
    } else {
      onClick();
    }
  };
  return (
    <Flex
      gap="15px"
      cursor="pointer"
      onClick={handleClick}
      _hover={{ transform: "scale(1.01)", transition: "0.42s" }}
    >
      {image && <Image alt="address" src={image} w="72px" h="72px" />}
      <Flex direction="column">
        {name && <Text>{name}</Text>}
        <Text fontFamily="mono">{address}</Text>
        {(chainId || chain) && <Text>{chainId ? chainByChainId(chainId) ?? chainId : chain}</Text>}
      </Flex>
    </Flex>
  );
};

export default ContractRow;
