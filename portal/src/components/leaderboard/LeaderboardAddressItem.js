import { Text, Link } from "@chakra-ui/react";

const buildOpenseaLink = (address) => {
  return `https://opensea.io/${address}`;
};

const LeaderboardAddressItem = ({ address, you }) => {
  return (
    // <Link p="0px" _hover={{ bgColor: "#454545" }} href={buildOpenseaLink(address)} isExternal>
    <Text>
      {address}
      {you ? " (you)" : ""}
    </Text>
    // </Link>
  );
};

export default LeaderboardAddressItem;
