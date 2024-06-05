import { Flex } from "@chakra-ui/react";
import ABIRecentAddresses from "./ABIRecentAddresses";
import ABIFunction from "./ABIFunction";
import { useState } from "react";
import useRecentAddresses from "../../hooks/useRecentAddresses";
import ConnectionView from "./ConnectionView";

const ABICallFunctionView = ({
  isOpen,
  onClose,
  name,
  inputs,
  outputs,
  abi,
  stateMutability,
  contractAddress,
  src,
}: {
  name?: string;
  inputs: any[];
  outputs?: any[];
  isOpen: boolean;
  onClose: () => void;
  abi: any;
  stateMutability: string;
  contractAddress?: string;
  src: string;
}) => {
  const [storedAddress, setStoredAddress] = useState({ address: "" });
  const { recentAddresses, addRecentAddress } = useRecentAddresses("ABIExplorer-addresses");
  return (
    <Flex
      gap="0px"
      mt="0px"
      px="0"
      minH="calc(100vh - 20px)"
      maxH="calc(100vh - 20px)"
      minW="100vw"
      position="relative"
      alignSelf="stretch"
    >
      <ABIRecentAddresses
        setStoredAddress={setStoredAddress}
        recentAddresses={recentAddresses}
        addRecentAddress={addRecentAddress}
      />
      <ABIFunction
        inputs={inputs}
        isOpen={isOpen}
        onClose={onClose}
        abi={abi}
        stateMutability={stateMutability}
        contractAddress={contractAddress}
        outputs={outputs}
        name={name}
        src={src}
        storedAddress={storedAddress}
        addRecentAddress={addRecentAddress}
      />
      <ConnectionView />
    </Flex>
  );
};

export default ABICallFunctionView;
