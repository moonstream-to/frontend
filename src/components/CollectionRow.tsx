import { Flex, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

const CollectionRow = ({ collection }: { collection: { name: string; collection_id: string } }) => {
  const router = useRouter();
  return (
    <Flex
      direction="column"
      cursor="pointer"
      borderRadius="20px"
      p="10px 30px"
      bg="#2d2d2d"
      w="fit-content"
      border="1px solid white"
      _hover={{ bg: "#3a3a3a" }}
      onClick={() => {
        router.push({
          pathname: "/airdrop",
          query: {
            eventId: collection.collection_id,
            name: collection.name,
          },
        });
      }}
    >
      <Text>{collection.name}</Text>
      <Text>{collection.collection_id}</Text>
    </Flex>
  );
};

export default CollectionRow;
