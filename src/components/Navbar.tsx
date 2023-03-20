import RouterLink from "next/link"

import React, { useContext } from "react"
import { Button, Image, Link, Flex, Badge, Skeleton, useMediaQuery } from "@chakra-ui/react"

import Web3Context from "../contexts/Web3Context/context"
import ChainSelector from "./ChainSelector"

const Navbar = ({ home, ...props }: { home?: boolean; [x: string]: any }) => {
  const [isMobileView] = useMediaQuery("(max-width: 767px)")
  const AWS_ASSETS_PATH = `https://s3.amazonaws.com/static.simiotics.com/moonstream/assets`
  const PRIMARY_MOON_LOGO_URL = `${AWS_ASSETS_PATH}/moonstream-full-logo-2022.png`
  const web3Provider = useContext(Web3Context)

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
      {...props}
    >
      <RouterLink href="/" passHref>
        {/* {home ? ()} */}
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
          {web3Provider.buttonText !== web3Provider.WALLET_STATES.CONNECTED && (
            <Button
              variant="orangeGradient"
              fontSize="16px"
              isDisabled={web3Provider.WALLET_STATES.UNKNOWN_CHAIN === web3Provider.buttonText}
              onClick={web3Provider.onConnectWalletClick}
            >
              {web3Provider.buttonText}
            </Button>
          )}

          {web3Provider.buttonText === web3Provider.WALLET_STATES.CONNECTED && (
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
        </Flex>
      )}
    </Flex>
  )
}

export default Navbar
