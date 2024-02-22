import { Box, Flex, Popover, PopoverContent, PopoverTrigger } from "@chakra-ui/react";
import Web3Address from "../entity/Web3Address";
import InfoIcon from "../icons/InfoIcon";
import styles from "./AuthorizationInfo.module.css";

const MintingApprovalInfo = ({
  terminusPoolController,
  mintingTerminus,
}: {
  terminusPoolController: string;
  mintingTerminus: { terminusAddress: string; poolId: string };
}) => {
  return (
    <Popover placement={"right-start"}>
      <PopoverTrigger>
        <button style={{ position: "relative" }}>
          <InfoIcon width="18" height="18" viewBox="0 0 16 16" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        id="pop-content"
        border="none"
        _focusVisible={{ border: "none", outline: "none" }}
        position="absolute"
        right="185px"
        bottom={"-20px"}
      >
        <div className={styles.container}>
          <Flex
            className={styles.addressesContainer}
            _focusVisible={{ border: "none" }}
            fontSize={"12px"}
          >
            <Web3Address
              isTruncated
              label="Terminus pool controller"
              address={terminusPoolController ?? ""}
            />
            <Box h={"0.5px"} w={"100%"} bg={"#4D4D4D"} />
            <Web3Address
              isTruncated
              label="Terminus token address"
              address={mintingTerminus.terminusAddress ?? ""}
              href={`/terminus/?contractAddress=${mintingTerminus.terminusAddress}`}
            />
            <Web3Address
              label="Terminus token pool"
              address={mintingTerminus.poolId ?? ""}
              href={`/terminus/?contractAddress=${mintingTerminus.terminusAddress}&poolId=${mintingTerminus.poolId}`}
            />
          </Flex>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MintingApprovalInfo;
