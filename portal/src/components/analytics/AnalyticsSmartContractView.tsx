import { Flex, Text } from "@chakra-ui/react";
import { AWS_ASSETS_PATH_CF, ChainName, getChainImage } from "../../constants";
import useAnalytics from "../../contexts/AnalyticsContext";
import AnalyticsAddressTags from "./AnalyticsAddressTags";
import AnalyticsSmartContractDetails from "./AnalyticsSmartContractDetails";
const metamaskIcon = `${AWS_ASSETS_PATH_CF}/icons/metamask.png`;
const chainNames: ChainName[] = ["ethereum", "polygon", "mumbai", "xdai", "wyrm"];

const AnalyticsSmartContractView = ({ address }: { address: any }) => {
  const { addresses, setIsCreatingAddress } = useAnalytics();

  const handleAddTag = (newTag: string) => {
    //TODO add tag to DB
  };

  const handleDeleteTag = (tag: string) => {
    // TODO delete tag from DB
  };

  return (
    <Flex
      borderRadius="20px"
      bg="#2d2d2d"
      w="100%"
      minH="100%"
      maxW="800px"
      minW="800px"
      direction="column"
      overflowY="auto"
    >
      <Flex direction="column" p="30px" gap="30px" w="100%">
        <Text variant="title">{address.label}</Text>
        <AnalyticsAddressTags
          tags={address.tags}
          chainName={address.subscription_type_id.split("_")[0]}
          onAdd={handleAddTag}
          onDelete={(t: string) => handleDeleteTag(t)}
        />
        <Text variant="text" pr="160px">
          {address.description}
        </Text>
        <AnalyticsSmartContractDetails
          address={address.address}
          id={address.id}
          chain={address.subscription_type_id.split("_")[0]}
        />
        <Text variant="title" fontSize="20px">
          Analytics
        </Text>
      </Flex>
    </Flex>
  );
};

export default AnalyticsSmartContractView;
