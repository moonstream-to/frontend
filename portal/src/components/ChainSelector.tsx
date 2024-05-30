/* eslint-disable prettier/prettier */
import React, { useContext } from "react";

import {
  Menu,
  MenuItem,
  MenuList,
  Image,
  MenuButton,
  Button,
  Icon,
  Flex,
  Text,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { MdOutlineLaptopMac } from "react-icons/md";

import Web3Context from "../contexts/Web3Context/context";
import { AWS_ASSETS_PATH } from "../constants";

import ChainSelectorItem from "./ChainSelectorItem";

const assets = {
  ethereum: `${AWS_ASSETS_PATH}/eth-diamond-rainbow.png`,
  polygon: `${AWS_ASSETS_PATH}/matic-token-inverted-icon.png`,
  mumbai: `${AWS_ASSETS_PATH}/matic-token-inverted-icon.png`,
  amoy: `${AWS_ASSETS_PATH}/matic-token-inverted-icon.png`,
  xai: `${AWS_ASSETS_PATH}/xai-token-logo.png`,
  xai_sepolia: `${AWS_ASSETS_PATH}/xai-token-logo.png`,
  wyrm: `${AWS_ASSETS_PATH}/great-wyrm-network-logo.png`,
};

const ChainSelector = ({ color = "white" }: { color?: string }) => {
  const web3Provider = useContext(Web3Context);
  return (
    <Menu>
      <MenuButton
        h="36px"
        borderRadius="10px"
        as={Button}
        borderColor={color}
        textDecoration="none"
        _active={{ textDecoration: "none", backgroundColor: "black.300" }}
        _focus={{ textDecoration: "none", backgroundColor: "black.300" }}
        _hover={{ textDecoration: "none", fontWeight: "700" }}
        rightIcon={<ChevronDownIcon />}
        leftIcon={
          ["ethereum", "mumbai", "polygon", "wyrm", "amoy", "xai", "xai_sepolia"].includes(
            web3Provider?.targetChain?.name ?? "",
          ) ? (
            <Image
              display={"inline"}
              alt="chain"
              h="24px"
              mr={4}
              src={assets[web3Provider.targetChain?.name as keyof typeof assets] ?? ""}
            ></Image>
          ) : undefined
        }
        color={color}
        variant="outline"
        fontSize="16px"
      >
        {web3Provider.targetChain?.displayName ??
          web3Provider.targetChain?.name ??
          "Chain selector"}
      </MenuButton>
      <MenuList bg="#1A1D22" color={color} borderRadius="30px" border="1px solid white" pl="15px">
        <MenuItem
          isDisabled={web3Provider.targetChain?.name === "ethereum"}
          onClick={() => {
            web3Provider.changeChain("ethereum");
          }}
        >
          <ChainSelectorItem name="Ethereum" img={assets.ethereum} />
        </MenuItem>
        <MenuItem
          isDisabled={web3Provider.targetChain?.name === "polygon"}
          onClick={() => {
            web3Provider.changeChain("polygon");
          }}
        >
          <ChainSelectorItem name="Polygon" img={assets.polygon} />
        </MenuItem>
        <MenuItem
          isDisabled={web3Provider.targetChain?.name === "mumbai"}
          onClick={() => {
            web3Provider.changeChain("mumbai");
          }}
        >
          <ChainSelectorItem name="Mumbai" img={assets.mumbai} />
        </MenuItem>
        <MenuItem
          isDisabled={web3Provider.targetChain?.name === "amoy"}
          onClick={() => {
            web3Provider.changeChain("amoy");
          }}
        >
          <ChainSelectorItem name="Amoy" img={assets.amoy} />
        </MenuItem>
        <MenuItem
          isDisabled={web3Provider.targetChain?.name === "xai"}
          onClick={() => {
            web3Provider.changeChain("xai");
          }}
        >
          <ChainSelectorItem name="Xai" img={assets.xai} />
        </MenuItem>
        <MenuItem
          isDisabled={web3Provider.targetChain?.name === "xai_sepolia"}
          onClick={() => {
            web3Provider.changeChain("xai_sepolia");
          }}
        >
          <ChainSelectorItem name="Xai Testnet v2" img={assets.xai} />
        </MenuItem>
        <MenuItem
          isDisabled={web3Provider.targetChain?.name === "wyrm"}
          onClick={() => {
            web3Provider.changeChain("wyrm");
          }}
        >
          <ChainSelectorItem name="Wyrm" img={assets.wyrm} />
        </MenuItem>
        <MenuItem
          isDisabled={web3Provider.targetChain?.name === "localhost"}
          onClick={() => {
            web3Provider.changeChain("localhost");
          }}
        >
          <Flex justifyContent="center" w="24px">
            <Icon h="24px" as={MdOutlineLaptopMac} />
          </Flex>
          <Text ml="15px">Localhost</Text>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
export default ChainSelector;
