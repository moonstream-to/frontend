import { LinkIcon } from "@chakra-ui/icons";
import {
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  useClipboard,
  useDisclosure,
} from "@chakra-ui/react";
import { AiFillEdit, AiOutlineEdit } from "react-icons/ai";
import DropperV2NewDrop from "../dropperV2/DropperV2NewDrop";
import React, { useEffect, useState } from "react";
import { DropperState } from "../dropperV2/DropperV2DropsListView";
import { DropState } from "../dropperV2/DropperV2DropView";

type DropHeaderProps = {
  address: string;
  dropId: string;
  PORTAL_PATH: string;
  toggleEdit: () => void;
  isEdit: boolean;
  title?: string;
  status?: boolean;
  dropState?: DropState | undefined;
};

const getNewDropState = (dropState: DropState | undefined): DropperState => {
  return {
    tokenType: Number(dropState?.drop.tokenType) ?? 1,
    tokenAddress: dropState?.drop.tokenAddress ?? "",
    tokenId: dropState?.drop.tokenId ?? "",
    amount: dropState?.drop.amount ?? "",
    authorizationTokenAddress: dropState?.dropAuthorization.terminusAddress ?? "",
    authorizationPoolId: dropState?.dropAuthorization.poolId ?? "",
    uri: dropState?.uri ?? "",
  };
};

const DropHeader: React.FC<DropHeaderProps> = ({
  address,
  dropId,
  PORTAL_PATH,
  toggleEdit,
  isEdit,
  title,
  status,
  dropState,
}) => {
  const [newDropState, setNewDropState] = useState<DropperState>(getNewDropState(dropState));

  useEffect(() => {
    setNewDropState(getNewDropState(dropState));
  }, [dropState]);

  const { onOpen: onOpenClone, isOpen: isOpenClone, onClose: onCloseClone } = useDisclosure();

  const { onCopy, hasCopied } = useClipboard(
    `${PORTAL_PATH}/dropperV2/?contractAddress=${address}&dropId=${dropId}`,
  );

  return (
    <Flex w="100%" justifyContent="space-between" mb="20px">
      <Flex gap="30px" position="relative" w="fit-content" alignItems="center">
        {title && (
          <Text fontWeight="700" fontSize="24px">
            {title}
          </Text>
        )}
        {hasCopied && <Text variant="tooltip">copied</Text>}
        <Flex gap="10px" alignItems="center">
          <Text textAlign="start" color="#c2c2c2" w="fit-content" py={1} pr={0} fontSize="20px">
            {`drop ${dropId}`}
          </Text>
          <IconButton
            bg="transparent"
            paddingInline="0"
            onClick={onCopy}
            color="#c2c2c2"
            _hover={{ bg: "transparent", color: "white" }}
            icon={<LinkIcon />}
            aria-label="copy link"
            minWidth="0"
          />
        </Flex>
        {status !== undefined && (
          <Text fontWeight="700" fontSize="16px" color={status ? "#46C370" : "#EE8686"}>
            {status ? "Active" : "Inactive"}
          </Text>
        )}
      </Flex>
      <Flex gap={"15px"} alignItems={"center"}>
        <IconButton
          aria-label={isEdit ? "Disable Edit" : "Enable Edit"}
          bg="transparent"
          _hover={{ bg: "transparent", color: "white" }}
          icon={isEdit ? <AiFillEdit /> : <AiOutlineEdit />}
          onClick={toggleEdit}
        />
        <Text color="#c2c2c2" cursor={"pointer"} onClick={onOpenClone}>
          Clone
        </Text>
        <Modal isOpen={isOpenClone} onClose={onCloseClone}>
          <ModalOverlay />
          <ModalContent>
            <ModalBody w="fit-content">
              <DropperV2NewDrop
                address={address}
                onClose={onCloseClone}
                state={newDropState}
                setState={setNewDropState}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      </Flex>
    </Flex>
  );
};

export default DropHeader;
