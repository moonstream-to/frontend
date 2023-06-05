import { Flex } from "@chakra-ui/react";
import PoolDetailsRow from "../PoolDetailsRow";
import MetadataPanel from "../MetadataPanel";
import { DropDataProps } from "../../types";

const DropData: React.FC<DropDataProps> = ({
  claimState,
  dropState,
  metadata,
  excludeFields,
  PORTAL_PATH,
}) =>
  claimState.data?.claim && (
    <Flex direction="column" gap="10px" p={5} borderRadius="10px" bg="#232323">
      <PoolDetailsRow type="Token address" value={claimState.data.claim[1]} />
      <PoolDetailsRow type="Drop type" value={claimState.data.dropType} />

      <PoolDetailsRow type="Signer" value={claimState.data.signer} />
      <PoolDetailsRow
        type="Metadata uri"
        href={claimState.data.claimUri}
        value={claimState.data.claimUri}
      />
      {dropState && (
        <>
          <PoolDetailsRow type="Deadline" value={String(dropState.deadline)} />
          <PoolDetailsRow
            href={`${PORTAL_PATH}/terminus/?contractAddress=${dropState.terminusAddress}&poolId=${dropState.terminusPoolId}`}
            type="Terminus address"
            value={String(dropState.terminusAddress)}
          />

          <PoolDetailsRow
            href={`${PORTAL_PATH}/terminus/?contractAddress=${dropState.terminusAddress}&poolId=${dropState.terminusPoolId}`}
            type="Terminus Pool"
            value={String(dropState.terminusPoolId)}
          />
        </>
      )}
      {metadata && <MetadataPanel metadata={metadata} excludeFields={excludeFields} />}
    </Flex>
  );

export default DropData;
