import { useContext, useEffect, useState } from "react";
import { Button, Flex, Image, Input, Text } from "@chakra-ui/react";
import Web3Context from "../contexts/Web3Context/context";
import { AWS_ASSETS_PATH_CF } from "../constants";

const metamaskIcon = `${AWS_ASSETS_PATH_CF}/icons/metamask.png`;

interface UserWeb3AddressInputProps {
  value: string;
  setAddress: (arg0: string) => void;
  showInvalid: boolean;
  column?: boolean;
  fontSize: string;
  [x: string]: any;
}

const UserWeb3AddressInput: React.FC<UserWeb3AddressInputProps> = ({
  value,
  setAddress,
  showInvalid,
  column = false,
  fontSize,
  ...props
}) => {
  const { web3, account, onConnectWalletClick } = useContext(Web3Context);
  const isAddressValid = web3.utils.isAddress(value);
  const [metamaskAddress, setMetamaskAddress] = useState("");
  const isLoadedFromMetamask = value !== "" && value === metamaskAddress && value === account;
  const [isConnectingMetamask, setIsConnectingMetamask] = useState(false);

  const loadFromMetamask = () => {
    if (account) {
      setAddress(account);
      setMetamaskAddress(account);
    } else {
      setIsConnectingMetamask(true);
      onConnectWalletClick();
    }
  };

  useEffect(() => {
    if (isConnectingMetamask) {
      if (account) {
        setAddress(account);
        setMetamaskAddress(account);
      }
      setIsConnectingMetamask(false);
    }
  }, [account]);

  return (
    <Flex direction="column" gap="10px" fontSize={fontSize}>
      <Text variant="label">Address</Text>
      <Flex
        justifyContent="start"
        gap="10px"
        alignItems={column ? "start" : "center"}
        direction={column ? "column" : "row"}
      >
        <Input
          variant="address"
          fontSize={fontSize}
          w="42ch"
          spellCheck={false}
          borderRadius="10px"
          borderColor={!showInvalid || isAddressValid ? "white" : "error.500"}
          _placeholder={{ fontSize: "12px" }}
          value={value}
          onChange={(e) => setAddress(e.target.value)}
          {...props}
        />
        {!isLoadedFromMetamask && (
          <>
            or
            <Button
              variant="transparent"
              fontWeight="400"
              borderRadius="10px"
              border="1px solid white"
              onClick={() => loadFromMetamask()}
              fontSize={fontSize}
            >
              <Flex gap="10px" alignItems="center">
                Load from metamask
                <Image
                  w={{ base: "16px", sm: "20px" }}
                  h={{ base: "14px", sm: "18px" }}
                  alt="metamask"
                  src={metamaskIcon}
                />
              </Flex>
            </Button>
          </>
        )}
      </Flex>
    </Flex>
  );
};

export default UserWeb3AddressInput;
