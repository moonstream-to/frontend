import { Flex, Image, Text } from "@chakra-ui/react";

const ChainSelectorItem = ({ name, img }: { name: string; img: string }) => {
  return (
    <>
      <Flex justifyContent="center" w="24px">
        <Image alt="" h="24px" src={img}></Image>
      </Flex>
      <Text ml="15px">{name}</Text>
    </>
  );
};

export default ChainSelectorItem;
