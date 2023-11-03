import { Flex, Link, Text, Icon, Button, Spinner } from "@chakra-ui/react";
import PoolDetailsRow from "../PoolDetailsRow";
import MetadataPanel from "../MetadataPanel";
import { RxCrossCircled } from "react-icons/rx";
import { CheckCircleIcon } from "@chakra-ui/icons";

type DropStateType = {
  data: {
    drop: any;
    dropAuthorization: any;
    uri: string;
    active: boolean;
    isMintAuthorized: boolean;
    address: string;
  };
};

type DropV2DataProps = {
  dropState: DropStateType;
  metadata: Record<string, any>;
  excludeFields: string[];
  PORTAL_PATH: string;
  approveForPool: any;
};

const DropV2Data: React.FC<DropV2DataProps> = ({
  dropState,
  metadata,
  excludeFields,
  PORTAL_PATH,
  approveForPool,
}) => {
  const dropTypes = new Map<string, string>([
    ["20", "ERC20"],
    ["721", "ERC721"],
    ["1155", "ERC1155"],
    ["1", "Mint Terminus"],
  ]);
  return (
    <>
      {dropState.data?.drop && (
        <Flex direction="column" gap="10px" p={5} borderRadius="10px" bg="#232323">
          <Text fontSize="18px" fontWeight="700" mt="10px">
            Token
          </Text>
          <Flex direction="column" gap="10px" p="0" pl="15px">
            <PoolDetailsRow
              type="Type"
              value={dropTypes.get(dropState.data.drop.tokenType) ?? "unknown"}
            />

            <PoolDetailsRow
              type="Address"
              displayFull
              canBeCopied
              value={dropState.data.drop.tokenAddress}
            />
            <PoolDetailsRow type="Id" value={dropState.data.drop.tokenId} />
            <PoolDetailsRow type="Amount" value={dropState.data.drop.amount} />
            {dropState.data.drop.tokenType === "1" && (
              <Flex fontSize="18px" justifyContent="space-between" alignItems="center">
                <Text>Does dropper have minting authority?</Text>
                {!dropState.data.isMintAuthorized ? ( //check if MM account is terminus pool controller
                  <Flex alignItems="center">
                    <Text pr="5px">No</Text>
                    <Icon as={RxCrossCircled} w="15px" mr="20px" />
                    <Button
                      fontWeight="400"
                      fontSize="18px"
                      color="#2d2d2d"
                      variant={"saveButton"}
                      px={"40px"}
                      minW={"152px"}
                      onClick={() =>
                        approveForPool.mutate({
                          operator: dropState.data.address,
                          poolId: dropState.data.drop.tokenId,
                        })
                      }
                      isDisabled={approveForPool.isLoading}
                    >
                      {approveForPool.isLoading ? <Spinner /> : "Approve"}
                    </Button>
                  </Flex>
                ) : (
                  <Flex alignItems="center">
                    <Text pr="5px">Yes</Text>
                    <Icon as={CheckCircleIcon} w="15px" />
                  </Flex>
                )}
              </Flex>
            )}
          </Flex>

          <Text fontSize="18px" fontWeight="700" mt="10px">
            Authorization
          </Text>
          <Flex direction="column" gap="10px" p="0" pl="15px">
            <PoolDetailsRow
              displayFull
              canBeCopied
              href={`${PORTAL_PATH}/terminus/?contractAddress=${dropState.data.dropAuthorization.terminusAddress}&poolId=${dropState.data.dropAuthorization.poolId}`}
              type="Terminus address"
              value={String(dropState.data.dropAuthorization.terminusAddress)}
            />

            <PoolDetailsRow
              href={`${PORTAL_PATH}/terminus/?contractAddress=${dropState.data.dropAuthorization.terminusAddress}&poolId=${dropState.data.dropAuthorization.poolId}`}
              type="Terminus Pool"
              value={String(dropState.data.dropAuthorization.poolId)}
            />
          </Flex>

          <PoolDetailsRow
            type="Metadata uri"
            href={dropState.data.uri}
            value={dropState.data.uri}
            mt="10px"
          />
          {metadata && <MetadataPanel metadata={metadata} excludeFields={excludeFields} />}
        </Flex>
      )}
    </>
  );
};

export default DropV2Data;
