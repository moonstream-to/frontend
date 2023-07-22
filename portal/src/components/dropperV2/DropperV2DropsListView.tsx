/* eslint-disable @typescript-eslint/no-var-requires */
import { useContext, useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import Web3Context from "../../contexts/Web3Context/context";
import { useRouter } from "next/router";
import { MAX_INT } from "../../constants";
import DropperV2DropsList from "./DropperV2DropsList";
import DropperV2NewDrop from "./DropperV2NewDrop";

const DropperV2DropsListView = ({
  contractAddress,
  selected,
  setSelected,
  onChange,
  contractState,
}: {
  contractAddress: string;
  selected: number;
  setSelected: (arg0: number) => void;
  onChange: (id: string, metadata: unknown) => void;
  contractState: any;
}) => {
  const router = useRouter();

  const [queryDropId, setQueryDropId] = useState<number | undefined>(undefined);
  const [filter, setFilter] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const web3ctx = useContext(Web3Context);

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
      maxH="700px"
      color="white"
    >
      <Text fontWeight="700" fontSize="24px">
        drops
      </Text>
      <Input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="search"
        borderRadius="10px"
        p="8px 15px"
      />

      <DropperV2DropsList
        contractAddress={contractAddress}
        onChange={onChange}
        setSelected={setSelected}
        selected={selected}
        filter={filter}
        queryDropId={queryDropId ?? undefined}
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
                <DropperV2NewDrop address={contractAddress} onClose={onClose} />
              </ModalBody>
            </ModalContent>
          </Modal>
        </>
      )}
    </Flex>
  );
};

export default DropperV2DropsListView;
