import RouterLink from "next/link";

import React, { useContext } from "react";
import {
  Button,
  Image,
  Link,
  Flex,
  Badge,
  Skeleton,
  useMediaQuery,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  useDisclosure,
  Text,
} from "@chakra-ui/react";

import Web3Context from "../contexts/Web3Context/context";
import ChainSelector from "./ChainSelector";
import LoginButton from "./LoginButton";
import { BsPerson } from "react-icons/bs";
import useUser from "../contexts/UserContext";
import useLogout from "../hooks/useLogout";
import NodeBalancerInfo from "./NodeBalancerInfo";

const Navbar = ({ home, ...props }: { home?: boolean; [x: string]: any }) => {
  const [isMobileView] = useMediaQuery("(max-width: 767px)");
  const { user } = useUser();
  const AWS_ASSETS_PATH = `https://s3.amazonaws.com/static.simiotics.com/moonstream/assets`;
  const PRIMARY_MOON_LOGO_URL = `${AWS_ASSETS_PATH}/moonstream-full-logo-2022.png`;
  const web3Provider = useContext(Web3Context);
  const { logout, isLoading: isLoggingOut } = useLogout();

  const { onOpen, isOpen, onClose } = useDisclosure();

  return (
    <Flex
      zIndex={1}
      alignItems="center"
      id="Navbar"
      minH="56px"
      maxH="56px"
      bgColor="#1A1D22"
      w="100%"
      overflow="hidden"
      justifyContent="space-between"
      borderBottom="1px solid white"
      {...props}
    >
      <RouterLink href="/" passHref>
        {/* {home ? ()}  //TODO */}
        <Link
          as={Image}
          w="160px"
          h="auto"
          justifyContent="left"
          src={PRIMARY_MOON_LOGO_URL}
          alt="Logo"
        />
      </RouterLink>

      {!isMobileView && (
        <Flex alignItems="center" gap="20px">
          {(web3Provider.buttonText !== web3Provider.WALLET_STATES.CONNECTED ||
            !web3Provider.account) && (
            <Button
              variant="orangeGradient"
              fontSize="16px"
              isDisabled={web3Provider.WALLET_STATES.UNKNOWN_CHAIN === web3Provider.buttonText}
              onClick={web3Provider.onConnectWalletClick}
            >
              {web3Provider.account
                ? web3Provider.buttonText
                : web3Provider.buttonText === web3Provider.WALLET_STATES.ONBOARD
                ? "Install Metamask"
                : "Connect with Metamask"}
            </Button>
          )}

          {web3Provider.buttonText === web3Provider.WALLET_STATES.CONNECTED &&
            web3Provider.account && (
              <Flex>
                <code>
                  <Badge
                    p="10px 1vw"
                    fontWeight="400"
                    textTransform="none"
                    backgroundColor="white"
                    color="#1A1D22"
                    borderRadius="10px"
                    mr={2}
                    h="36px"
                  >
                    <Skeleton
                      isLoaded={!!web3Provider.account}
                      colorScheme={"red"}
                      w="100%"
                      borderRadius={"inherit"}
                      startColor="red.500"
                      endColor="blue.500"
                      fontSize="min(16px, 9px + 0.5vw)"
                      lineHeight="16px"
                      p={0}
                    >
                      {web3Provider.account}
                    </Skeleton>
                  </Badge>
                </code>
              </Flex>
            )}
          <ChainSelector />
          <Flex w="2px" bg="#4d4d4d" h="30px" />
          {!user && (
            <LoginButton>
              <Button
                bg="#353535"
                borderRadius="20px"
                maxH="36px"
                p="5px 15px"
                fontSize="16px"
                fontWeight="400"
                minW="90px"
                _hover={{
                  bg: "#353535",
                }}
                _focus={{
                  outline: "none",
                }}
              >
                Log in
              </Button>
            </LoginButton>
          )}
          {user && !isLoggingOut && (
            <Menu>
              <NodeBalancerInfo onClose={onClose} isOpen={isOpen} />
              <MenuButton>
                <Flex gap="10px" alignItems="center">
                  <BsPerson />
                  Account
                </Flex>
              </MenuButton>
              <MenuList borderRadius="10px" border="1px solid white" minW="fit-content" p="20px">
                <MenuItem p="0px" mb="10px">
                  Settings
                </MenuItem>

                <MenuItem p="0px" mb="10px">
                  <RouterLink href="/tokens">API tokens</RouterLink>
                </MenuItem>
                <MenuItem p="0px" mb="10px">
                  <Text fontWeight="400" px="0" onClick={() => onOpen()}>
                    NodeBalancer info
                  </Text>
                </MenuItem>
                <Divider mb="10px" />
                <MenuItem p="0px" onClick={() => logout()}>
                  Log out
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </Flex>
      )}
    </Flex>
  );
};

export default Navbar;
