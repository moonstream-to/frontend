import { CloseIcon } from "@chakra-ui/icons";
import { Box, Button, Collapse, Flex, Input, Spinner, Text } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import React, { useContext, useEffect, useState } from "react";
import Web3Context from "../../contexts/Web3Context/context";
import ChainSelector from "../ChainSelector";
import { colorScheme, getType, Outputs } from "./ABIViewRightPanel";
import { bridgeNativeTokens } from "./bridge";
import { getReceipt, withdrawNativeToken } from "./bridgeNativeToken";

const JSONEdit = dynamic(() => import("../JSONEdit2"), { ssr: false });
const TX_HASH = "0x8c09f790e614a59e8a792c8e294569262ba4c82276124781678697b180dfc799";
const TX_HASH2 = "0x2bbfd507eb26a1f0c007345ce122d56000cbd98c45b7a62ca3f1aca629b9f899";
const TX_HASH3 = "0x9e8222d1ea8f7a55384802ef7aca582e08e582beb53cb03f1daacd1059ae267d";

const ABIFunction = ({
  isOpen,
  onClose,
  name,
  inputs,
  outputs,
  abi,
  stateMutability,
  contractAddress,
  src,
  storedAddress,
  addRecentAddress,
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
  storedAddress: { address: string };
  addRecentAddress: any;
}) => {
  const web3ctx = useContext(Web3Context);
  const [values, setValues] = useState<string[]>([]);
  const [callOnAddress, setCallOnAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [result, setResult] = useState<any>(undefined);
  const [error, setError] = useState<any | undefined>(undefined);
  const [highlightRequired, setHighlightRequired] = useState(false);
  const [activeInputIdx, setActiveInputIdx] = useState<number | undefined>(undefined);

  function convertToBigNumber(numberString: string, precision = 18) {
    const [integerPart, decimalPart] = numberString.split(".");
    const decimalPartPadded = (decimalPart || "").padEnd(precision, "0");
    const bigNumberString = integerPart + decimalPartPadded;
    return web3ctx.web3.utils.toBN(bigNumberString);
  }

  const callFunction = async (address: string, abi: any, name: string, values: any) => {
    if (name && address && web3ctx.web3.utils.isAddress(address)) {
      addRecentAddress(address, { src, field: "contract" });

      setIsLoading(true);
      setResult("undefined");
      setError("undefined");
      try {
        const contract = new web3ctx.web3.eth.Contract(abi, address);
        const fn = contract.methods[name];
        const valuesToSend = values.map((value: string, idx: number) => {
          if (inputs[idx].type === "address" && web3ctx.web3.utils.isAddress(value)) {
            addRecentAddress(value, { src, field: inputs[idx].name });
          }
          if (inputs[idx].type === "bool" && (value === "false" || value === "0")) {
            return false;
          }
          if (inputs[idx].type === "uint256") {
            return convertToBigNumber(value);
          }

          try {
            const obj = JSON.parse(value);
            if (typeof obj === "object") {
              return obj;
            } else {
              return value;
            }
          } catch (e) {
            console.log(e);
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

  useEffect(() => {
    if (storedAddress && activeInputIdx !== undefined) {
      if (activeInputIdx === -1) {
        setCallOnAddress(storedAddress.address);
      } else if (inputs[activeInputIdx] && inputs[activeInputIdx].type === "address") {
        const newValues = [...values];
        newValues[activeInputIdx] = storedAddress.address;
        setValues(newValues);
      }
    }
  }, [storedAddress]);

  return (
    <Flex
      direction="column"
      gap="10px"
      bg="#1b1d22"
      alignItems="center"
      p={"20px"}
      color={"#CCCCCC"}
      overflowY={"auto"}
      flex={"2"}
    >
      <Flex
        justifyContent="space-between"
        alignItems="center"
        placeSelf={"stretch"}
        fontSize={"20px"}
        mb={"10px"}
      >
        <Flex gap={"10px"} justifyContent={"start"} flex={1}>
          <Text>{stateMutability === "view" ? "Call" : "Send"}</Text>
          <Text color={colorScheme.name} fontWeight={"700"}>
            {name}
          </Text>
        </Flex>
        <CloseIcon color="#999999" h="15px" onClick={onClose} cursor="pointer" />
      </Flex>
      <Flex direction={"column"} gap={"10px"} width={"fit-content"} placeSelf={"start"}>
        <Flex gap="10px" alignItems="center" justifyContent="space-between" w="100%">
          <Text variant="label" color="#CCCCCC">
            from:
          </Text>
          <Text>{web3ctx.account}</Text>
        </Flex>
        <Flex gap="10px" alignItems="center" justifyContent="space-between" w="100%">
          <Text variant="label" color="#CCCCCC">
            On chain:
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
            onFocus={() => setActiveInputIdx(-1)}
          />
        </Flex>
        {inputs && !!values.length && (
          <Flex direction="column" gap="10px" justifyContent={"start"}>
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
                  onFocus={() => setActiveInputIdx(idx)}
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
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {/*<button onClick={() => withdrawNativeToken(0.5)}>bridge up</button>*/}
            <button
              style={{ padding: "5px 10px", border: "1px solid #cccccc" }}
              onClick={() => withdrawNativeToken(0.5)}
            >
              withdraw
            </button>
            <button
              style={{ padding: "5px 10px", border: "1px solid #cccccc" }}
              onClick={() => getReceipt(TX_HASH3)}
            >
              execute
            </button>
          </div>
        </Flex>
      </Flex>
      <Box as={Collapse} in={result !== undefined || !!error || isLoading} w="100%">
        <JSONEdit
          json={error ? JSON.stringify(error, null, "\t") : JSON.stringify(result, null, "\t")}
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
  );
};

export default ABIFunction;
