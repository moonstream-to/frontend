import { CloseIcon } from "@chakra-ui/icons";
import {
  Button,
  Collapse,
  Flex,
  IconButton,
  Image,
  Input,
  Radio,
  RadioGroup,
  Spinner,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { AWS_ASSETS_PATH_CF, ChainName, getChainImage } from "../../constants";
import useAnalytics from "../../contexts/AnalyticsContext";
import Web3Context from "../../contexts/Web3Context/context";
import useMoonToast from "../../hooks/useMoonToast";
import { SubscriptionsService } from "../../services";
import AnalyticsABIView from "./AnalyticsABIView";
import AnalyticsAddressTags from "./AnalyticsAddressTags";
const metamaskIcon = `${AWS_ASSETS_PATH_CF}/icons/metamask.png`;
const chainNames: ChainName[] = ["ethereum", "polygon", "mumbai", "gnosis", "wyrm"];

const AnalyticsNewAddressView = () => {
  const { addresses, setIsCreatingAddress, setSelectedAddressId } = useAnalytics();
  const [address, setAddress] = useState("");
  const [isConnectingMetamask, setIsConnectingMetamask] = useState(false);
  const { account, onConnectWalletClick, web3 } = useContext(Web3Context);
  const [metamaskAddress, setMetamaskAddress] = useState("");
  const [type, setType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [chainName, setChainName] = useState("");
  const [showInvalid, setShowInvalid] = useState(false);
  const [abi, setABI] = useState("");

  const loadFromMetamask = () => {
    if (account) {
      setAddress(account);
      setMetamaskAddress(account);
    } else {
      setIsConnectingMetamask(true);
      onConnectWalletClick();
    }
  };

  const isLoadedFromMetamask = address !== "" && address === metamaskAddress && address === account;

  useEffect(() => {
    if (isConnectingMetamask) {
      if (account) {
        setAddress(account);
        setMetamaskAddress(account);
      }
      setIsConnectingMetamask(false);
    }
  }, [account]);

  const handleAddTag = (newTag: string) => {
    if (newTag.trim() !== "" && !tags.includes(newTag)) {
      setTags((prevTags) => [...prevTags, newTag]);
    }
  };

  const queryClient = useQueryClient();
  const createSubscription = useMutation(SubscriptionsService.createSubscription(), {
    onError: (error: Error) => toast(error.message, "error"),
    onSuccess: () => {
      setSelectedAddressId(0);
      setIsCreatingAddress(false);
      queryClient.invalidateQueries("subscriptions");
    },
  });

  const toast = useMoonToast();

  const isInputsValid = () => {
    setShowInvalid(true);
    return isAddressValid && isTitleValid && isTypeValid && isChainValid;
  };

  const isAddressValid = web3.utils.isAddress(address);

  const isTitleValid = !!title;

  const isTypeValid = !!type;

  const isChainValid = type === "regularAccount" || !!chainName;

  useEffect(() => {
    setShowInvalid(false);
  }, [address, title, type, chainName]);

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const value = e.clipboardData.getData("text/plain");
    if (web3.utils.isAddress(value)) {
      return;
    }
    e.preventDefault();
    const position = value.indexOf("0x");
    if (position !== -1) {
      const newAddress = value.slice(position, position + 42);
      if (web3.utils.isAddress(newAddress)) {
        setAddress(web3.utils.toChecksumAddress(newAddress));
        return;
      }
    }
    toast("Can't extract address", "error");
  };

  return (
    <Flex
      borderRadius="20px"
      bg="#2d2d2d"
      w="100%"
      minH="100%"
      maxW="800px"
      minW="800px"
      direction="column"
      overflowY="auto"
    >
      <Flex direction="column" p="30px" gap="30px" w="100%">
        <Flex justifyContent="space-between" alignItems="center">
          <Text variant="title"> Watch new address</Text>
          {addresses.data?.length > 0 && (
            <IconButton
              variant="transparent"
              aria-label="close"
              icon={<CloseIcon />}
              onClick={() => setIsCreatingAddress(false)}
            />
          )}
        </Flex>
        <AnalyticsAddressTags
          tags={tags}
          chainName={type === "smartcontract" ? chainName : undefined}
          onAdd={handleAddTag}
          onDelete={(t) => setTags(tags.filter((tag) => tag !== t))}
        />
        <Flex direction="column" gap="10px">
          <Text variant="label">Address</Text>
          <Flex justifyContent="space-between" gap="10px" alignItems="center">
            <Input
              variant="address"
              fontSize="18px"
              borderRadius="10px"
              _placeholder={{ fontSize: "16px" }}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              borderColor={!showInvalid || isAddressValid ? "white" : "error.500"}
              placeholder="Enter address or etherscan/polygonscan link to address"
              onPaste={handlePaste}
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
                >
                  <Flex gap="10px">
                    Load from metamask
                    <Image h="18px" w="20px" alt="metamask" src={metamaskIcon} />
                  </Flex>
                </Button>
              </>
            )}
          </Flex>
        </Flex>
        <Flex direction="column" gap="10px">
          <Text variant="label">Account type</Text>
          <RadioGroup
            colorScheme="orange"
            borderBottom="1px solid white"
            borderColor={!showInvalid || isTypeValid ? "transparent" : "error.500"}
            onChange={setType}
            value={type}
            w="fit-content"
          >
            <Flex py="10px" gap="30px">
              <Radio fontSize="26px" value="smartcontract">
                Smart contract
              </Radio>
              <Radio value="regularAccount">Regular account</Radio>
            </Flex>
          </RadioGroup>
        </Flex>
        <Collapse in={type === "smartcontract"}>
          <Flex direction="column" gap="10px" w="100%" transition="all 5s">
            <Text variant="label">Blockchain</Text>
            <Flex
              wrap="wrap"
              gap="10px"
              borderBottom="1px solid white"
              borderColor={!showInvalid || isChainValid ? "transparent" : "error.500"}
              w="fit-content"
              pb="5px"
            >
              {chainNames.map((n, idx: number) => (
                <Flex
                  key={idx}
                  borderRadius="30px"
                  border="1px solid"
                  borderColor={chainName === n ? "white" : "#4D4D4D"}
                  display="inline-flex"
                  alignItems="center"
                  gap="3px"
                  p="8px 15px"
                  cursor="pointer"
                  onClick={() => setChainName(n)}
                >
                  <Image alt="" src={getChainImage(n)} h="20px" filter="invert(100%)" />
                  <Text fontSize="14px" lineHeight="18px" textTransform="uppercase">
                    {n}
                  </Text>
                </Flex>
              ))}
            </Flex>
          </Flex>
        </Collapse>

        <Flex direction="column" gap="10px" w="100%">
          <Text variant="label">Title</Text>
          <Input
            variant="text"
            fontSize="18px"
            borderRadius="10px"
            borderColor={!showInvalid || isTitleValid ? "white" : "error.500"}
            _placeholder={{ fontSize: "16px" }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
            w="100%"
          />
        </Flex>
        <Flex direction="column" gap="10px">
          <Text variant="label">Description</Text>
          <Textarea
            fontSize="18px"
            borderRadius="10px"
            _placeholder={{ fontSize: "16px" }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            w="100%"
          />
        </Flex>
        {type === "smartcontract" && chainName && web3.utils.isAddress(address) && (
          <Flex borderRadius="10px" border="1px solid white" p="20px">
            <AnalyticsABIView
              address={address}
              chain={chainName}
              id="-1"
              isAbi={false}
              setABI={setABI}
            />
          </Flex>
        )}
        <Flex justifyContent="end" gap="20px">
          {addresses.data?.length > 0 && (
            <Button
              variant="cancelButton"
              aria-label="close"
              onClick={() => setIsCreatingAddress(false)}
            >
              Cancel
            </Button>
          )}
          <Button
            variant="saveButton"
            minW="220px"
            onClick={() => {
              if (isInputsValid()) {
                createSubscription.mutate({
                  type:
                    type === "smartcontract" ? `${chainName}_${type}` : "externaly_owned_account",
                  address,
                  label: title,
                  color: "#000000",
                  abi,
                });
              }
            }}
          >
            {!createSubscription.isLoading ? <Text>Watch</Text> : <Spinner />}
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default AnalyticsNewAddressView;
