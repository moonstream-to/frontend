import { Flex, Text } from "@chakra-ui/react";

const buildOpenseaLink = (address) => {
  return `https://opensea.io/${address}`;
};

const LeaderboardAddressItem = ({ address }) => {
  return (
    // <Link p="0px" _hover={{ bgColor: "#454545" }} href={buildOpenseaLink(address)} isExternal>
    <Text>{address}</Text>

    // </Link>
  );
};

export default LeaderboardAddressItem;
