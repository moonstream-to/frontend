import {
  Flex,
  Modal,
  ModalContent,
  useDisclosure,
  Text,
  ModalBody,
  Button,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { useDeleteEntity, useJournal } from "../../hooks/useJournal";
import { AiOutlineDelete, HiOutlineTrash, IoTrashOutline } from "react-icons/all";

const EntitySelect = ({
  journalName,
  onChange,
  children,
  props,
}: {
  journalName: string;
  onChange: (arg0: string) => void;
  children: ReactNode;
  [x: string]: any;
}) => {
  const journal = useJournal({ name: journalName });
  const { isOpen, onClose, onOpen } = useDisclosure();
  const deleteAddress = useDeleteEntity();
  const handleClick = (address: string) => {
    onClose();
    onChange(address);
  };
  return (
    <Flex
      cursor={"pointer"}
      alignItems={"center"}
      justifyContent={"center"}
      onClick={onOpen}
      {...props}
    >
      {children}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent w={"800px"}>
          <ModalBody w={"800px"}>
            {journal.data?.entities && (
              <Flex
                direction={"column"}
                gap={"10px"}
                bgColor="#1A1D22"
                borderRadius="20px"
                p="30px"
                minH={"400px"}
                border={"1px solid white"}
              >
                {journal.data.entities.map((e) => (
                  <Flex
                    justifyContent={"space-between"}
                    key={e.id}
                    _hover={{ fontWeight: "700" }}
                    cursor={"pointer"}
                  >
                    <Text onClick={() => handleClick(e.address)}>{e.title}</Text>
                    {/*<Flex gap={"10px"} alignItems={"center"}>*/}
                    <Text
                      fontFamily="JetBrains Mono, monospace"
                      onClick={() => handleClick(e.address)}
                    >
                      {e.address}
                    </Text>

                    {/*<Button onClick={() => deleteAddress.mutate({ journalName, entityId: e.id })}>*/}
                    {/*  D*/}
                    {/*</Button>*/}
                    {/*</Flex>*/}
                  </Flex>
                ))}
              </Flex>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default EntitySelect;
