import { Box, Flex, Popover, PopoverContent, PopoverTrigger } from "@chakra-ui/react";
import Web3Address from "../entity/Web3Address";
import InfoIcon from "../icons/InfoIcon";
import { Simulate } from "react-dom/test-utils";
import drop = Simulate.drop;

const AuthorizationInfo = ({
  controllers,
  dropAuthorization,
}: {
  controllers: { contractController: string; poolController: string };
  dropAuthorization: { poolId: string; terminusAddress: string };
}) => {
  return (
    <Popover placement={"bottom-end"}>
      <PopoverTrigger>
        <InfoIcon cursor={"pointer"} />
      </PopoverTrigger>
      <PopoverContent w={"500px"} _focusVisible={{ border: "none", outline: "1px solid white" }}>
        <Flex
          direction="column"
          p={"30px"}
          bg={"#1d1d1d"}
          borderRadius={"10px"}
          gap={"5px"}
          fontSize={"12px"}
          _focusVisible={{ border: "none" }}
        >
          <Web3Address
            isTruncated
            label="Contract controller"
            address={controllers.contractController ?? ""}
          />
          <Web3Address
            isTruncated
            label="Pool controller"
            address={controllers.poolController ?? ""}
          />
          <Box h={"0.5px"} w={"100%"} bg={"#4D4D4D"} />
          <Web3Address
            isTruncated
            label="Terminus badge address"
            address={dropAuthorization.terminusAddress ?? ""}
          />
          <Web3Address label="Terminus badge pool" address={dropAuthorization.poolId ?? ""} />
        </Flex>
      </PopoverContent>
    </Popover>
  );
};

export default AuthorizationInfo;
