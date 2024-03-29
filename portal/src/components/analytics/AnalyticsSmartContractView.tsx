import { useEffect, useState } from "react";

import { useMutation, useQuery, useQueryClient } from "react-query";
import { EditIcon } from "@chakra-ui/icons";
import {
  Flex,
  IconButton,
  Input,
  Link,
  Spacer,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";

import useAnalytics from "../../contexts/AnalyticsContext";
import useMoonToast from "../../hooks/useMoonToast";
import { SubscriptionsService } from "../../services";
import http from "../../utils/httpMoonstream";
import AnalyticsAddressTags from "./AnalyticsAddressTags";
import AnalyticsChainSelector from "./AnalyticsChainSelector";
import AnalyticsEOADetails from "./AnalyticsEOADetails";
import AnalyticsQueryView from "./AnalyticsQueryView";
import AnalyticsSmartContractDetails from "./AnalyticsSmartContractDetails";
import AnalyticsSmartContractQueries, { QueryInterface } from "./AnalyticsSmartContractQueries";
import DeleteSubscriptionDialog from "./DeleteSubscriptionDialog";

const AnalyticsSmartContractView = ({ address }: { address: any }) => {
  const API = process.env.NEXT_PUBLIC_MOONSTREAM_API_URL;
  const toast = useMoonToast();

  const [selectedIdx, setSelectedIdx] = useState(-1);

  const [eoaChain, setEoaChain] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [abi, setABI] = useState("");
  const { onOpen: onOpenDelete, isOpen: isOpenDelete, onClose: onCloseDelete } = useDisclosure();

  const { templates } = useAnalytics();

  useEffect(() => {
    setSelectedIdx(-1);
  }, [address]);

  const handleAddTag = (newTag: string) => {
    //TODO add tag to DB
  };

  const handleDeleteTag = (tag: string) => {
    // TODO delete tag from DB
  };

  const chainName = address?.type === "eoa" ? eoaChain : address.chainName; //address?.subscription_type_id.split("_")[0];

  function removeDuplicatesByContextURL(array: QueryInterface[]) {
    const uniqueArray = [];
    const seenContextIds = new Set();

    for (const obj of array) {
      if (!seenContextIds.has(obj.context_url)) {
        uniqueArray.push(obj);
        seenContextIds.add(obj.context_url);
      }
    }

    return uniqueArray;
  }

  const supportedQueries = useQuery(
    ["supportedQueries", address.id],
    async () => {
      if (address.type === "smartcontract") {
        const supportedInterfaces = await http({
          method: "GET",
          url: `${API}/subscriptions/supported_interfaces`,
          params: {
            address: address.address,
            blockchain: chainName,
          },
        }).then((res) => res.data.interfaces);
        const selectors: string[] = ["any"];
        Object.keys(supportedInterfaces).forEach((key) =>
          selectors.push(supportedInterfaces[key].selector),
        );
        const queries: QueryInterface[] = [];
        Object.keys(templates.data)
          .filter((selector) => selectors.includes(selector))
          .forEach((key) => templates.data[key].forEach((q: QueryInterface) => queries.push(q)));
        return removeDuplicatesByContextURL(queries);
      } else {
        return templates.data["EOA"];
      }
    },
    {
      enabled: !!templates.data,
      staleTime: 50000,
    },
  );

  const queryClient = useQueryClient();
  const updateSubscription = useMutation(SubscriptionsService.modifySubscription(), {
    onError: (error: Error) => toast(error.message, "error"),
    onSuccess: () => {
      setIsEditingTitle(false);
      queryClient.invalidateQueries("subscriptions");
    },
  });

  const handleTitleChange = () => {
    if (newTitle !== address.label && newTitle) {
      updateSubscription.mutate({ id: address.id, label: newTitle });
    }
  };

  return (
    <Flex borderRadius="20px" bg="#2d2d2d" minH="100%" w="100%" direction="column">
      <Flex direction="column" p="30px" gap="30px" w="100%">
        {isEditingTitle ? (
          <>
            <Flex gap="15px" alignItems="center">
              <Input
                variant="text"
                fontSize="18px"
                borderRadius="10px"
                _placeholder={{ fontSize: "16px" }}
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter new title"
                w="100%"
                autoFocus
              />
              {updateSubscription.isLoading ? (
                <Spinner w="16px" h="16px" />
              ) : (
                <IconButton
                  variant="transparent"
                  minWidth="0"
                  aria-label="save"
                  icon={<AiOutlineCheck />}
                  isDisabled={newTitle === "" || newTitle === address.label}
                  onClick={() => handleTitleChange()}
                />
              )}
              <IconButton
                variant="transparent"
                aria-label="close"
                minWidth="0"
                icon={<AiOutlineClose />}
                isDisabled={updateSubscription.isLoading}
                onClick={() => {
                  setNewTitle("");
                  setIsEditingTitle(false);
                }}
              />
            </Flex>
            <DeleteSubscriptionDialog
              isOpen={isOpenDelete}
              onClose={() => {
                setIsEditingTitle(false);
                onCloseDelete();
              }}
              contract={address}
            />
            <Text
              cursor={"pointer"}
              onClick={onOpenDelete}
              color={"#F5B3B3"}
              mt={"-10px"}
              w={"fit-content"}
              fontWeight={"700"}
            >
              Unwatch address
            </Text>
          </>
        ) : (
          <Flex gap="15px" alignItems="baseline">
            <Text variant="title">{address.label}</Text>
            <EditIcon
              cursor="pointer"
              onClick={() => {
                setNewTitle(address.label);
                setIsEditingTitle(true);
              }}
            />
          </Flex>
        )}
        {address.type === "smartcontract" && (
          <AnalyticsAddressTags
            tags={address.tags}
            chainName={address.displayName}
            // onAdd={handleAddTag}
            onDelete={(t: string) => handleDeleteTag(t)}
          />
        )}
        {address.description && (
          <Text variant="text" pr="160px">
            {address.description}
          </Text>
        )}
        {address.type === "smartcontract" ? (
          <AnalyticsSmartContractDetails
            address={address.address}
            id={address.id}
            chain={chainName}
            isAbi={address.abi === "True"}
            setABI={setABI}
          />
        ) : (
          <AnalyticsEOADetails address={address.address} created_at={address.created_at} />
        )}
        <Flex justifyContent="space-between" alignItems="center" gap="20px">
          <Text variant="title2">Analytics</Text>
          {(supportedQueries.isLoading || templates.isLoading) && <Spinner size="sm" />}
          <Spacer />
          <Link isExternal href="https://discord.gg/K56VNUQGvA" _hover={{ textDecoration: "none" }}>
            <Text my="auto" color="#F88F78" fontSize="14px" cursor="pointer">
              Request new
            </Text>
          </Link>
        </Flex>
        {address.type === "eoa" && (
          <AnalyticsChainSelector selectedChain={eoaChain} setSelectedChain={setEoaChain} />
        )}
        {supportedQueries.data && (
          <AnalyticsSmartContractQueries
            queries={supportedQueries.data}
            selectedIdx={selectedIdx}
            onChange={setSelectedIdx}
          />
        )}
        {supportedQueries.data && selectedIdx > -1 && supportedQueries.data[selectedIdx] && (
          <AnalyticsQueryView
            query={supportedQueries.data[selectedIdx]}
            address={address.address}
            chainName={chainName}
            type={address.type}
            abi={abi}
          />
        )}
      </Flex>
    </Flex>
  );
};

export default AnalyticsSmartContractView;
