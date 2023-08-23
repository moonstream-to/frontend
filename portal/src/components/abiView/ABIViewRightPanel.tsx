import { Flex, Input, InputGroup, InputRightElement, Text, useDisclosure } from "@chakra-ui/react";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import Web3 from "web3";
import ABIFunctionModal from "./ABIFunctionModal";

export const colorScheme = {
  name: "#7587a6",
  param: "#cf6a4c",
  type: "#7e895d",
};

const web3 = new Web3();

export const getType = (token: any) => {
  if (token.type != "tuple") return <span style={{ color: colorScheme.type }}>{token.type}</span>;

  return (
    <>
      {"{"}
      <Inputs inputs={token.components} />
      {"}"}
    </>
  );
};

export const Inputs = ({ inputs }: { inputs: { name: string; type: string }[] }) => {
  return (
    <>
      {inputs.map((input, idx) => (
        <React.Fragment key={idx}>
          <span style={{ color: colorScheme.param }}>{input.name}</span>
          {input.name && ":"}
          {input.name && <span>&nbsp;</span>}
          {getType(input)}
          {idx + 1 < inputs.length && ",  "}
        </React.Fragment>
      ))}
    </>
  );
};

export const Outputs = ({ outputs }: { outputs: { name: string; type: string }[] }) => {
  if (outputs.length === 0) {
    return <span style={{ color: colorScheme.type }}>void</span>;
  }

  return (
    <>
      {outputs.length > 1 && "["}
      {outputs.map((output, idx) => (
        <React.Fragment key={idx}>
          <span style={{ color: colorScheme.param }}>{output.name}</span>
          {output.name && ":"}
          {output.name && <span>&nbsp;</span>}

          {getType(output)}
          {idx + 1 < outputs.length && ",  "}
        </React.Fragment>
      ))}
      {outputs.length > 1 && "]"}
    </>
  );
};

