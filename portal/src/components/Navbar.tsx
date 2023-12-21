import RouterLink from "next/link";

import React, { useContext, useState } from "react";
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
} from "@chakra-ui/react";

import Web3Context from "../contexts/Web3Context/context";
import ChainSelector from "./ChainSelector";
import { BsPerson } from "react-icons/bs";
import useUser from "../contexts/UserContext";
import useLogout from "../hooks/useLogout";
import SignUp from "./SignUp";
import Account from "./Account";

const Navbar = ({ home, ...props }: { home?: boolean; [x: string]: any }) => {
  const [isMobileView] = useMediaQuery("(max-width: 767px)");
  const { user } = useUser();
  const AWS_ASSETS_PATH = `https://s3.amazonaws.com/static.simiotics.com/moonstream/assets`;
  const PRIMARY_MOON_LOGO_URL = `${AWS_ASSETS_PATH}/moonstream-full-logo-2022.png`;
  const web3Provider = useContext(Web3Context);
  const { logout, isLoading: isLoggingOut } = useLogout();
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

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
      <SignUp isOpen={isSignUpOpen} onClose={() => setIsSignUpOpen(false)} />

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
          <Account />
        </Flex>
      )}
    </Flex>
  );
};

export default Navbar;
