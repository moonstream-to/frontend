import { CloseIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  IconButton,
  Image,
  Input,
  Radio,
  RadioGroup,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { AWS_ASSETS_PATH_CF } from "../../constants";
import useAnalytics from "../../contexts/AnalyticsContext";
import Web3Context from "../../contexts/Web3Context/context";
import AddTagModal from "../AddTagModal";
import Tag from "../Tag";
const metamaskIcon = `${AWS_ASSETS_PATH_CF}/icons/metamask.png`;

const AnalyticsNewAddressView = () => {
  const { addresses, setIsCreatingAddress } = useAnalytics();
  const [address, setAddress] = useState("");
  const [isConnectingMetamask, setIsConnectingMetamask] = useState(false);
  const { account, onConnectWalletClick } = useContext(Web3Context);
  const [metamaskAddress, setMetamaskAddress] = useState("");
  const [type, setType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const loadFromMetamask = () => {
    if (account) {
      setAddress(account);
      setMetamaskAddress(account);
    } else {
      setIsConnectingMetamask(true);
      onConnectWalletClick();
    }
  };

  const isLoadedFromMetamask = address !== "" && address === metamaskAddress && account;
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
    if (newTag.trim() !== "") {
      setTags((prevTags) => [...prevTags, newTag]);
    }
    onClose();
  };

  return (
    <Flex borderRadius="20px" bg="#2d2d2d" w="100%" minH="100%" maxW="800px" minW="800px">
      <AddTagModal isOpen={isOpen} onClose={onClose} onAddTag={handleAddTag} />

      <Flex direction="column" p="30px" gap="30px" overflowY="auto" w="100%">
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
        <Flex gap="5px" h="24px" wrap="wrap" alignItems="center">
          {tags.map((a: string, idx: number) => (
            <Tag key={idx} name={a} h="24px" />
          ))}
          <Button
            onClick={onOpen}
            variant="transparent"
            color="#BFBFBF"
            fontSize="14px"
            py="0"
            h="fit-content"
          >
            + Add a tag...
          </Button>
        </Flex>

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
              // w="100%"
              placeholder="Enter address or etherscan/polygonscan link to address"
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
          <RadioGroup colorScheme="orange" onChange={setType} value={type}>
            <Flex py="10px" gap="30px">
              <Radio fontSize="26px" value="smartcontract">
                Smart contract
              </Radio>
              <Radio value="Regular account">Regular account</Radio>
            </Flex>
          </RadioGroup>
        </Flex>
        <Flex direction="column" gap="10px" w="100%">
          <Text variant="label">Title</Text>
          <Input
            fontSize="18px"
            borderRadius="10px"
            _placeholder={{ fontSize: "16px" }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            // w="100%"
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
            // w="100%"
            placeholder="Enter description"
            w="100%"
          />
        </Flex>
        <Button placeSelf="end" variant="saveButton">
          Watch
        </Button>
      </Flex>
    </Flex>
  );
};

export default AnalyticsNewAddressView;
