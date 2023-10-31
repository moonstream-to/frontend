/* eslint-disable @typescript-eslint/no-var-requires */
import React, { useEffect, useState } from "react";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Switch,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import { useRouter } from "next/router";
import DropperV2DropsList from "./DropperV2DropsList";
import DropperV2NewDrop from "./DropperV2NewDrop";

export interface DropperState {
  tokenType: number;
  tokenAddress: string;
  tokenId: string;
  amount: string;
  authorizationTokenAddress: string;
  authorizationPoolId: string;
  uri: string;
}

export type SetDropperState = React.Dispatch<React.SetStateAction<DropperState>>;

const DropperV2DropsListView = ({
  contractAddress,
  selected,
  setSelected,
  setTotalDrops,
  onChange,
  contractState,
}: {
  contractAddress: string;
  selected: number;
  setSelected: (arg0: number) => void;
  setTotalDrops: (arg0: number) => void;
  onChange: (id: string, metadata: unknown) => void;
  contractState: any;
}) => {
  const router = useRouter();

  const [queryDropId, setQueryDropId] = useState<number | undefined>(undefined);
  const [filter, setFilter] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [dropperState, setDropperState] = useState<DropperState>({
    tokenType: 1,
    tokenAddress: "",
    tokenId: "",
    amount: "",
    authorizationTokenAddress: "",
    authorizationPoolId: "",
    uri: "",
  });
  const [adminOnly, setAdminOnly] = useState(false);

  useEffect(() => {
    setQueryDropId(
      typeof router.query.dropId === "string" ? Number(router.query.dropId) : undefined,
    );
  }, [router.query.dropId]);

  return (
    <Flex
      direction="column"
      bg="#2d2d2d"
      borderRadius="20px"
      gap="30px"
      p="30px"
      w="400px"
      minH="700px"
      color="white"
      position="absolute"
      top="00"
      bottom="0"
      zIndex="2"
    >
      <Text fontWeight="700" fontSize="24px">
        Drops
      </Text>
      <Input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="search"
        borderRadius="10px"
        p="8px 15px"
      />
      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="email-alerts" mb="0">
          manageable only
        </FormLabel>
        <Switch
          sx={{ "span.chakra-switch__track:not([data-checked])": { backgroundColor: "#666666" } }}
          isChecked={adminOnly}
          onChange={(e) => setAdminOnly(e.target.checked)}
          colorScheme="green"
        />
      </FormControl>

      <DropperV2DropsList
        contractAddress={contractAddress}
        onChange={onChange}
        setSelected={setSelected}
        setTotalDrops={setTotalDrops}
        selected={selected}
        filter={filter}
        queryDropId={queryDropId ?? undefined}
        adminOnly={adminOnly}
      />

      {contractState && (
        <>
          <Button
            width="100%"
            bg="gray.0"
            fontWeight="700"
            fontSize="20px"
            color="#2d2d2d"
            onClick={onOpen}
          >
            + Add new
          </Button>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalBody w="fit-content">
                <DropperV2NewDrop
                  address={contractAddress}
                  onClose={onClose}
                  state={dropperState}
                  setState={setDropperState}
                />
              </ModalBody>
            </ModalContent>
          </Modal>
        </>
      )}
    </Flex>
  );
};

export default DropperV2DropsListView;
