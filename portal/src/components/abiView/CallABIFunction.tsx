import {
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import Web3Context from "../../contexts/Web3Context/context";
import queryCacheProps from "../../hooks/hookCommon";
import EditRow from "../dropper/EditRow";

const CallABIFunction = ({
  isOpen,
  onClose,
  name,
  inputs,
  abi,
}: {
  name?: string;
  inputs?: any[];
  isOpen: boolean;
  onClose: () => void;
  abi: any;
}) => {
  const web3ctx = useContext(Web3Context);
  const [values, setValues] = useState<string[]>([]);
  const [contractAddress, setContractAddress] = useState(
    "0x2360aBCf3b533f9ac059dA8db87f2C9e4Ba49041",
  );

  const callQuery = useQuery(
    ["callWeb3", abi, name, inputs],
    async () => {
      if (name && contractAddress) {
        const contract = new web3ctx.web3.eth.Contract(
          abi,
          contractAddress,
          // "0x2360aBCf3b533f9ac059dA8db87f2C9e4Ba49041",
        );
        const fn = contract.methods[name];
        return fn(...values).call();
        // console.log(res);
      } else {
        return new Promise((_, rej) => {
          rej(new Error("no function or contract address"));
        });
      }
    },
    {
      ...queryCacheProps,
      onError: (e: any) => {
        console.log(e);
      },
      enabled: false,
      keepPreviousData: false,
    },
  );

  useEffect(() => {
    if (inputs) {
      setValues(inputs.map((_) => ""));
    }
  }, [inputs]);

  const handleClick = async () => {
    callQuery.refetch();
    // if (name && contractAddress) {
    //   const contract = new web3ctx.web3.eth.Contract(
    //     abi,
    //     contractAddress,
    //     // "0x2360aBCf3b533f9ac059dA8db87f2C9e4Ba49041",
    //   );
    //   // contract.options.address = "0x2360aBCf3b533f9ac059dA8db87f2C9e4Ba49041";
    //   // contract.setProvider(web3.currentProvider);
    //   const fn = contract.methods[name];
    //   // console.log(contract, fn);
    //   // const fn = window["contract"]["methods"][name](1);
    //   // const uri = await contract.methods.dropUri(1).call(); //TODO take from ClaimsList

    //   const res = await fn(...values).call();
    //   console.log(res);
    // }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent bg="#1a1d22" borderRadius="15px" minW="fit-content" p="20px">
        <ModalHeader w="100%">
          <Text>Call {name}</Text>
        </ModalHeader>
        <ModalBody w="fit-content" px="20px">
          <Flex direction="column" gap="10px" w="100%" bg="#1a1d22" alignItems="center">
            <Flex gap="10px" alignItems="center" justifyContent="space-between" w="100%" mb="30px">
              <Text variant="label">On contract: </Text>
              <Input
                variant="address"
                fontSize="18px"
                value={contractAddress}
                onChange={(e) => {
                  setContractAddress(e.target.value);
                }}
              />
            </Flex>
            <Text variant="label" placeSelf="start">
              Parameters:
            </Text>
            {inputs && !!values.length && (
              <Flex direction="column" gap="10px">
                {inputs.map((input, idx: number) => (
                  <Flex
                    gap="15px"
                    key={idx}
                    alignItems="center"
                    w="100%"
                    justifyContent="space-between"
                  >
                    <Text>{`${input.name} (${input.type}):`}</Text>
                    <EditRow
                      onChange={(e) => {
                        const newValues = [...values];
                        newValues[idx] = e.target.value;
                        setValues(newValues);
                      }}
                      validationError=""
                      // key={idx}
                      value={values[idx]}
                      title=""
                    />
                    {/* <Text>({input.type})</Text> */}
                  </Flex>
                ))}
              </Flex>
            )}
            <Button variant="saveButton" placeSelf="end" onClick={handleClick}>
              {callQuery.isFetching ? <Spinner /> : "call"}
            </Button>
            {callQuery.data && <Text>{JSON.stringify(callQuery.data, null, "\t")}</Text>}
            {callQuery.isError && <Text>{JSON.stringify(callQuery.error, null, "\t")}</Text>}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CallABIFunction;
