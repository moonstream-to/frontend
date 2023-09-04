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
import React, { useContext, useEffect, useState } from "react";
import Web3Context from "../../contexts/Web3Context/context";
import ChainSelector from "../ChainSelector";
import { colorScheme, getType, Outputs } from "./ABIViewRightPanel";

const JSONEdit = dynamic(() => import("../JSONEdit2"), { ssr: false });

const ABIFunctionModal = ({
  isOpen,
  onClose,
  name,
  inputs,
  outputs,
  abi,
  stateMutability,
  contractAddress,
}: {
  name?: string;
  inputs: any[];
  outputs?: any[];
  isOpen: boolean;
  onClose: () => void;
  abi: any;
  stateMutability: string;
  contractAddress?: string;
}) => {
  const web3ctx = useContext(Web3Context);
  const [values, setValues] = useState<string[]>([]);
  const [callOnAddress, setCallOnAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [result, setResult] = useState<any>(undefined);
  const [error, setError] = useState<any | undefined>(undefined);
  const [highlightRequired, setHighlightRequired] = useState(false);

  const callFunction = async (address: string, abi: any, name: string, values: any) => {
    if (name && address && web3ctx.web3.utils.isAddress(address)) {
      setIsLoading(true);
      setResult("undefined");
      setError("undefined");
      try {
        const contract = new web3ctx.web3.eth.Contract(abi, address);
        const fn = contract.methods[name];
        const valuesToSend = values.map((value: string, idx: number) => {
          if (inputs[idx].type === "bool" && (value === "false" || value === "0")) {
            return false;
          }
          try {
            const obj = JSON.parse(value);
            console.log(obj, typeof obj);
            return obj;
          } catch (e) {
            console.log(e);
            // return value
          }
          return value;
        });
        console.log(valuesToSend);
        const res =
          stateMutability === "view"
            ? await fn(...values).call()
            : await fn(...valuesToSend).send({
                from: web3ctx.account,
                maxPriorityFeePerGas: null,
                maxFeePerGas: null,
              });

        setResult(res);
        setError(undefined);
      } catch (e: any) {
        setError({ message: e.message, error: e });
      } finally {
        setIsLoading(false);
      }
    } else {
      setHighlightRequired(true);
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
            <Text color={colorScheme.name}>{name}</Text>
            <CloseIcon color="#999999" h="15px" onClick={onClose} cursor="pointer" />
          </Flex>
        </ModalHeader>
        <ModalBody w="fit-content" px="20px">
          <Flex direction="column" gap="10px" w="100%" bg="#202329" alignItems="center">
            <Flex gap="10px" alignItems="center" justifyContent="space-between" w="100%">
              <Text variant="label" color="#CCCCCC">
                On chain:{" "}
              </Text>
              <ChainSelector color="#CCCCCC" />
            </Flex>

            <Flex gap="10px" alignItems="center" justifyContent="space-between" w="100%" mb="20px">
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
                    ? "#f06b6a"
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
                  <Flex gap="15px" key={idx} alignItems="center" w="100%" justifyContent="end">
                    <Flex key={idx}>
                      <span style={{ color: colorScheme.param }}>{input.name}</span>
                      {input.name && ":"}
                      {input.name && <span>&nbsp;</span>}
                      {getType(input)}
                    </Flex>
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
                      spellCheck="false"
                    />
                  </Flex>
                ))}
              </Flex>
            )}
            <Flex
              mt="30px"
              flex="1"
              gap="20px"
              w="100%"
              fontFamily="monospace"
              alignItems="center"
              justifyContent="end"
            >
              <Text
                border="0px solid white"
                textIndent="-14px"
                ml="14px"
                w="fit-content"
                fontSize="16px"
                maxW="450px"
                fontWeight="400"
                fontFamily="monospace"
                bottom="0px"
              >
                {outputs ? " => " : ""}
                {outputs && <Outputs outputs={outputs} />}
              </Text>
              <Button
                border="1px solid #cccccc"
                bg="transparent"
                _hover={{ bg: "transparent", fontSize: "15px" }}
                w="150px"
                onClick={handleClick}
                borderRadius="0"
                color="#EEEEEE"
                isDisabled={isLoading}
              >
                {isLoading ? <Spinner /> : stateMutability === "view" ? ".call" : ".send"}
              </Button>
            </Flex>
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

export default ABIFunctionModal;
