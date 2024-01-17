import { Flex, Input, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { Address } from "../../hooks/useRecentAddresses";
import { AiOutlineEdit } from "react-icons/ai";

const ABIRecentAddresses = ({
  setStoredAddress,
  recentAddresses,
  addRecentAddress,
}: {
  setStoredAddress: (arg0: { address: string }) => void;
  recentAddresses: Address[];
  addRecentAddress: (address: string, fields: Record<string, string>) => void;
}) => {
  const [editingItemId, setEditingItemId] = useState(-1);
  const [newTitle, setNewTitle] = useState("");
  const shortSrc = (src: string) => {
    if (src.includes("/")) {
      return src.split("/").slice(-1);
    }
    return `${src.slice(0, 6)}...${src.slice(-4)}`;
  };

  const handleClick = (address: string) => {
    setStoredAddress({ address });
  };

  return (
    <Flex
      bg="#1b1d22"
      w="100%"
      minH="100%"
      direction="column"
      overflowY="auto"
      flex="1"
      p={"20px"}
      color={"#CCC"}
      borderRight={"1px solid #777"}
    >
      <Text fontSize={"20px"} mb={"20px"}>
        Addresses
      </Text>
      <Flex direction={"column"} gap={"10px"} color={"#AAA"}>
        {recentAddresses.map((address: Address, idx: number) => (
          <Flex direction={"column"} key={address.address} borderBottom={"1px solid #666"}>
            <Text
              fontFamily={"Roboto Mono, monospace"}
              fontSize={"16px"}
              color={"#DDD"}
              onClick={() => handleClick(address.address)}
              cursor={"pointer"}
            >
              {address.address}
            </Text>
            <Flex gap={"10px"} justifyContent={"space-between"}>
              <Text>{shortSrc(address.src)}</Text>

              {editingItemId !== idx && (
                <Flex gap={"10px"} alignItems={"center"}>
                  <Text
                    onClick={() => {
                      setEditingItemId(idx);
                      setNewTitle(address.givenTitle ?? address.field);
                    }}
                  >
                    {address.givenTitle ?? address.field}
                  </Text>
                  <AiOutlineEdit
                    cursor="pointer"
                    onClick={() => {
                      setEditingItemId(idx);
                      setNewTitle(address.givenTitle ?? address.field);
                    }}
                  />
                </Flex>
              )}
              {editingItemId === idx && (
                <Input
                  value={newTitle}
                  py="3px"
                  maxH="27px"
                  autoFocus
                  onBlur={() => setEditingItemId(-1)}
                  onChange={(e) => setNewTitle(e.target.value)}
                  type="text"
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      addRecentAddress(address.address, { givenTitle: newTitle });
                      setEditingItemId(-1);
                    } else if (e.key === "Escape") {
                      setEditingItemId(-1);
                    }
                  }}
                />
              )}
            </Flex>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};

export default ABIRecentAddresses;
