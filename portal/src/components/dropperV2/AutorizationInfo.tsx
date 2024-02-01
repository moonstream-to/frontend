import { Flex, Popover, PopoverContent, PopoverTrigger } from "@chakra-ui/react";
import Web3Address from "../entity/Web3Address";
import { InfoIcon } from "@chakra-ui/icons";

const AuthorizationInfo = ({
  controllers,
}: {
  controllers: { contractController: string; poolController: string };
}) => {
  return (
    <Popover placement={"bottom-end"}>
      <PopoverTrigger>
        <InfoIcon cursor={"pointer"} />
      </PopoverTrigger>
      <PopoverContent w={"500px"} _focusVisible={{ border: "none" }}>
        <Flex direction="column" p={"30px"} bg={"#1d1d1d"} borderRadius={"10px"}>
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
        </Flex>
      </PopoverContent>
    </Popover>
  );
};

export default AuthorizationInfo;
