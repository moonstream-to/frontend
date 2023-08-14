import { Text } from "@chakra-ui/react";

const LeaderboardAddressItem = ({ address, trimAddress = false }) => {
  return <Text>{trimAddress ? `${address.slice(0, 6)}...${address.slice(-4)}` : address}</Text>;
};

export default LeaderboardAddressItem;
