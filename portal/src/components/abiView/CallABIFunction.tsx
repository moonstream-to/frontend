import { CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Collapse,
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
import Web3Context from "../../contexts/Web3Context/context";

const JSONEdit = dynamic(() => import("../JSONEdit2"), { ssr: false });

const CallABIFunction = ({
  isOpen,
  onClose,
  name,
  inputs,
  abi,
  stateMutability,
  contractAddress,
}: {
  name?: string;
  inputs?: any[];
  isOpen: boolean;
  onClose: () => void;
  abi: any;
  stateMutability: string;
  contractAddress?: string;
}) => {
  const web3ctx = useContext(Web3Context);
  const [values, setValues] = useState<string[]>([]);
  const [callOnAddress, setCallOnAddress] = useState("0x2360aBCf3b533f9ac059dA8db87f2C9e4Ba49041");
  const [isLoading, setIsLoading] = useState(false);

  const [result, setResult] = useState<any>(undefined);
  const [error, setError] = useState<any | undefined>(undefined);
  const [highlightRequired, setHighlightRequired] = useState(false);

  const callFunction = async (address: string, abi: any, name: string, values: any) => {
    if (name && address && web3ctx.web3.utils.isAddress(address)) {
      setIsLoading(true);
      setResult(undefined);
      try {
        const contract = new web3ctx.web3.eth.Contract(abi, address);
        const fn = contract.methods[name];
        const res =
          stateMutability === "view"
            ? await fn(...values).call()
            : await fn(...values).send({ from: web3ctx.account });

        setResult(res);
        setError(undefined);
      } catch (e: any) {
        setError({ message: e.message, error: e });
        console.log(JSON.stringify(e, null, "\t"), e.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      setHighlightRequired(true);
      // setError("no contract address");
    }
  };

  useEffect(() => {
    if (inputs) {
      setValues(inputs.map((_) => ""));
    }
  }, [inputs]);

  const handleClick = async () => {
    callFunction(callOnAddress, abi, name ?? "", values);
  };

  useEffect(() => {
    setResult(undefined);
    setError("");
  }, [isOpen]);

  useEffect(() => {
    if (contractAddress !== undefined) setCallOnAddress(contractAddress);
  }, [contractAddress, isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent
        bg="#202329"
        borderRadius="0px"
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
              <Text variant="label" color="#CCCCCC">
                On contract:{" "}
              </Text>
              <Input
                variant="address"
                fontSize="16px"
                w="50ch"
                value={callOnAddress}
                spellCheck={false}
                borderColor={
                  highlightRequired && !web3ctx.web3.utils.isAddress(callOnAddress)
                    ? "error.500"
                    : "#555555"
                }
                color="#CCCCCC"
                borderRadius="0"
                onChange={(e) => {
                  setCallOnAddress(e.target.value);
                  setHighlightRequired(false);
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
                      borderColor="#555555"
                      borderRadius="0"
                      color="#CCCCCC"
                    />
                  </Flex>
                ))}
              </Flex>
            )}
            <Flex gap="35px" mt="20px" placeSelf="end" alignItems="end">
              <Button
                border="1px solid #cc0780"
                bg="transparent"
                _hover={{ bg: "transparent", fontSize: "15px" }}
                w="150px"
                placeSelf="end"
                onClick={handleClick}
                borderRadius="0"
              >
                {isLoading ? <Spinner /> : stateMutability === "view" ? ".call" : ".send"}
              </Button>
            </Flex>
            {!!error && <Text color="error.500">Error</Text>}
            <Box as={Collapse} in={result !== undefined || !!error || isLoading} w="100%">
              <JSONEdit
                json={
                  error ? JSON.stringify(error, null, "\t") : JSON.stringify(result, null, "\t")
                }
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
            </Box>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CallABIFunction;
