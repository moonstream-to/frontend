import { CloseIcon } from "@chakra-ui/icons";
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
import dynamic from "next/dynamic";
import { useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import Web3Context from "../../contexts/Web3Context/context";
import queryCacheProps from "../../hooks/hookCommon";
import EditRow from "../dropper/EditRow";

const JSONEdit = dynamic(() => import("../JSONEdit2"), { ssr: false });

const CallABIFunction = ({
  isOpen,
  onClose,
  name,
  inputs,
  abi,
  stateMutability,
}: {
  name?: string;
  inputs?: any[];
  isOpen: boolean;
  onClose: () => void;
  abi: any;
  stateMutability: string;
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

  const send = () => {
    if (name && contractAddress) {
      const contract = new web3ctx.web3.eth.Contract(
        abi,
        contractAddress,
        // "0x2360aBCf3b533f9ac059dA8db87f2C9e4Ba49041",
      );
      const fn = contract.methods[name];
      return fn(...values).send({ from: web3ctx.account });
    }
  };

  const sendMutation = useMutation(send, {
    onSuccess: () => {
      console.log("success");
      setTimeout(() => {
        sendMutation.reset();
      }, 5000);
    },
    onError: (e) => {
      console.log(e);
    },
  });

  useEffect(() => {
    if (inputs) {
      setValues(inputs.map((_) => ""));
    }
  }, [inputs]);

  const handleClick = async () => {
    if (stateMutability === "view") {
      callQuery.refetch();
    } else {
      sendMutation.mutate();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent
        bg="#202329"
        borderRadius="15px"
        minW="fit-content"
        p="20px"
        border="1px solid #CCCCCC"
      >
        <ModalHeader w="100%">
          <Flex justifyContent="space-between" alignItems="center">
            <Text color="#a188cc">{name}</Text>
            <CloseIcon color="#999999" h="15px" onClick={onClose} cursor="pointer" />
          </Flex>
        </ModalHeader>
        <ModalBody w="fit-content" px="20px">
          <Flex direction="column" gap="10px" w="100%" bg="#202329" alignItems="center">
            <Flex gap="10px" alignItems="center" justifyContent="space-between" w="100%" mb="30px">
              <Text variant="label">On contract: </Text>
              <Input
                variant="address"
                fontSize="18px"
                value={contractAddress}
                spellCheck={false}
                borderColor="#CCCCCC"
                onChange={(e) => {
                  setContractAddress(e.target.value);
                }}
              />
            </Flex>
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
                    <Text color="#fab56b">{`${input.name} (${input.type}):`}</Text>
                    <Input
                      w="50ch"
                      fontSize="16px"
                      type="text"
                      variant="address"
                      value={values[idx]}
                      onChange={(e) => {
                        const newValues = [...values];
                        newValues[idx] = e.target.value;
                        setValues(newValues);
                      }}
                      borderColor="#CCCCCC"
                    />
                    {/* <Text>({input.type})</Text> */}
                  </Flex>
                ))}
              </Flex>
            )}
            <Flex gap="35px" mt="20px" placeSelf="end" alignItems="end">
              {sendMutation.isSuccess && (
                <Text color="#338c6e" fontWeight="700">
                  success
                </Text>
              )}
              <Button
                border="1px solid #cc0780"
                bg="transparent"
                _hover={{ bg: "transparent", fontSize: "15px" }}
                w="150px"
                placeSelf="end"
                onClick={handleClick}
              >
                {callQuery.isFetching || sendMutation.isLoading ? (
                  <Spinner />
                ) : stateMutability === "view" ? (
                  ".call"
                ) : (
                  ".send"
                )}
              </Button>
            </Flex>
            {/* {callQuery.data && <Text>{JSON.stringify(callQuery.data, null, "\t")}</Text>} */}

            {callQuery.isError && <Text>{JSON.stringify(callQuery.error, null, "\t")}</Text>}
            {callQuery.data && (
              <JSONEdit
                json={JSON.stringify(callQuery.data, null, "\t")}
                readOnly
                style={{
                  border: "1px solid #cccccc",
                  backgroundColor: "#2d2d2d",
                  borderRadius: "5px",
                  fontSize: "14px",
                  padding: "10px",
                  marginTop: "20px",
                }}
                placeholder=""
              />
            )}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CallABIFunction;
