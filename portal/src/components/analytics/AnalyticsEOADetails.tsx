import { Flex } from "@chakra-ui/layout";

import PoolDetailsRow from "../PoolDetailsRow";

const AnalyticsEOADetails = ({ address, created_at }: { address: string; created_at: string }) => {
  return (
    <Flex direction="column" gap="10px" p="15px" borderRadius="10px" bg="#232323">
      <PoolDetailsRow
        displayFull={true}
        canBeCopied={true}
        type={"Account address"}
        value={address}
        fontSize="14px"
      />
      <PoolDetailsRow
        displayFull={true}
        type={"Creation date"}
        value={created_at}
        fontSize="14px"
      />
    </Flex>
  );
};

export default AnalyticsEOADetails;
