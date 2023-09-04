import { Flex, Input, Text } from "@chakra-ui/react";
import useRecentAddresses from "../../hooks/useRecentAddresses";
import React, { useState } from "react";

const ABIRecentAddresses = ({
  setStoredAddress,
  recentAddresses,
  addRecentAddress,
}: {
  setStoredAddress: (address: string) => void;
  recentAddresses: any;
  addRecentAddress: any;
}) => {
  // const { recentAddresses, addRecentAddress } = useRecentAddresses("ABIExplorer-addresses");
  const [editingItemId, setEditingItemId] = useState(-1);
  const [newTitle, setNewTitle] = useState("");
  const shortSrc = (src: string) => {
    if (src.includes("/")) {
      return src.split("/").slice(-1);
    }
    return `${src.slice(0, 6)}...${src.slice(-4)}`;
  };

  return (
    <Flex
      bg="#262626"
      w="100%"
      minH="100%"
      direction="column"
      overflowY="auto"
      flex="1"
      p={"20px"}
      color={"#CCC"}
    >
      <Text fontSize={"20px"} mb={"20px"}>
        Addresses
      </Text>
      <Flex direction={"column"} gap={"10px"} color={"#AAA"}>
        {recentAddresses.map((address: any, idx: number) => (
          <Flex direction={"column"} key={address.address} borderBottom={"1px solid #666"}>
            <Text
              fontFamily={"Roboto Mono, monospace"}
              fontSize={"16px"}
              color={"#DDD"}
              onClick={() => setStoredAddress(address.address)}
              cursor={"pointer"}
            >
              {address.address}
            </Text>
            <Flex gap={"10px"} justifyContent={"space-between"}>
              <Text>{shortSrc(address.src)}</Text>

              {editingItemId !== idx && (
                <Text
                  onClick={() => {
                    setEditingItemId(idx);
                    setNewTitle("");
                  }}
                >
                  {address.givenTitle ?? address.field}
                </Text>
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
