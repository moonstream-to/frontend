import {
  Flex,
  Modal,
  ModalContent,
  useDisclosure,
  Text,
  ModalBody,
  Button,
  Spinner,
  Spacer,
  Input,
  Icon,
} from "@chakra-ui/react";
import { ReactNode, useContext, useState } from "react";
import { useDeleteEntity, useJournal } from "../../hooks/useJournal";
import LeaderboardPaginator from "../leaderboard/LeaderboardPaginator";
import { DeleteIcon } from "@chakra-ui/icons";
import AddEntityButton from "./AddEntityButton";
import { AiOutlineSave } from "react-icons/ai";
import Web3Context from "../../contexts/Web3Context/context";

const EntitySelect = ({
  tags,
  onChange,
  children,
  props,
}: {
  tags: string[];
  onChange: (arg0: string) => void;
  children: ReactNode;
  [x: string]: any;
}) => {
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const journal = useJournal({ tags, limit, offset });
  const { isOpen, onClose, onOpen } = useDisclosure();
  const deleteAddress = useDeleteEntity();
  const { chainId, web3 } = useContext(Web3Context);

  const handleClick = (address: string) => {
    onClose();
    onChange(address);
  };
  const [newAddress, setNewAddress] = useState("");
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
                justifyContent={"space-between"}
              >
                <Text>{tags.join(", ")}</Text>

                <Flex direction={"column"}>
                  <Flex gap="15px" mt="20px">
                    <Input
                      placeholder="new address"
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value.trim())}
                    />
                    <AddEntityButton
                      address={newAddress}
                      tags={tags}
                      blockchain={String(chainId)}
                      w={"40px"}
                      h={"40px"}
                      isDisabled={!web3.utils.isAddress(newAddress)}
                      mb={"20px"}
                    >
                      <Icon as={AiOutlineSave} h={5} w={5} />
                    </AddEntityButton>
                  </Flex>
                  {journal.data.entities.map((e) => (
                    <Flex
                      justifyContent={"space-between"}
                      alignItems={"center"}
                      key={e.id}
                      _hover={{ fontWeight: "700" }}
                      cursor={"pointer"}
                    >
                      <Text onClick={() => handleClick(e.address)}>{e.title}</Text>
                      <Spacer />
                      <Text
                        fontFamily="JetBrains Mono, monospace"
                        onClick={() => handleClick(e.address)}
                      >
                        {e.address}
                      </Text>

                      <Button
                        variant={"transparent"}
                        onClick={() =>
                          deleteAddress.mutate({
                            entity: e,
                          })
                        }
                      >
                        {deleteAddress.isLoading && deleteAddress.variables?.entity === e ? (
                          <Spinner />
                        ) : (
                          <DeleteIcon />
                        )}
                      </Button>
                    </Flex>
                  ))}
                </Flex>
                <LeaderboardPaginator
                  onPageSizeChange={setLimit}
                  onOffsetChange={setOffset}
                  count={journal.data.totalLength}
                  isFetching={journal.isFetching}
                />
              </Flex>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default EntitySelect;
