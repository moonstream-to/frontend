import { Flex, Text } from "@chakra-ui/react";
import PoolDetailsRow from "../PoolDetailsRow";
import MetadataPanel from "../MetadataPanel";
import { DropDataProps } from "../../types";
import { useEffect } from "react";

const DropV2Data: React.FC<DropDataProps> = ({
  claimState,
  // dropState,
  metadata,
  excludeFields,
  PORTAL_PATH,
}) => {
  useEffect(() => {
    console.log(claimState);
  }, []);
  const dropTypes = new Map<string, string>([
    ["20", "ERC20"],
    ["721", "ERC721"],
    ["1155", "ERC1155"],
    ["1", "Mint Terminus"],
  ]);
  return (
    <>
      {claimState.data?.drop && (
        <Flex direction="column" gap="10px" p={5} borderRadius="10px" bg="#232323">
          <PoolDetailsRow
            type="Drop status"
            value={claimState.data.dropStatus ? "active" : "inactive"}
          />
          <Text fontSize="18px" fontWeight="700" mt="10px">
            Token
          </Text>
          <Flex direction="column" gap="10px" p="0" pl="15px">
            <PoolDetailsRow
              type="Type"
              value={dropTypes.get(claimState.data.drop.tokenType) ?? "unknown"}
            />

            <PoolDetailsRow
              type="Address"
              displayFull
              canBeCopied
              value={claimState.data.drop.tokenAddress}
            />
            <PoolDetailsRow type="Id" value={claimState.data.drop.tokenId} />
            <PoolDetailsRow type="Amount" value={claimState.data.drop.amount} />
          </Flex>
          <Text fontSize="18px" fontWeight="700" mt="10px">
            Authorization
          </Text>
          <Flex direction="column" gap="10px" p="0" pl="15px">
            <PoolDetailsRow
              displayFull
              canBeCopied
              href={`${PORTAL_PATH}/terminus/?contractAddress=${claimState.data.dropAuthorization.terminusAddress}&poolId=${claimState.data.dropAuthorization.poolId}`}
              type="Terminus address"
              value={String(claimState.data.dropAuthorization.terminusAddress)}
            />

            <PoolDetailsRow
              href={`${PORTAL_PATH}/terminus/?contractAddress=${claimState.data.dropAuthorization.terminusAddress}&poolId=${claimState.data.dropAuthorization.poolId}`}
              type="Terminus Pool"
              value={String(claimState.data.dropAuthorization.poolId)}
            />
          </Flex>

          {/* <PoolDetailsRow type="Drop type" value={claimState.data.dropType} /> */}

          {/* <PoolDetailsRow type="Signer" value={claimState.data.signer} /> */}
          <PoolDetailsRow
            type="Metadata uri"
            href={claimState.data.dropUri}
            value={claimState.data.dropUri}
            mt="10px"
          />
          {metadata && <MetadataPanel metadata={metadata} excludeFields={excludeFields} />}
        </Flex>
      )}
    </>
  );
};

export default DropV2Data;