const ABIViewRightPanel = ({
  abiObject,
  src,
  setSrc,
}: {
  abiObject: any;
  src: string;
  setSrc: (arg0: string) => void;
}) => {
  const [filter, setFilter] = useState("function");
  const [search, setSearch] = useState("");
  const [savedSearch, setSavedSearch] = useState("");
  const searchRef = useRef<HTMLInputElement | null>(null);

  const stateMutabilities = useMemo(
    () =>
      abiObject.reduce(
        (acc: string[], item: { stateMutability: string }) =>
          item.stateMutability && !acc.includes(item.stateMutability)
            ? acc.concat(item.stateMutability)
            : acc,
        [],
      ),
    [abiObject],
  );

  const types = useMemo(
    () =>
      abiObject.reduce(
        (acc: string[], item: { type: string }) =>
          item.type && !acc.includes(item.type) ? acc.concat(item.type) : acc,
        [],
      ),
    [abiObject],
  );

  const filterFunction = search
    ? (item: { name: string }) => item.name.toLowerCase().includes(search.toLowerCase())
    : stateMutabilities.includes(filter)
    ? (item: { stateMutability: string }) => item.stateMutability === filter
    : (item: { type: string }) => item.type === filter;

  const handleKeyDown = (e: any) => {
    if (e.keyCode === 46 || e.keyCode === 8) {
      setSrc("");
    }
  };

  const handlePaste = (e: any) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    if (pastedText) {
      setSrc(pastedText);
    }
  };

  const { isOpen, onClose, onOpen } = useDisclosure();
  const [fnToCall, setFnToCall] = useState<{
    name: string;
    inputs: any[];
    outputs: any[];
    stateMutability: string;
  } | null>(null);

  const handleItemClick = async (
    name: string,
    inputs: any[],
    outputs: any[],
    stateMutability: string,
  ) => {
    if (!stateMutability) {
      return;
    }
    setFnToCall({ name, inputs, outputs, stateMutability });
    onOpen();
  };

  useEffect(() => {
    if (types[0]) setFilter(types[0]);
  }, [abiObject]);

  return (
    <Flex bg="#282a36" w="100%" minH="100%" direction="column" overflowY="auto" flex="2">
      <ABIFunctionModal
        isOpen={isOpen}
        onClose={onClose}
        name={fnToCall?.name}
        inputs={fnToCall?.inputs ?? []}
        outputs={fnToCall?.outputs}
        abi={abiObject}
        contractAddress={web3.utils.isAddress(src) ? src : ""}
        stateMutability={fnToCall?.stateMutability ?? ""}
      />
      <Flex
        gap="0px"
        alignItems="center"
        h="40px"
        bg="#191a21"
        boxShadow="0px 2px 2px black"
        fontWeight="700"
        userSelect="none"
      >
        {types.concat(stateMutabilities).map((type: string, idx: number) => (
          <Flex
            key={idx}
            px="20px"
            onClick={() => {
              setFilter(type);
              if (search) {
                setSavedSearch(search);
                setSearch("");
              }
            }}
            color={filter === type && !search ? "#CCCCCC" : "#7b7f8b"}
            bg={filter === type && !search ? "#282a36" : "#262626"}
            h="100%"
            alignItems="center"
            cursor="pointer"
            borderRight="1px solid black"
            borderTop={filter === type && !search ? "1px solid #ff54a2" : "none"}
          >
            {type}
          </Flex>
        ))}
        {abiObject.length > 0 && (
          <Flex
            alignItems={"center"}
            h="100%"
            bg={search ? "#282a36" : "#262626"}
            cursor="default"
            borderBottom={"1px solid #777777"}
          >
            <Text
              pl="60px"
              pr="10px"
              bg={search ? "#282a36" : "#262626"}
              color={search ? "#CCCCCC" : "#7b7f8b"}
              onClick={() => {
                setSearch(savedSearch);
                searchRef.current?.focus();
              }}
              cursor="pointer"
            >
              Search
            </Text>
          </Flex>
        )}
        {abiObject.length > 0 && (
          <InputGroup>
            <Input
              border="none"
              borderBottom="1px solid #777777"
              borderRadius="0"
              color="#CCCCCC"
              ref={searchRef}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSavedSearch(e.target.value);
              }}
              _focus={{ border: "none", borderBottom: "1px solid #777777" }}
              _active={{ border: "none", borderBottom: "1px solid #777777" }}
              _focusVisible={{ border: "none", borderBottom: "1px solid #777777" }}
              spellCheck="false"
            />
            <InputRightElement>
              <AiOutlineClose
                cursor="pointer"
                color="#BBBBBB"
                onClick={() => {
                  setSavedSearch("");
                  setSearch("");
                }}
              />
            </InputRightElement>
          </InputGroup>
        )}
      </Flex>
      <Flex
        pl="20px"
        w="100"
        h="40px"
        minH="40px"
        alignItems="center"
        bg="#282a36"
        boxShadow="0px 2px 2px black"
      >
        <Input
          placeholder="paste url of JSON file OR address of verified contract (for this option login is needed)"
          value={src}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          border="none"
          _focus={{ border: "none" }}
          _active={{ border: "none" }}
          _focusVisible={{ border: "none" }}
          _placeholder={{ color: "#7b7f8b" }}
          minW="100%"
          w="100%"
          spellCheck="false"
          color="#AAAAAA"
        />
      </Flex>
      {abiObject && (
        <Flex
          direction="column"
          pl="40px"
          py="10px"
          overflowY="auto"
          fontFamily="Cascadia code, sans-serif"
        >
          {abiObject.filter(filterFunction).map(
            (
              item: {
                type: string;
                stateMutability: string;
                name: string;
                inputs: any[];
                outputs: any[];
              },
              idx: any,
            ) => (
              <Text
                key={idx}
                mt="5px"
                border="0px solid white"
                textIndent="-20px"
                ml="20px"
                pr="20px"
                onClick={() =>
                  handleItemClick(item.name, item.inputs, item.outputs, item.stateMutability)
                }
                w="fit-content"
                cursor={item.type === "function" ? "pointer" : "default"}
              >
                <span style={{ color: colorScheme.name }}>{item.name}</span>
                {":  ("}
                <Inputs inputs={item.inputs} />
                {item.outputs ? ") => " : ")"}
                {item.outputs && <Outputs outputs={item.outputs} />}
              </Text>
            ),
          )}
        </Flex>
      )}
    </Flex>
  );
};

export default ABIViewRightPanel;
